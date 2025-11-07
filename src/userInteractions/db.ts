import { db } from "@/drizzle/db";
import { site, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./cache";
import { desc, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getAllUsersGlobalTag, getUserSitesGlobalTag } from "@/tableInteractions/cacheTags";

export async function insertUser(data: typeof user.$inferInsert) {
	console.log("Inserting user:", data);
	const [newUser] = await db
		.insert(user)
		.values(data)
		.returning()
		.onConflictDoUpdate({
			target: [user.clerkUserId],
			set: data,
		});

	if (newUser == null) {
		console.error("Failed to insert user");
		throw new Error("Failed to insert user");
	}

	revalidateUserCache(newUser.id);
	return newUser;
}

export async function updateUser({ clerkUserId }: { clerkUserId: string }, data: Partial<typeof user.$inferInsert>) {
	console.log("Updating user with clerkUserId:", clerkUserId, "Data:", data);
	const [updatedUser] = await db.update(user).set(data).where(eq(user.clerkUserId, clerkUserId)).returning();

	if (updatedUser == null) throw new Error("Failed to update user");

	revalidateUserCache(updatedUser.id);
	return updatedUser;
}

export async function updateUserById(id: string, data: Partial<typeof user.$inferInsert>) {
	console.log("Updating user with user id:", id, "Data:", data);
	const [updatedUser] = await db.update(user).set(data).where(eq(user.id, id)).returning();

	if (updatedUser == null) throw new Error("Failed to update user");

	revalidateUserCache(updatedUser.id);
	return updatedUser;
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
	{ tags: [getAllUsersGlobalTag()] }
);

export const getAllUsers = async () => cachedUsers();
