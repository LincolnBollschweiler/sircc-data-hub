"use server";

import { coach, user } from "@/drizzle/schema";
import {
	addClientReentryCheckListItemForClient,
	addCoachTrainingById,
	ClientServiceInsert,
	deleteClientServiceById,
	deleteCoachTrainingById,
	insertClientService,
	removeClientReentryCheckListItemForClient,
	updateClientById,
	updateCoachById,
	updateUserById,
} from "@/userInteractions/db";
import { assignRoleSchema, userSchema } from "@/userInteractions/schema";

//#region User Actions
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
	const rv = await updateClientById(userId, { coachId });
	return { error: !rv, message: rv ? "Coach updated successfully" : "Failed to update coach" };
};

export const updateClientIsReentryStatus = async (userId: string | null, isReentryClient: boolean) => {
	if (!userId) return { error: true, message: "Invalid user ID" };
	const rv = await updateClientById(userId, { isReentryClient });
	return { error: !rv, message: rv ? "Re-entry status updated successfully" : "Failed to update re-entry status" };
};

export const createClientService = async (userId: null, data: ClientServiceInsert) => {
	const rv = await insertClientService(data);
	return { error: !rv, message: rv ? "Service created successfully" : "Failed to create service" };
};

export const deleteClientService = async (serviceId: string) => {
	const rv = await deleteClientServiceById(serviceId);
	return { error: !rv, message: rv ? "Service deleted successfully" : "Failed to delete service" };
};

export const addClientChecklistItem = async (clientId: string, itemId: string) => {
	const rv = await addClientReentryCheckListItemForClient(clientId, itemId);
	return { error: !rv, message: rv ? "Checklist item added successfully" : "Failed to add checklist item" };
};

export const deleteClientChecklistItem = async (clientId: string, itemId: string) => {
	// console.log("Deleting checklist item:", clientId, itemId);
	const rv = await removeClientReentryCheckListItemForClient(clientId, itemId);
	return { error: !rv, message: rv ? "Checklist item deleted successfully" : "Failed to delete checklist item" };
};
//#endregion

//#region Coach Actions
export const updateCoachDetails = async (
	coachId: string,
	data: { coach: Partial<typeof coach.$inferInsert>; user: Partial<typeof user.$inferInsert> }
) => {
	// console.log("Updating user:", id, unsafeData);
	const rv = await updateCoachById(coachId, data);
	return { error: !rv, message: rv ? "Coach updated successfully" : "Failed to update coach" };
};

export const insertCoachTraining = async (coachId: string, trainingId: string) => {
	// console.log("Inserting coach training:", coachId, trainingId);
	const rv = await addCoachTrainingById(coachId, trainingId);
	if (!rv) return { error: true, message: "Failed to add coach training" };
	return { error: false, message: "Coach training added successfully" };
};

export const removeCoachTraining = async (coachId: string, trainingId: string) => {
	// console.log("Removing coach training:", coachId, trainingId);
	const rv = await deleteCoachTrainingById(trainingId);
	if (!rv) return { error: true, message: "Failed to remove coach training" };
	return { error: false, message: "Coach training removed successfully" };
};
//#endregion
