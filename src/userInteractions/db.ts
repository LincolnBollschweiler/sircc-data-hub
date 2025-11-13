import { db } from "@/drizzle/db";
import { client, site, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { desc, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getAllUsersGlobalTag, getUserSitesGlobalTag } from "@/userInteractions/cacheTags";
import { revalidateUserCache } from "@/userInteractions/cache";
import { syncClerkUserMetadata } from "@/services/clerk";

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

const cachedUsers = unstable_cache(
	async () => {
		return await db.select().from(user).where(isNull(user.deletedAt)).orderBy(desc(user.updatedAt));
	},
	["getAllUsers"],
	// { tags: [getAllUsersGlobalTag()] }
	{ tags: [getAllUsersGlobalTag()], revalidate: 5 }
);

export const getAllUsers = async () => cachedUsers();
