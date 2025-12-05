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
	coachRoles,
	clientRoles,
	volunteerRoles,
	volunteerHours,
	volunteeringType,
	staffRoles,
	adminRoles,
} from "@/drizzle/schema";
import { eq, and, sql, inArray, isNotNull } from "drizzle-orm";
import { desc, isNull } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
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

		if (data.role?.includes("client")) {
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

export async function updateClientUserById(
	id: string,
	data: Partial<typeof user.$inferInsert> & {
		isReentryClient?: boolean;
		followUpNeeded?: boolean;
		followUpDate?: Date | null;
		followUpNotes?: string | null;
	},
	previousRole?: string
) {
	const updatedUser = await db.transaction(async (tx) => {
		const [userUpdated] = await tx.update(user).set(data).where(eq(user.id, id)).returning();
		if (!userUpdated) throw new Error("Failed to update user");
		if (previousRole && previousRole !== userUpdated.role) await syncClerkUserMetadata(userUpdated);

		if (userUpdated.role?.includes("client")) {
			const clientUpdates: Partial<typeof client.$inferInsert> = {};

			if ("isReentryClient" in data) clientUpdates.isReentryClient = data.isReentryClient!;
			if ("followUpNeeded" in data) clientUpdates.followUpNeeded = data.followUpNeeded!;
			if ("followUpDate" in data) clientUpdates.followUpDate = data.followUpDate!;
			if ("followUpNotes" in data) clientUpdates.followUpNotes = data.followUpNotes!;

			if (Object.keys(clientUpdates).length > 0) {
				const [clientUpdated] = await tx.update(client).set(clientUpdates).where(eq(client.id, id)).returning();

				if (!clientUpdated) {
					throw new Error("Failed to update client for user");
				}
			}
		}

		return userUpdated;
	});

	revalidateUserCache(updatedUser.id);
	revalidateClientCache(updatedUser.id);
	return updatedUser;
}

export async function getUserById(id: string) {
	const [userRow] = await db.select().from(user).where(eq(user.id, id)).limit(1);
	return userRow;
}

export async function updateUserRoleById(id: string, role: User["role"]) {
	const prevRole = (await getUserById(id))?.role;
	if (prevRole?.includes("client") && role && !role.includes("client")) {
		// If removing "client" role, soft delete client row
		await db.update(client).set({ deletedAt: new Date() }).where(eq(client.id, id));
	}

	// if role = "", soft delete user
	const [updatedUser] = role
		? await db.update(user).set({ role }).where(eq(user.id, id)).returning()
		: await db.update(user).set({ deletedAt: new Date() }).where(eq(user.id, id)).returning();
	if (updatedUser == null) throw new Error("Failed to update user role");
	revalidateUserCache(updatedUser.id);
	return updatedUser;
}

export async function updateClerkUserById(
	id: string,
	data: Partial<typeof user.$inferInsert> & { isReentryClient?: boolean }
) {
	try {
		const updatedUser = await db.transaction(async (tx) => {
			// 1. Get current role BEFORE update
			const existing = await tx.query.user.findFirst({
				where: eq(user.id, id),
				columns: { role: true },
			});
			if (!existing) throw new Error("User not found");

			const prevRole = existing.role ?? "";
			const nextRole = data.role ?? prevRole;
			const prevWasCoach = prevRole.includes("coach");
			const nextIsCoach = nextRole.includes("coach");
			const prevWasClient = prevRole.includes("client");
			const nextIsClient = nextRole.includes("client");

			// 2. Update user and handle soft delete if role is empty
			const [userUpdated] = data.role
				? await tx.update(user).set(data).where(eq(user.id, id)).returning()
				: await tx.update(user).set({ deletedAt: new Date() }).where(eq(user.id, id)).returning();

			if (!userUpdated) throw new Error("Failed to update user");

			// 3. If role includes "client", ensure client row exists/updates
			if (prevWasClient && !nextIsClient)
				// A) If was client → now not client → soft delete client row
				await tx.update(client).set({ deletedAt: new Date() }).where(eq(client.id, id));

			if (nextIsClient) {
				await tx
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
			}

			// 4. COACH HANDLING
			//   A) If was coach → now not coach → soft delete coach row
			if (prevWasCoach && !nextIsCoach)
				await tx.update(coach).set({ deletedAt: new Date() }).where(eq(coach.id, id));

			//   B) If now a coach → ensure coach row exists & undelete
			if (nextIsCoach) {
				await tx
					.insert(coach)
					.values({ id: userUpdated.id })
					.onConflictDoUpdate({
						target: [coach.id],
						set: { deletedAt: null },
					});
			}

			// 5. Sync clerk metadata
			await syncClerkUserMetadata(userUpdated);

			return userUpdated;
		});

		// Revalidate caches
		revalidatePath("/admin/applicants");
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
	{ tags: [getAllUsersGlobalTag()] }
	// { tags: [getAllUsersGlobalTag()], revalidate: 5 }
);

export const getAllUsers = async () => cachedUsers();

const cachedDeletedUsers = unstable_cache(
	async () => {
		return await db
			.select()
			.from(user)
			.where(and(isNull(user.clerkUserId), isNotNull(user.deletedAt)))
			.orderBy(desc(user.deletedAt));
	},
	["getAllDeletedUsers"],
	{ tags: [getAllUsersGlobalTag()] }
);

export const getAllDeletedUsers = async () => cachedDeletedUsers();
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
				.where(
					and(
						eq(user.id, id),
						eq(user.accepted, true),
						inArray(user.role, clientRoles),
						isNull(user.deletedAt)
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

export const updateClientById = async (clientId: string, data: Partial<typeof client.$inferInsert>) => {
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
			.where(and(isNull(user.deletedAt), eq(user.accepted, true), inArray(user.role, clientRoles)))
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

//region merge users in DB
export const mergeUsersInDB = async (duplicateUser: User, pendingUser: User) => {
	return await db.transaction(async (tx) => {
		// --- Coach Trainings ---
		const duplicateUserTrainings = await tx.query.coachTraining.findMany({
			where: eq(coachTraining.coachId, duplicateUser.id),
		});

		for (const dt of duplicateUserTrainings) {
			const exists = await tx.query.coachTraining.findFirst({
				where: and(eq(coachTraining.coachId, pendingUser.id), eq(coachTraining.trainingId, dt.trainingId)),
			});
			if (!exists) {
				await tx
					.update(coachTraining)
					.set({ coachId: pendingUser.id })
					.where(
						and(eq(coachTraining.coachId, duplicateUser.id), eq(coachTraining.trainingId, dt.trainingId))
					);
			} else {
				await tx
					.delete(coachTraining)
					.where(
						and(eq(coachTraining.coachId, duplicateUser.id), eq(coachTraining.trainingId, dt.trainingId))
					);
			}
		}

		// --- Coach Hours ---
		await tx.update(coachHours).set({ coachId: pendingUser.id }).where(eq(coachHours.coachId, duplicateUser.id));

		// --- Coach Mileage ---
		await tx
			.update(coachMileage)
			.set({ coachId: pendingUser.id })
			.where(eq(coachMileage.coachId, duplicateUser.id));

		// --- Coach ---
		const duplicateCoach = await tx.query.coach.findFirst({ where: eq(coach.id, duplicateUser.id) });
		const pendingCoach = await tx.query.coach.findFirst({ where: eq(coach.id, pendingUser.id) });

		if (duplicateCoach && pendingCoach) {
			await tx
				.update(coach)
				.set({
					llc: pendingCoach.llc || duplicateCoach.llc,
					website: pendingCoach.website || duplicateCoach.website,
					therapyNotesUrl: pendingCoach.therapyNotesUrl || duplicateCoach.therapyNotesUrl,
					notes: [pendingCoach.notes, duplicateCoach.notes].filter(Boolean).join("\n"),
				})
				.where(eq(coach.id, pendingUser.id));

			await tx.delete(coach).where(eq(coach.id, duplicateUser.id));
		} else if (duplicateCoach && !pendingCoach) {
			await tx.update(coach).set({ id: pendingUser.id }).where(eq(coach.id, duplicateUser.id));
		}

		// --- Client Services ---
		const duplicateUsersServices = await tx.query.clientService.findMany({
			where: eq(clientService.clientId, duplicateUser.id),
		});

		for (const dus of duplicateUsersServices) {
			// we're not concerned with duplicates here, just reassigning. Duplicates are not actually possible.
			await tx.update(clientService).set({ clientId: pendingUser.id }).where(eq(clientService.id, dus.id));
		}

		// --- Client Reentry Check List Items ---
		const duplicateChecklistItems = await tx.query.clientReentryCheckListItem.findMany({
			where: eq(clientReentryCheckListItem.clientId, duplicateUser.id),
		});

		for (const dcli of duplicateChecklistItems) {
			const exists = await tx.query.clientReentryCheckListItem.findFirst({
				where: and(
					eq(clientReentryCheckListItem.clientId, pendingUser.id),
					eq(clientReentryCheckListItem.reentryCheckListItemId, dcli.reentryCheckListItemId)
				),
			});
			if (!exists) {
				await tx.insert(clientReentryCheckListItem).values({
					clientId: pendingUser.id,
					reentryCheckListItemId: dcli.reentryCheckListItemId,
				});

				await tx
					.delete(clientReentryCheckListItem)
					.where(
						and(
							eq(clientReentryCheckListItem.reentryCheckListItemId, dcli.reentryCheckListItemId),
							eq(clientReentryCheckListItem.clientId, duplicateUser.id)
						)
					);
			}
		}

		// --- Client ---
		const duplicateClient = await tx.query.client.findFirst({ where: eq(client.id, duplicateUser.id) });
		const pendingClient = await tx.query.client.findFirst({ where: eq(client.id, pendingUser.id) });

		if (duplicateClient && pendingClient) {
			await tx
				.update(client)
				.set({
					coachId: pendingClient.coachId || duplicateClient.coachId,
					isReentryClient: pendingClient.isReentryClient || duplicateClient.isReentryClient,
					followUpNeeded: pendingClient.followUpNeeded || duplicateClient.followUpNeeded,
					followUpDate: pendingClient.followUpDate || duplicateClient.followUpDate,
					followUpNotes: [pendingClient.followUpNotes, duplicateClient.followUpNotes]
						.filter(Boolean)
						.join("\n"),
				})
				.where(eq(client.id, pendingUser.id));

			await tx.delete(client).where(eq(client.id, duplicateUser.id));
		} else if (duplicateClient && !pendingClient) {
			await tx.update(client).set({ id: pendingUser.id }).where(eq(client.id, duplicateUser.id));
		}

		// --- Volunteer Hours ---
		const duplicateHours = await tx.query.volunteerHours.findMany({
			where: eq(volunteerHours.volunteerId, duplicateUser.id),
		});

		for (const dh of duplicateHours) {
			// we're not concerned with duplicates here, just reassigning. Duplicates are not actually possible.
			await tx.update(volunteerHours).set({ volunteerId: pendingUser.id }).where(eq(volunteerHours.id, dh.id));
		}

		// --- User ---
		if (duplicateUser.clerkUserId) {
			// Keep the row, just soft-delete
			await tx.update(user).set({ deletedAt: new Date() }).where(eq(user.id, duplicateUser.id));
		} else {
			// Safe to hard-delete
			await tx.delete(user).where(eq(user.id, duplicateUser.id));
		}

		revalidateClientCache(pendingUser.id);
		revalidateClientCache(duplicateUser.id);
		revalidateCoachCache(pendingUser.id);
		revalidateCoachCache(duplicateUser.id);
		revalidateUserCache(pendingUser.id);
		revalidateUserCache(duplicateUser.id);
		return true;
	});
};
//#endregion

//#region Volunteers
export type VolunteerHours = typeof volunteerHours.$inferSelect;
export type VolunteerFull = {
	user: User;
	volunteerHours: VolunteerHours[];
	totalVolunteerHours?: number;
};

const cachedVolunteer = (id: string) => {
	const cachedFn = unstable_cache(
		async (): Promise<VolunteerFull | null> => {
			const rows = await db
				.select({
					user,
					volunteerHours,
					totalVolunteerHours: sql<number>`
						(SELECT COALESCE(SUM(vh.hours), 0)
						FROM volunteer_hours vh
						WHERE vh.volunteer_id = ${user.id})
					`,
				})
				.from(user)
				.leftJoin(volunteerHours, eq(user.id, volunteerHours.volunteerId))
				.where(
					and(
						eq(user.id, id),
						eq(user.accepted, true),
						inArray(user.role, volunteerRoles),
						isNull(user.deletedAt)
					)
				)
				.orderBy(desc(volunteerHours.date));
			if (rows.length === 0) return null;
			const first = rows[0]!;

			const volunteerHoursFiltered = rows
				.map((r) => r.volunteerHours)
				.filter((vh): vh is VolunteerHours => vh !== null);
			return {
				user: first.user,
				volunteerHours: volunteerHoursFiltered,
			};
		},
		["getVolunteerById", id],
		{ tags: [getUserIdTag(id)] }
	);
	return cachedFn();
};
export const getVolunteerById = async (id: string) => cachedVolunteer(id);

export type VolunteerList = {
	user: User;
	email: string | null;
	hours: string;
	lastVolunteeredAt: Date | null;
	lastVolunteerType: string | null;
};

const cachedVolunteers = unstable_cache(
	async (): Promise<VolunteerList[]> => {
		const volunteerTypes = await db.select().from(volunteeringType);
		const users = await db
			.select()
			.from(user)
			.where(and(isNull(user.deletedAt), eq(user.accepted, true), inArray(user.role, volunteerRoles)));

		const allHours = await db.select().from(volunteerHours).orderBy(desc(volunteerHours.updatedAt)); // ensures first match per user is latest

		// Build fast lookups
		const hoursByUser = new Map<string, VolunteerHours[]>();
		for (const h of allHours) {
			if (!hoursByUser.has(h.volunteerId)) hoursByUser.set(h.volunteerId, []);
			hoursByUser.get(h.volunteerId)!.push(h);
		}

		const rows: VolunteerList[] = [];

		for (const usr of users) {
			const records = hoursByUser.get(usr.id) || [];
			const totalHours = records.reduce((sum, r) => sum + Number(r.hours), 0);
			const lastRec = records[0] ?? null;

			let lastType: string | null = null;
			if (lastRec) {
				const vt = volunteerTypes.find((vt) => vt.id === lastRec.volunteeringTypeId);
				lastType = vt?.name ?? null;
			}

			rows.push({
				user: usr as User,
				email: usr.email || "",
				hours: totalHours.toString(),
				lastVolunteeredAt: lastRec ? lastRec.updatedAt : usr.updatedAt,
				lastVolunteerType: lastType,
			});
		}

		// Sort descending
		return rows.sort((a, b) => (b.lastVolunteeredAt?.getTime() ?? 0) - (a.lastVolunteeredAt?.getTime() ?? 0));
	},
	["getAllVolunteers"],
	{ tags: [getAllUsersGlobalTag()] }
);
export const getAllVolunteers = async () => cachedVolunteers();

export async function addVolunteer(data: typeof user.$inferInsert) {
	const userInsert = await db.transaction(async (tx) => {
		const [newUser] = await tx
			.insert(user)
			.values({ ...data, accepted: true })
			.returning();
		if (!newUser) throw new Error("Failed to add user");

		if (data.role?.includes("client")) {
			const [newClient] = await tx.insert(client).values({ id: newUser.id }).onConflictDoNothing().returning();
			if (!newClient) throw new Error("Failed to create client for user");
		}
		return newUser;
	});

	revalidateUserCache(userInsert.id);
	revalidateClientCache(userInsert.id);
	return userInsert;
}

export async function updateVolunteerById(id: string, data: Partial<typeof user.$inferInsert>, previousRole?: string) {
	const updatedUser = await db.transaction(async (tx) => {
		const [userUpdated] = await tx.update(user).set(data).where(eq(user.id, id)).returning();
		if (!userUpdated) throw new Error("Failed to update user");
		if (previousRole && previousRole !== userUpdated.role) await syncClerkUserMetadata(userUpdated);

		if (data.role?.includes("client")) {
			const [newClient] = await tx
				.insert(client)
				.values({ id: userUpdated.id })
				.onConflictDoNothing()
				.returning();
			if (!newClient) {
				const existing = await tx.query.client.findFirst({ where: eq(client.id, userUpdated.id) });
				if (!existing) throw new Error("Insert failed (not conflict)");
			}
		}

		return userUpdated;
	});

	revalidateUserCache(updatedUser.id);
	revalidateClientCache(updatedUser.id);
	return updatedUser;
}

export const addVolunteerHoursById = async (volunteerId: string, data: VolunteerHours) => {
	const [newItem] = await db
		.insert(volunteerHours)
		.values({ ...data, volunteerId })
		.returning();

	revalidateClientCache(volunteerId);
	return newItem;
};

export const updateVolunteerHoursById = async (hoursId: string, data: Partial<typeof volunteerHours.$inferInsert>) => {
	const [updatedItem] = await db.update(volunteerHours).set(data).where(eq(volunteerHours.id, hoursId)).returning();
	if (updatedItem == null) {
		console.error("Failed to update coach hours");
		throw new Error("Failed to update coach hours");
	}

	revalidateClientCache(updatedItem.volunteerId);
	return updatedItem;
};
//#endregion

//#region Staff
const cachedStaff = unstable_cache(
	async () => {
		return await db
			.select()
			.from(user)
			.where(and(inArray(user.role, staffRoles), isNull(user.deletedAt)))
			.orderBy(desc(user.updatedAt));
	},
	["getAllStaff"],
	{ tags: [getAllUsersGlobalTag()] }
);
export const getAllStaff = async () => cachedStaff();
export type Staff = typeof user.$inferSelect;

const cachedStaffById = (id: string) => {
	const cachedFn = unstable_cache(
		async (): Promise<Staff | null> => {
			const [userRow] = await db
				.select()
				.from(user)
				.where(and(eq(user.id, id), inArray(user.role, staffRoles), isNull(user.deletedAt)))
				.limit(1);

			return userRow || null;
		},
		["getStaffById", id],
		{ tags: [getUserIdTag(id)] }
	);
	return cachedFn;
};
export const getStaffById = async (id: string) => cachedStaffById(id);
//#endregion

//#region Admins
const cachedAdmins = unstable_cache(
	async () => {
		return await db
			.select()
			.from(user)
			.where(and(inArray(user.role, adminRoles), isNull(user.deletedAt)))
			.orderBy(desc(user.updatedAt));
	},
	["getAllAdmins"],
	{ tags: [getAllUsersGlobalTag()] }
);
export const getAllAdmins = async () => cachedAdmins();
export type Admins = typeof user.$inferSelect;

const cachedAdminsById = (id: string) => {
	const cachedFn = unstable_cache(
		async (): Promise<Admins | null> => {
			const [userRow] = await db
				.select()
				.from(user)
				.where(and(eq(user.id, id), inArray(user.role, adminRoles), isNull(user.deletedAt)))
				.limit(1);

			return userRow || null;
		},
		["getAdminsById", id],
		{ tags: [getUserIdTag(id)] }
	);
	return cachedFn;
};
export const getAdminsById = async (id: string) => cachedAdminsById(id);
//#endregion

//#region CRUD Coaches
export const cachedCoachUsers = unstable_cache(
	async () => {
		return await db
			.select()
			.from(user)
			.where(and(inArray(user.role, coachRoles), isNull(user.deletedAt)))
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
			.where(and(isNull(user.deletedAt), inArray(user.role, coachRoles)))
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
				.where(
					and(
						eq(user.id, id),
						eq(user.accepted, true),
						inArray(user.role, coachRoles),
						isNull(user.deletedAt)
					)
				)
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
	data: { coach: Partial<typeof coach.$inferInsert>; user: Partial<typeof user.$inferInsert> },
	previousRole?: string
) => {
	const updatedCoach = await db.transaction(async (tx) => {
		// INSERT or UPDATE seamlessly
		const [coachUpdated] = await tx
			.insert(coach)
			.values({ id: coachId, ...data.coach })
			.onConflictDoUpdate({
				target: [coach.id],
				set: { ...data.coach, deletedAt: null },
			})
			.returning();

		if (!coachUpdated) throw new Error("Failed to update coach");

		const [userUpdated] = await tx.update(user).set(data.user).where(eq(user.id, coachId)).returning();

		if (!userUpdated) throw new Error("Failed to update user");

		if (previousRole && userUpdated.role !== previousRole) {
			await syncClerkUserMetadata(userUpdated);
		}

		return {
			coach: coachUpdated,
			user: userUpdated,
		};
	});

	revalidateUserCache(coachId);
	revalidateCoachCache(coachId);

	return updatedCoach;
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

export const insertClientService = async (data: ClientServiceInsert) => {
	const [newService] = await db.insert(clientService).values(data).returning();

	if (newService == null) {
		console.error("Failed to create client service");
		throw new Error("Failed to create client service");
	}

	revalidateClientCache(data.clientId);
	return newService;
};

export const updateClientServiceById = async (serviceId: string, data: Partial<ClientServiceInsert>) => {
	const [updatedService] = await db
		.update(clientService)
		.set(data)
		.where(eq(clientService.id, serviceId))
		.returning();
	if (updatedService == null) {
		console.error("Failed to update client service");
		throw new Error("Failed to update client service");
	}
	revalidateClientCache(updatedService.clientId);
	return updatedService;
};

export const deleteClientServiceById = async (serviceId: string) => {
	const [deletedService] = await db.delete(clientService).where(eq(clientService.id, serviceId)).returning();

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
