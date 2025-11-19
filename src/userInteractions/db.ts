import { db } from "@/drizzle/db";
import {
	client,
	clientService,
	service,
	site,
	user,
	location,
	clientReentryCheckListItem,
	reentryCheckListItem,
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
	getClientIdTag,
	getUserIdTag,
	// getClientIdTag,
	// getUserIdTag,
	getUserSitesGlobalTag,
} from "@/userInteractions/cacheTags";
import { revalidateClientCache, revalidateUserCache } from "@/userInteractions/cache";
import { syncClerkUserMetadata } from "@/services/clerk";
import { alias } from "drizzle-orm/pg-core";

//#region User CRUD operations
export async function insertUser(data: typeof user.$inferInsert) {
	console.log("Inserting user:", data);
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

export async function updateUser({ clerkUserId }: { clerkUserId: string }, data: Partial<typeof user.$inferInsert>) {
	console.log("Updating user with clerkUserId:", clerkUserId, "Data:", data);
	const [updatedUser] = await db.update(user).set(data).where(eq(user.clerkUserId, clerkUserId)).returning();

	if (updatedUser == null) throw new Error("Failed to update user");

	revalidateUserCache(updatedUser.id);
	return updatedUser;
}

export async function updateUserById(
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

				await syncClerkUserMetadata(userUpdated);
			}
			return userUpdated; // returned if successfull
		});

		revalidateUserCache(updatedUser.id);
		return { error: false, message: "User updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: true, message: (error as Error).message };
	}
}

export async function updateUserFull({ id }: { id: string }, data: Partial<typeof user.$inferInsert>) {
	console.log("Updating user with id:", id, "Data:", data);
	const [updatedUser] = await db.update(user).set(data).where(eq(user.id, id)).returning();

	if (updatedUser == null) throw new Error("Failed to update user");

	revalidateUserCache(updatedUser.id);
	return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
	// console.log("Deleting user with clerkUserId:", clerkUserId);
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
	reentryItems: {
		clientReentryCheckListItem: typeof clientReentryCheckListItem.$inferSelect;
		reentryCheckListItem: typeof reentryCheckListItem.$inferSelect | null;
	}[];
}

export interface ClientFull {
	user: User;
	client: typeof client.$inferSelect;
	coach: User | null;
	referralSource: typeof referralSource.$inferSelect | null;
	referredOut: typeof referralSource.$inferSelect | null;
	serviceCount: number;
	openRequestsCount: number;
	requestsUpdatedAt: Date | null;
	clientServices: ClientServiceFull[];
}

// IMPORTANT ALIASES
const coachUser = alias(user, "coachUser");
const requestedSvc = alias(service, "requestedSvc");
const providedSvc = alias(service, "providedSvc");

const getCachedClient = (id: string) => {
	const cachedFn = unstable_cache(
		async (): Promise<ClientFull | null> => {
			// console.log("Fetching from cacked client from DB (not cache):", id);
			const rows = await db
				.select({
					user,
					client,
					coach: coachUser,

					// clientService
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

					// reentry join
					clientReentryCheckListItem,
					reentryCheckListItem,

					// computed counts
					serviceCount: sql<number>`
						(SELECT COUNT(*) FROM client_service cs WHERE cs.client_id = ${id} AND cs.deleted_at IS NULL)`,
					openRequestsCount: sql<number>`
						(SELECT COUNT(*)
						FROM client_service csr
						WHERE csr.client_id = ${id}
						AND csr.requested_service_id IS NOT NULL
						AND csr.provided_service_id IS NULL
						AND csr.deleted_at IS NULL)`,
					requestsUpdatedAt: sql<Date | null>`
						(SELECT MAX(csr.updated_at)
						FROM client_service csr
						WHERE csr.client_id = ${id})`,
				})
				.from(user)
				.leftJoin(client, eq(user.id, client.id))
				.leftJoin(coachUser, eq(client.coachId, coachUser.id))
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
				.leftJoin(
					reentryCheckListItem,
					eq(clientReentryCheckListItem.reentryCheckListItemId, reentryCheckListItem.id)
				)
				.where(
					and(
						eq(user.id, id),
						eq(user.accepted, true),
						eq(user.role, "client"),
						isNull(user.deletedAt),
						isNull(clientService.deletedAt)
					)
				)
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

					reentryItems: group
						.filter((r) => r.reentryCheckListItem)
						.map((r) => ({
							clientReentryCheckListItem: r.clientReentryCheckListItem!,
							reentryCheckListItem: r.reentryCheckListItem!,
						})),
				};
			});

			// FINAL STRUCT
			return {
				user: first.user,
				client: first.client!,
				coach: first.coach,
				referralSource: first.referralSource,
				referredOut: first.referredOut,
				serviceCount: first.serviceCount,
				openRequestsCount: first.openRequestsCount,
				requestsUpdatedAt: first.requestsUpdatedAt,
				clientServices,
			};
		},
		["getClientById", id],
		{ tags: [getClientIdTag(id), getUserIdTag(id)] }
	);
	return cachedFn(); // execute it only when this function is called
};
export const getClientById = async (id: string) => getCachedClient(id);

