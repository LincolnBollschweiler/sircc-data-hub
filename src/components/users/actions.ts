"use server";

import { user } from "@/drizzle/schema";
import { updateUserById } from "@/userInteractions/db";
import { userSchema } from "@/userInteractions/schema";

export const updateUser = async (id: string, unsafeData: Partial<typeof user.$inferInsert>) => {
	const { success, data } = userSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Invalid data" };

	const rv = await updateUserById(id, data);

	return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};
