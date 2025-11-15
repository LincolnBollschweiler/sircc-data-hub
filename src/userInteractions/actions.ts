"use server";

import { user } from "@/drizzle/schema";
import { updateClientCoachById, updateUserById } from "@/userInteractions/db";
import { assignRoleSchema, userSchema } from "@/userInteractions/schema";

export const updateUser = async (id: string, unsafeData: Partial<typeof user.$inferInsert>) => {
	// console.log("Updating user:", id, unsafeData);
	const { success, data } = userSchema.safeParse(unsafeData);
	// console.log({ success, data });
	if (!success) return { error: true, message: "Invalid data" };
	const rv = await updateUserById(id, data);
	return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};

export const updateUserRoleAndAccept = async (id: string, unsafeData: Partial<typeof user.$inferInsert>) => {
	// console.log("Updating user:", id, unsafeData);
	const { success, data } = assignRoleSchema.safeParse(unsafeData);
	// console.log({ success, data });
	if (!success) return { error: true, message: "Invalid data" };
	return await updateUserById(id, { ...data, accepted: true });
	// return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};

export const updateClientsCoach = async (userId: string | null, coachId: string | null) => {
	if (!userId) return { error: true, message: "Invalid user ID" };
	const rv = await updateClientCoachById(userId, { coachId });
	return { error: !rv, message: rv ? "Coach updated successfully" : "Failed to update coach" };
};