export const updateClientById = async (clientId: string, data: Partial<typeof client.$inferInsert>) => {
	console.log("Updating client coach with id:", clientId, "Data:", data);
	const [updatedClient] = await db.update(client).set(data).where(eq(client.id, clientId)).returning();
	revalidateClientCache(clientId);
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
					WHERE cs.client_id = ${client.id}
					AND cs.deleted_at IS NULL)
				`,
				openRequestsCount: sql<number>`
					(SELECT COUNT(*)
					FROM client_service csr
					WHERE csr.client_id = ${client.id}
					AND csr.requested_service_id IS NOT NULL
					AND csr.provided_service_id IS NULL
					AND csr.deleted_at IS NULL)
				 `,
				requestsUpdatedAt: sql<Date | null>`
					(SELECT MAX(csr.updated_at)
					FROM client_service csr
					WHERE csr.client_id = ${client.id})
				`,
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
	{ tags: [getAllUsersGlobalTag()] }
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
	clients: ClientFull[];
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

			// Get children (3 separate queries)
			const coachTrainings = await db.select().from(coachTraining).where(eq(coachTraining.coachId, id));

			const coachHoursRows: CoachHours[] = await db.select().from(coachHours).where(eq(coachHours.coachId, id));
			const coachMilesRows: CoachMiles[] = await db
				.select()
				.from(coachMileage)
				.where(eq(coachMileage.coachId, id));

			const clientsRow = await db
				.select({
					user,
					client,
				})
				.from(user)
				.leftJoin(client, eq(user.id, client.id))
				.where(and(eq(client.coachId, id), isNull(client.deletedAt), isNull(user.deletedAt)));

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
						AND cs.deleted_at IS NULL
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
						AND csr.deleted_at IS NULL
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
				clients: clients as ClientFull[],
			};
		},
		["getCoach", id],
		{ tags: [getAllUsersGlobalTag()] }
	);
	return cachedFn();
};

export const getCoachById = async (id: string) => getCachedCoach(id);

//#endregion

//#region Client Services
export type ClientServiceInsert = typeof clientService.$inferInsert;

export const insertClientService = async (data: ClientServiceInsert) => {
	// console.log("Creating client service for clientId:", data.clientId, "Data:", data);
	const [newService] = await db.insert(clientService).values(data).returning();

	if (newService == null) {
		console.error("Failed to create client service");
		throw new Error("Failed to create client service");
	}

	revalidateClientCache(data.clientId);
	return newService;
};

export const deleteClientServiceById = async (serviceId: string) => {
	console.log("Deleting client service with id:", serviceId);
	const [deletedService] = await db
		.update(clientService)
		.set({ deletedAt: new Date() })
		.where(eq(clientService.id, serviceId))
		.returning();

	if (deletedService == null) {
		console.error("Failed to delete client service");
		throw new Error("Failed to delete client service");
	}

	revalidateClientCache(deletedService.clientId);
	return deletedService;
};
//#endregion

//#region Client Checklist Items
export const addClientReentryCheckListItemForClient = async (clientId: string, reentryCheckListItemId: string) => {
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

	revalidateClientCache(clientId);
	return newItem;
};

export const removeClientReentryCheckListItemForClient = async (clientId: string, reentryCheckListItemId: string) => {
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
	revalidateClientCache(clientId);
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
