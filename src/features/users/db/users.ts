import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./cache";
import { revalidateTag } from "next/cache";

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

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
	console.log("Deleting user with clerkUserId:", clerkUserId);
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
