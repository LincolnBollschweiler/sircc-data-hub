import { db } from "@/drizzle/db";
import {
	client,
	clientService,
	service,
	site,
	user,
	location,
	clientReentryCheckListItem,
	referralSource,
	city,
	visit,
	referredOut,
	coach,
	coachTraining,
	coachHours,
	coachMileage,
} from "@/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
// import { eq, and, or, sql } from "drizzle-orm";
import { desc, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import {
	getAllUsersGlobalTag,
	getClientGlobalTag,
	getClientIdTag,
	getCoachGlobalTag,
	getCoachIdTag,
	getUserIdTag,
	getUserSitesGlobalTag,
} from "@/userInteractions/cacheTags";
import { revalidateClientCache, revalidateCoachCache, revalidateUserCache } from "@/userInteractions/cache";
import { syncClerkUserMetadata } from "@/services/clerk";
import { alias } from "drizzle-orm/pg-core";

//#region User CRUD operations
export async function insertclerkUser(data: typeof user.$inferInsert) {
	const [applicant] = await db
		.insert(user)
		.values(data)
		.returning()
		.onConflictDoUpdate({
			target: [user.clerkUserId],
			set: data,
		});

	if (applicant == null) {
		console.error("Failed to insert user");
		throw new Error("Failed to insert user");
	}

	revalidateUserCache(applicant.id);
	return applicant;
}

export async function updateClerkUser(
	{ clerkUserId }: { clerkUserId: string },
	data: Partial<typeof user.$inferInsert>
) {
	const [updatedUser] = await db.update(user).set(data).where(eq(user.clerkUserId, clerkUserId)).returning();
	if (updatedUser == null) throw new Error("Failed to update user");
	revalidateUserCache(updatedUser.id);
	return updatedUser;
}

export async function addUser(data: typeof user.$inferInsert & { isReentryClient?: boolean }) {
	const userInsert = await db.transaction(async (tx) => {
		const [newUser] = await tx
			.insert(user)
			.values({ ...data, accepted: true })
			.returning();
		if (!newUser) throw new Error("Failed to add user");

		if (data.role === "client" || data.role === "client-volunteer") {
			const [newClient] = await tx
				.insert(client)
				.values({
					id: newUser.id,
					isReentryClient: data.isReentryClient ?? false,
				})
				.returning();
			if (!newClient) throw new Error("Failed to create client for user");
		}
		return newUser;
	});

	revalidateUserCache(userInsert.id);
	revalidateClientCache(userInsert.id);
	return userInsert;
}

export async function updateUserById(id: string, data: Partial<typeof user.$inferInsert>) {
	const [updatedUser] = await db.update(user).set(data).where(eq(user.id, id)).returning();
	if (updatedUser == null) throw new Error("Failed to update user");
	revalidateUserCache(updatedUser.id);
	return updatedUser;
}

export async function getUserById(id: string) {
	const [userRow] = await db.select().from(user).where(eq(user.id, id)).limit(1);
	return userRow;
}

export async function updateClerkUserById(
	id: string,
	data: Partial<typeof user.$inferInsert> & { isReentryClient?: boolean }
) {
	try {
		const updatedUser = await db.transaction(async (tx) => {
			const [userUpdated] = await tx.update(user).set(data).where(eq(user.id, id)).returning();

			if (!userUpdated) throw new Error("Failed to update user");

			if ("role" in data) {
				if (data.role === "client" || data.role === "client-volunteer") {
					const [newClient] = await tx
						.insert(client)
						.values({
							id: userUpdated.id,
							isReentryClient: data.isReentryClient ?? false,
						})
						.onConflictDoUpdate({
							target: [client.id],
							set: { isReentryClient: data.isReentryClient ?? false },
						})
						.returning();

					if (!newClient) throw new Error("Failed to create client for user");
				}
				if (data.role === "coach") {
					const [newCoach] = await tx
						.insert(coach)
						.values({
							id: userUpdated.id,
						})
						.onConflictDoNothing()
						.returning();

					if (!newCoach) throw new Error("Failed to create coach for user");
				}
				if (userUpdated.clerkUserId) {
					await syncClerkUserMetadata(userUpdated);
				}
			}
			return userUpdated; // returned if successfull
		});

		revalidateUserCache(updatedUser.id);
		revalidateClientCache(updatedUser.id);
		revalidateCoachCache(updatedUser.id);
		return { error: false, message: "User updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: true, message: (error as Error).message };
	}
}

export async function updateUserFull({ id }: { id: string }, data: Partial<typeof user.$inferInsert>) {
	const [updatedUser] = await db.update(user).set(data).where(eq(user.id, id)).returning();
	if (updatedUser == null) throw new Error("Failed to update user");
	revalidateUserCache(updatedUser.id);
	return updatedUser;
}

export async function deleteClerkUser({ clerkUserId }: { clerkUserId: string }) {
	const [deletedUser] = await db
		.update(user)
		.set({
			deletedAt: new Date(),
			firstName: "deleted user",
			lastName: "deleted user",
			clerkUserId: "deleted-user",
			email: null,
			photoUrl: null,
		})
		.where(eq(user.clerkUserId, clerkUserId))
		.returning();

	if (!deletedUser) {
		console.warn(`Delete webhook received for non-existent Clerk user: ${clerkUserId}`);
		return null;
	}

	revalidateUserCache(deletedUser.id);
	return deletedUser;
}

const cachedUsers = unstable_cache(
	async () => {
		return await db.select().from(user).where(isNull(user.deletedAt)).orderBy(desc(user.updatedAt));
	},
	["getAllUsers"],
	// { tags: [getAllUsersGlobalTag()] }
	{ tags: [getAllUsersGlobalTag()], revalidate: 5 }
);

export const getAllUsers = async () => cachedUsers();
//#endregion

//#region User Sites
const cachedUserSites = unstable_cache(
	async () => {
		return await db
			.select({
				id: site.id,
				name: site.name,
			})
			.from(site)
			.where(isNull(site.deletedAt))
			.orderBy(site.name);
	},
	["getUserSites"],
	{ tags: [getUserSitesGlobalTag()] }
	// { tags: [getUserSitesGlobalTag()], revalidate: 5 } // HOW TO: set a time-based revalidation alongside tag-based so that data is at most 5 seconds stale
	// requires a hard-refresh too
);

export const getUserSites = async () => cachedUserSites();
//#endregion

//#region CRUD Clients
// types represent one row returned from joins
type User = typeof user.$inferSelect;
export type ClientList = {
	user: User;
	client: typeof client.$inferSelect | null; // null because of leftJoin
	coach: User | null; // null because of leftJoin
	serviceCount: number;
	openRequestsCount: number;
	requestsUpdatedAt: Date | null;
	checkListItemCount: number;
};

function groupBy<T, K extends string | number | symbol>(list: T[], getKey: (item: T) => K): Record<K, T[]> {
	return list.reduce((acc, item) => {
		const key = getKey(item);
		(acc[key] ||= []).push(item);
		return acc;
	}, {} as Record<K, T[]>);
}

export interface ClientServiceFull {
	clientService: typeof clientService.$inferSelect;
	location: typeof location.$inferSelect | null;
	site: typeof site.$inferSelect | null;
	city: typeof city.$inferSelect | null;
	requestedService: typeof service.$inferSelect | null;
	providedService: typeof service.$inferSelect | null;
	referralSource: typeof referralSource.$inferSelect | null;
	referredOut: typeof referralSource.$inferSelect | null;
	visit: typeof visit.$inferSelect | null;
}

export interface ClientFull {
	user: User;
	client: typeof client.$inferSelect;
	coach: User | null;
	coachDetails: Coach | null;
	referralSource: typeof referralSource.$inferSelect | null;
	referredOut: typeof referralSource.$inferSelect | null;
	serviceCount: number;
	openRequestsCount: number;
	requestsUpdatedAt: Date | null;
	clientServices: ClientServiceFull[];
	checkListItems: ClientReentryCheckListItem[];
}

// IMPORTANT ALIASES
const coachUser = alias(user, "coachUser");
const requestedSvc = alias(service, "requestedSvc");
const providedSvc = alias(service, "providedSvc");

const getCachedClient = (id: string) => {
	const cachedFn = unstable_cache(
		async (): Promise<ClientFull | null> => {
			const rows = await db
				.select({
					user,
					client,
					coach: coachUser,
					coachDetails: coach,
					clientService,

					// joins for each clientService
					location,
					site,
					city,
					requestedService: requestedSvc,
					providedService: providedSvc,
					referralSource,
					referredOut,
					visit,

					// computed counts
					serviceCount: sql<number>`
						(SELECT COUNT(*) FROM client_service cs WHERE cs.client_id = ${id})`,
					openRequestsCount: sql<number>`
						(SELECT COUNT(*)
						FROM client_service csr
						WHERE csr.client_id = ${id}
						AND csr.requested_service_id IS NOT NULL
						AND csr.provided_service_id IS NULL)`,
					requestsUpdatedAt: sql<Date | null>`
						(SELECT MAX(csr.updated_at)
						FROM client_service csr
						WHERE csr.client_id = ${id})`,
				})
				.from(user)
				.leftJoin(client, eq(user.id, client.id))
				.leftJoin(coachUser, eq(client.coachId, coachUser.id))
				.leftJoin(coach, eq(client.coachId, coach.id))
				.leftJoin(clientService, eq(client.id, clientService.clientId))
				.leftJoin(location, eq(clientService.locationId, location.id))
				.leftJoin(site, eq(clientService.siteId, site.id))
				.leftJoin(city, eq(clientService.cityId, city.id))
				.leftJoin(requestedSvc, eq(clientService.requestedServiceId, requestedSvc.id))
				.leftJoin(providedSvc, eq(clientService.providedServiceId, providedSvc.id))
				.leftJoin(referralSource, eq(clientService.referralSourceId, referralSource.id))
				.leftJoin(referredOut, eq(clientService.referredOutId, referredOut.id))
				.leftJoin(visit, eq(clientService.visitId, visit.id))
				.leftJoin(clientReentryCheckListItem, eq(client.id, clientReentryCheckListItem.clientId))
				.where(and(eq(user.id, id), eq(user.accepted, true), eq(user.role, "client"), isNull(user.deletedAt)))
				.orderBy(desc(clientService.updatedAt));

			if (rows.length === 0) return null;

			// --------------------------
			// GROUP INTO NESTED STRUCTURE
			// --------------------------

			if (!rows.length) return null;
			const first = rows[0]!;

			const servicesGrouped = groupBy(
				rows.filter((r) => r.clientService?.id),
				(r) => r.clientService!.id
			);

			// 1. Narrow grouped values so TS knows each group has at least one element
			const groupedArrays = Object.values(servicesGrouped).filter(
				(g): g is NonNullable<typeof g> & [NonNullable<(typeof g)[0]>, ...typeof g] =>
					Array.isArray(g) && g.length > 0
			);

			// 2. Map into ClientServiceFull[]
			const clientServices: ClientServiceFull[] = groupedArrays.map((group) => {
				const first = group[0]; // now TS knows this exists

				return {
					clientService: first.clientService!, // required
					site: first.site ?? null,
					city: first.city ?? null,
					location: first.location ?? null,
					referralSource: first.referralSource ?? null,
					referredOut: first.referredOut ?? null,
					requestedService: first.requestedService ?? null,
					providedService: first.providedService ?? null,
					visit: first.visit ?? null,
				};
			});

			const checkListItems: ClientReentryCheckListItem[] = await db
				.select()
				.from(clientReentryCheckListItem)
				.where(eq(clientReentryCheckListItem.clientId, id));

			// FINAL STRUCT
			return {
				user: first.user,
				client: first.client!,
				coach: first.coach,
				coachDetails: first.coachDetails,
				referralSource: first.referralSource,
				referredOut: first.referredOut,
				serviceCount: first.serviceCount,
				openRequestsCount: first.openRequestsCount,
				requestsUpdatedAt: first.requestsUpdatedAt,
				clientServices,
				checkListItems,
			};
		},
		["getClientById", id],
		{ tags: [getClientIdTag(id), getUserIdTag(id)] }
	);
	return cachedFn(); // execute it only when this function is called
};
export const getClientById = async (id: string) => getCachedClient(id);

export const updateClientById = async (
	clientId: string,
	data: Partial<typeof client.$inferInsert>,
	coachIsViewing?: boolean
) => {
	const [updatedClient] = await db.update(client).set(data).where(eq(client.id, clientId)).returning();
	revalidateClientCache(clientId, !!coachIsViewing);
	return updatedClient;
};

const cachedClients = unstable_cache(
	async (): Promise<ClientList[]> => {
		return await db
			.select({
				user,
				client,
				coach: coachUser,
				serviceCount: sql<number>`
					(SELECT COUNT(*)
					FROM client_service cs
					WHERE cs.client_id = ${client.id})
				`,
				openRequestsCount: sql<number>`
					(SELECT COUNT(*)
					FROM client_service csr
					WHERE csr.client_id = ${client.id}
					AND csr.requested_service_id IS NOT NULL
					AND csr.provided_service_id IS NULL)
				 `,
				requestsUpdatedAt: sql<Date | null>`
					(SELECT MAX(csr.updated_at)
					FROM client_service csr
					WHERE csr.client_id = ${client.id})
				`,
				checkListItemCount: sql<number>`
						(SELECT COUNT(*) FROM client_reentry_check_list_item crcli WHERE crcli.client_id = ${client.id})`,
			})
			.from(user)
			.leftJoin(client, eq(user.id, client.id)) // join user.id to client.id
			.leftJoin(coachUser, eq(client.coachId, coachUser.id))
			.where(and(isNull(user.deletedAt), eq(user.accepted, true), eq(user.role, "client")))
			.orderBy(
				desc(
					sql`
						COALESCE(
						(SELECT MAX(csr.updated_at)
						FROM client_service csr
						WHERE csr.client_id = ${client.id}),
						${client.updatedAt}
					)`
				)
			);
	},
	["getAllClients"],
	{ tags: [getAllUsersGlobalTag()] }
);
export const getAllClients = async () => cachedClients();
//#endregion

//#region CRUD Coaches
export const cachedCoachUsers = unstable_cache(
	async () => {
		return await db
			.select()
			.from(user)
			.where(and(eq(user.role, "coach"), isNull(user.deletedAt)))
			.orderBy(user.lastName);
	},
	["getAllCoaches"],
	{ tags: [getAllUsersGlobalTag()] }
);

export const getAllCoachUsers = async () => cachedCoachUsers();
export type Coach = typeof coach.$inferSelect;
export type CoachList = {
	user: User;
	coach: Coach | null; // null because of leftJoin
	clientCount: number;
	trainingsCompleted: number;
	volunteerHours: number;
	paidHours: number;
};

const cachedCoaches = unstable_cache(
	async (): Promise<CoachList[]> => {
		return await db
			.select({
				user,
				coach,
				clientCount: sql<number>`
					(SELECT COUNT(*) FROM client c WHERE c.coach_id = ${coach.id} AND c.deleted_at IS NULL)					
				`,
				trainingsCompleted: sql<number>`
					(SELECT COUNT(*) FROM coach_training ct WHERE ct.coach_id = ${coach.id})`,
				volunteerHours: sql<number>`
					(SELECT COALESCE(SUM(csh.volunteer_hours), 0) FROM coach_hours csh WHERE csh.coach_id = ${coach.id})`,
				paidHours: sql<number>`
					(SELECT COALESCE(SUM(csh.paid_hours), 0) FROM coach_hours csh WHERE csh.coach_id = ${coach.id})`,
			})
			.from(user)
			.leftJoin(coach, eq(user.id, coach.id)) // join user.id to coach.id
			.where(and(isNull(user.deletedAt), eq(user.role, "coach")))
			.orderBy(user.lastName);
	},
	["getAllCoachesDetailed"],
	{ tags: [getAllUsersGlobalTag(), getCoachGlobalTag(), getClientGlobalTag()] }
);
export const getAllCoaches = async () => cachedCoaches();

export type Client = typeof client.$inferSelect;
export type CoachTraining = typeof coachTraining.$inferSelect;
export type CoachHours = typeof coachHours.$inferSelect;
export type CoachMiles = typeof coachMileage.$inferSelect;
export type CoachFull = {
	user: User;
	coach: Coach | null;
	coachTrainings: CoachTraining[];
	coachHours: CoachHours[];
	coachMiles: CoachMiles[];
	clients: ClientList[];
};

const getCachedCoach = (id: string) => {
	const cachedFn = unstable_cache(
		async (): Promise<CoachFull | null> => {
			// Get base user + coach row
			const row = await db
				.select({ user, coach })
				.from(user)
				.leftJoin(coach, eq(user.id, coach.id))
				.where(and(eq(user.id, id), eq(user.accepted, true), eq(user.role, "coach"), isNull(user.deletedAt)))
				.limit(1);

			if (row.length === 0) return null;

			const { user: userRow, coach: coachRow } = row[0]!;

			const ct = async () => db.select().from(coachTraining).where(eq(coachTraining.coachId, id));

			const cHR = async () =>
				db.select().from(coachHours).where(eq(coachHours.coachId, id)).orderBy(desc(coachHours.date));

			const cMR = async () =>
				db.select().from(coachMileage).where(eq(coachMileage.coachId, id)).orderBy(desc(coachMileage.date));

			const cR = async () =>
				db
					.select({
						user,
						client,
						checkListItemCount: sql<number>`
						(SELECT COUNT(*) FROM client_reentry_check_list_item crcli WHERE crcli.client_id = ${client.id})`,
					})
					.from(user)
					.leftJoin(client, eq(user.id, client.id))
					.where(and(eq(client.coachId, id), isNull(client.deletedAt), isNull(user.deletedAt)));

			const [coachTrainings, coachHoursRows, coachMilesRows, clientsRow] = await Promise.all([
				ct(),
				cHR(),
				cMR(),
				cR(),
			]);

			const clients = await Promise.all(
				clientsRow.map(async (c) => {
					if (!c.client) throw new Error("Client data missing");
					const clientId = c.client.id;

					const serviceCountResult = await db.execute<{
						serviceCount: number;
					}>(sql`
						SELECT COUNT(*)::int AS "serviceCount"
						FROM client_service cs
						WHERE cs.client_id = ${clientId}
					`);

					const serviceCount = serviceCountResult.rows[0]?.serviceCount ?? 0;

					const openRequestsResult = await db.execute<{
						openRequestsCount: number;
					}>(sql`
						SELECT COUNT(*)::int AS "openRequestsCount"
						FROM client_service csr
						WHERE csr.client_id = ${clientId}
						AND csr.requested_service_id IS NOT NULL
						AND csr.provided_service_id IS NULL
					`);

					const openRequestsCount = openRequestsResult.rows[0]?.openRequestsCount ?? 0;

					return {
						...c,
						serviceCount,
						openRequestsCount,
					};
				})
			);

			return {
				user: userRow,
				coach: coachRow,
				coachTrainings,
				coachHours: coachHoursRows,
				coachMiles: coachMilesRows,
				clients: clients as ClientList[],
			};
		},
		["getCoach", id],
		{ tags: [getCoachIdTag(id), getUserIdTag(id), getClientGlobalTag()] }
	);
	return cachedFn();
};
export const getCoachById = async (id: string) => getCachedCoach(id);

export type CoachUpdate = Awaited<ReturnType<typeof updateCoachById>>;
export const updateCoachById = async (
	coachId: string,
	data: { coach: Partial<typeof coach.$inferInsert>; user: Partial<typeof user.$inferInsert> }
) => {
	const updatedCoach = await db.transaction(async (tx) => {
		const [coachUpdated] = await tx.update(coach).set(data.coach).where(eq(coach.id, coachId)).returning();
		if (!coachUpdated) throw new Error("Failed to update coach");

		const [userUpdated] = await tx.update(user).set(data.user).where(eq(user.id, coachId)).returning();
		if (!userUpdated) throw new Error("Failed to update user");

		return {
			coach: coachUpdated,
			user: userUpdated,
		};
	});

	revalidateUserCache(coachId);
	revalidateCoachCache(coachId);
	return updatedCoach;
};

export type ClientUpdate = Awaited<ReturnType<typeof updateClientUserById>>;
export const updateClientUserById = async (
	clientId: string,
	data: { user: Partial<typeof user.$inferInsert>; client: Partial<typeof client.$inferInsert> }
) => {
	const updatedClient = await db.transaction(async (tx) => {
		const [clientUpdated] = await tx.update(client).set(data.client).where(eq(client.id, clientId)).returning();
		if (!clientUpdated) throw new Error("Failed to update client");

		const [userUpdated] = await tx.update(user).set(data.user).where(eq(user.id, clientId)).returning();
		if (!userUpdated) throw new Error("Failed to update user");

		return {
			client: clientUpdated,
			user: userUpdated,
		};
	});

	revalidateUserCache(clientId);
	revalidateClientCache(clientId);
	return updatedClient;
};

export type CoachTrainings = (typeof coachTraining.$inferSelect)[];
export const getTrainingsForCoach = async (coachId: string) => {
	const items = await db.select().from(coachTraining).where(eq(coachTraining.coachId, coachId));
	return items;
};

export const addCoachTrainingById = async (coachId: string, trainingId: string) => {
	const [newItem] = await db.insert(coachTraining).values({ coachId, trainingId }).returning();

	revalidateCoachCache(coachId);
	return newItem;
};

export const deleteCoachTrainingById = async (trainingId: string) => {
	const [deletedItem] = await db.delete(coachTraining).where(eq(coachTraining.trainingId, trainingId)).returning();
	if (deletedItem == null) {
		console.error("Failed to delete coach training");
		throw new Error("Failed to delete coach training");
	}
	revalidateCoachCache(deletedItem.coachId);
	return deletedItem;
};

export const addCoachHoursById = async (coachId: string, data: Partial<CoachHours>) => {
	const [newItem] = await db
		.insert(coachHours)
		.values({ ...data, coachId })
		.returning();

	revalidateCoachCache(coachId);
	return newItem;
};

export const updateCoachHoursById = async (hoursId: string, data: Partial<CoachHours>) => {
	const [updatedItem] = await db.update(coachHours).set(data).where(eq(coachHours.id, hoursId)).returning();
	if (updatedItem == null) {
		console.error("Failed to update coach hours");
		throw new Error("Failed to update coach hours");
	}
	revalidateCoachCache(updatedItem.coachId);
	return updatedItem;
};

export const deleteCoachHoursById = async (hoursId: string) => {
	const [deletedItem] = await db.delete(coachHours).where(eq(coachHours.id, hoursId)).returning();
	if (deletedItem == null) {
		console.error("Failed to delete coach hours");
		throw new Error("Failed to delete coach hours");
	}
	revalidateCoachCache(deletedItem.coachId);
	return deletedItem;
};

export const addCoachMileageById = async (coachId: string, data: Partial<CoachMiles>) => {
	const [newItem] = await db
		.insert(coachMileage)
		.values({ ...data, coachId })
		.returning();
	revalidateCoachCache(coachId);
	return newItem;
};

export const updateCoachMileageById = async (mileageId: string, data: Partial<CoachMiles>) => {
	const [updatedItem] = await db.update(coachMileage).set(data).where(eq(coachMileage.id, mileageId)).returning();
	if (updatedItem == null) {
		console.error("Failed to update coach mileage");
		throw new Error("Failed to update coach mileage");
	}
	revalidateCoachCache(updatedItem.coachId);
	return updatedItem;
};

export const deleteCoachMileageById = async (mileageId: string) => {
	const [deletedItem] = await db.delete(coachMileage).where(eq(coachMileage.id, mileageId)).returning();
	if (deletedItem == null) {
		console.error("Failed to delete coach mileage");
		throw new Error("Failed to delete coach mileage");
	}
	revalidateCoachCache(deletedItem.coachId);
	return deletedItem;
};
//#endregion

//#region Client Services
export type ClientServiceInsert = typeof clientService.$inferInsert;

export const insertClientService = async (data: ClientServiceInsert, coachIsViewing?: boolean) => {
	const [newService] = await db.insert(clientService).values(data).returning();

	if (newService == null) {
		console.error("Failed to create client service");
		throw new Error("Failed to create client service");
	}

	revalidateClientCache(data.clientId, !!coachIsViewing);
	return newService;
};

export const updateClientServiceById = async (
	serviceId: string,
	data: Partial<ClientServiceInsert>,
	coachIsViewing?: boolean
) => {
	const [updatedService] = await db
		.update(clientService)
		.set(data)
		.where(eq(clientService.id, serviceId))
		.returning();
	if (updatedService == null) {
		console.error("Failed to update client service");
		throw new Error("Failed to update client service");
	}
	revalidateClientCache(updatedService.clientId, !!coachIsViewing);
	return updatedService;
};

export const deleteClientServiceById = async (serviceId: string, coachIsViewing?: boolean) => {
	const [deletedService] = await db.delete(clientService).where(eq(clientService.id, serviceId)).returning();

	if (deletedService == null) {
		console.error("Failed to delete client service");
		throw new Error("Failed to delete client service");
	}

	revalidateClientCache(deletedService.clientId, !!coachIsViewing);
	return deletedService;
};
//#endregion

//#region Client Checklist Items
export const addClientReentryCheckListItemForClient = async (
	clientId: string,
	reentryCheckListItemId: string,
	coachIsViewing?: boolean
) => {
	const [newItem] = await db
		.insert(clientReentryCheckListItem)
		.values({
			clientId,
			reentryCheckListItemId,
		})
		.returning();

	if (newItem == null) {
		console.error("Failed to add client reentry checklist item");
		throw new Error("Failed to add client reentry checklist item");
	}

	revalidateClientCache(clientId, !!coachIsViewing);
	return newItem;
};

export const removeClientReentryCheckListItemForClient = async (
	clientId: string,
	reentryCheckListItemId: string,
	coachIsViewing?: boolean
) => {
	const [deletedItem] = await db
		.delete(clientReentryCheckListItem)
		.where(
			and(
				eq(clientReentryCheckListItem.clientId, clientId),
				eq(clientReentryCheckListItem.reentryCheckListItemId, reentryCheckListItemId)
			)
		)
		.returning();
	if (deletedItem == null) {
		console.error("Failed to remove client reentry checklist item");
		throw new Error("Failed to remove client reentry checklist item");
	}
	revalidateClientCache(clientId, !!coachIsViewing);
	return deletedItem;
};

export type ClientReentryCheckListItem = typeof clientReentryCheckListItem.$inferSelect;
export const getClientReentryCheckListItemsForClient = async (clientId: string) => {
	const items = await db
		.select({
			reentryCheckListItemId: clientReentryCheckListItem.reentryCheckListItemId,
			clientId: clientReentryCheckListItem.clientId,
		})
		.from(clientReentryCheckListItem)
		.where(eq(clientReentryCheckListItem.clientId, clientId));
	return items;
};
//#endregion
