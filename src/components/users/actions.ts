"use server";

import { user } from "@/drizzle/schema";
import { updateUserById } from "@/userInteractions/db";
import { userSchema } from "@/userInteractions/schema";

export const updateUser = async (id: string, unsafeData: Partial<typeof user.$inferInsert>) => {
	console.log("Updating user:", id, unsafeData);
	const { success, data } = userSchema.safeParse(unsafeData);
	console.log({ success, data });
	if (!success) return { error: true, message: "Invalid data" };

	const rv = await updateUserById(id, data);

	return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};
