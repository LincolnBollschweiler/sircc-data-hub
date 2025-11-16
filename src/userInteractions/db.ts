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
} from "@/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
// import { eq, and, or, sql } from "drizzle-orm";
import { desc, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import {
	getAllUsersGlobalTag,
	// getClientIdTag,
	// getUserIdTag,
	getUserSitesGlobalTag,
} from "@/userInteractions/cacheTags";
import { revalidateClientCache, revalidateUserCache } from "@/userInteractions/cache";
import { syncClerkUserMetadata } from "@/services/clerk";
import { alias } from "drizzle-orm/pg-core";
import { ClientServiceInsert } from "@/tableInteractions/db";

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
	// { tags: [getUserSitesGlobalTag()] }
	{ tags: [getUserSitesGlobalTag()], revalidate: 5 } // HOW TO: set a time-based revalidation alongside tag-based so that data is at most 5 seconds stale
	// requires a hard-refresh too
);

export const getUserSites = async () => cachedUserSites();
//#endregion

//#region CRUD Clients
// types represent one row returned from joins
export type ClientList = {
	user: typeof user.$inferSelect;
	client: typeof client.$inferSelect | null; // null because of leftJoin
	coach: typeof user.$inferSelect | null; // null because of leftJoin
	serviceCount: number;
	openRequestsCount: number;
	requestsUpdatedAt: Date | null;
};

// export type ClientFull = {
// 	user: typeof user.$inferSelect;
// 	client: typeof client.$inferSelect | null; // null because of leftJoin
// 	coach: typeof user.$inferSelect | null; // null because of leftJoin
// 	clientServices: typeof clientService.$inferSelect | null; // null because of leftJoin
// 	service: typeof service.$inferSelect | null; // null because of leftJoin
// 	location: typeof location.$inferSelect | null; // null because of leftJoin
// 	clientReentryCheckListItem: typeof clientReentryCheckListItem.$inferSelect | null;
// 	reentryCheckListItem: typeof reentryCheckListItem.$inferSelect | null;
// 	referralSource: typeof referralSource.$inferSelect | null;
// 	serviceCount: number;
// 	openRequestsCount: number;
// 	requestsUpdatedAt: Date | null;
// };

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
	user: typeof user.$inferSelect;
	client: typeof client.$inferSelect;
	coach: typeof user.$inferSelect | null;
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

export const getClientById = async (id: string): Promise<ClientFull | null> => {
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
			serviceCount: sql<number>`(
        SELECT COUNT(*) FROM client_service cs WHERE cs.client_id = ${id}
      )`,
			openRequestsCount: sql<number>`(
        SELECT COUNT(*)
        FROM client_service csr
        WHERE csr.client_id = ${id}
        AND csr.requested_service_id IS NOT NULL
        AND csr.provided_service_id IS NULL
      )`,
			requestsUpdatedAt: sql<Date | null>`(
        SELECT MAX(csr.updated_at)
        FROM client_service csr
        WHERE csr.client_id = ${id}
      )`,
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
		.leftJoin(reentryCheckListItem, eq(clientReentryCheckListItem.reentryCheckListItemId, reentryCheckListItem.id))
		.where(and(eq(user.id, id), eq(user.accepted, true), eq(user.role, "client")))
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
		(g): g is NonNullable<typeof g> & [NonNullable<(typeof g)[0]>, ...typeof g] => Array.isArray(g) && g.length > 0
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
};

// const getCachedClient = (id: string) => {
// 	const cachedFn = unstable_cache(
// 		async (): Promise<ClientFull | null> => {
// 			const results = await db
// 				.select({
// 					user,
// 					client,
// 					coach: coachUser,
// 					clientService,
// 					service,
// 					location,
// 					clientReentryCheckListItem,
// 					reentryCheckListItem,
// 					referralSource,
// 					serviceCount: sql<number>`
// 					(SELECT COUNT(*)
// 					FROM client_service cs
// 					WHERE cs.client_id = ${id})
// 				`,
// 					openRequestsCount: sql<number>`
// 					(SELECT COUNT(*)
// 					FROM client_service csr
// 					WHERE csr.client_id = ${id}
// 					AND csr.requested_service_id IS NOT NULL
// 					AND csr.provided_service_id IS NULL)
// 				 `,
// 					requestsUpdatedAt: sql<Date | null>`
// 					(SELECT MAX(csr.updated_at)
// 					FROM client_service csr
// 					WHERE csr.client_id = ${id})
// 				`,
// 				})
// 				.from(user)
// 				.leftJoin(client, eq(user.id, client.id)) // join user.id to client.id
// 				.leftJoin(coachUser, eq(client.coachId, coachUser.id))
// 				.leftJoin(clientService, eq(client.id, clientService.clientId))
// 				.leftJoin(
// 					service,
// 					or(
// 						eq(clientService.requestedServiceId, service.id),
// 						eq(clientService.providedServiceId, service.id)
// 					)
// 				)
// 				.leftJoin(location, eq(clientService.locationId, location.id))
// 				.leftJoin(clientReentryCheckListItem, eq(client.id, clientReentryCheckListItem.clientId))
// 				.leftJoin(
// 					reentryCheckListItem,
// 					eq(clientReentryCheckListItem.reentryCheckListItemId, reentryCheckListItem.id)
// 				)
// 				.leftJoin(referralSource, eq(clientService.referralSourceId, referralSource.id))
// 				.where(and(eq(user.id, id), eq(user.accepted, true), eq(user.role, "client")))
// 				.orderBy(
// 					desc(
// 						sql`
// 						COALESCE(
// 						(SELECT MAX(csr.updated_at)
// 						FROM client_service csr
// 						WHERE csr.client_id = ${client.id}),
// 						${client.updatedAt}
// 					)`
// 					)
// 				);
// 			return (results.at(0) as ClientFull) ?? null;
// 		},
// 		["getClientById", id],
// 		{ tags: [getClientIdTag(id), getUserIdTag(id)] }
// 	);
// 	return cachedFn(); // execute it only when this function is called
// };
// export const getClientById = async (id: string) => getCachedClient(id);

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

export const updateClientCoachById = async (clientId: string, data: Partial<typeof client.$inferInsert>) => {
	console.log("Updating client coach with id:", clientId, "Data:", data);
	const [updatedClient] = await db.update(client).set(data).where(eq(client.id, clientId)).returning();
	revalidateClientCache(clientId);
	return updatedClient;
};

export const cachedCoaches = unstable_cache(
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

export const getAllCoaches = async () => cachedCoaches();
//#endregion

//#region Client Services
export const insertClientService = async (data: ClientServiceInsert) => {
	console.log("Creating client service for clientId:", data.clientId, "Data:", data);
	const [newService] = await db.insert(clientService).values(data).returning();

	if (newService == null) {
		console.error("Failed to create client service");
		throw new Error("Failed to create client service");
	}

	revalidateClientCache(data.clientId);
	return newService;
};

//#endregion
