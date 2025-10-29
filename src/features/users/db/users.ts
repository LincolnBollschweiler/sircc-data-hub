import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function insertUser(data: typeof user.$inferInsert) {
	// console.log("Inserting user:", data);
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

	return newUser;
}

export async function updateUser({ clerkUserId }: { clerkUserId: string }, data: Partial<typeof user.$inferInsert>) {
	// console.log("Updating user with clerkUserId:", clerkUserId, "Data:", data);
	const [updatedUser] = await db.update(user).set(data).where(eq(user.clerkUserId, clerkUserId)).returning();

	if (updatedUser == null) throw new Error("Failed to update user");

	return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
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

	if (deletedUser == null) throw new Error("Failed to delete user");

	return deletedUser;
}
