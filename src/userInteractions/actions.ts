"use server";

import { coach, user } from "@/drizzle/schema";
import {
	addClientReentryCheckListItemForClient,
	addCoachHoursById,
	addCoachMileageById,
	addCoachTrainingById,
	addUser,
	ClientServiceInsert,
	CoachHours,
	CoachMiles,
	deleteClientServiceById,
	deleteCoachHoursById,
	deleteCoachMileageById,
	deleteCoachTrainingById,
	insertClientService,
	removeClientReentryCheckListItemForClient,
	updateClientById,
	updateClientServiceById,
	updateCoachById,
	updateCoachHoursById,
	updateCoachMileageById,
	updateClerkUserById,
	updateUserById,
	getUserById,
} from "@/userInteractions/db";
import { assignRoleSchema, clerkUserSchema, userSchema } from "@/userInteractions/schema";

//#region User Actions
export const createUser = async (unsafeData: Partial<typeof user.$inferInsert>) => {
	const { success, data } = userSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Invalid data" };
	const rv = await addUser(data);
	return { error: !rv, message: rv ? "User created successfully" : "Failed to create user" };
};

export const updateUser = async (
	id: string,
	unsafeData: Partial<typeof user.$inferInsert> & { previousRole?: string }
) => {
	const { success, data } = userSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Invalid data" };
	const rv = await updateUserById(id, data, unsafeData.previousRole);
	return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};

export const queryUserById = async (id: string) => {
	const rv = await getUserById(id);
	return rv;
};

export const updateClerkUser = async (id: string, unsafeData: Partial<typeof user.$inferInsert>) => {
	const { success, data } = clerkUserSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Invalid data" };
	const rv = await updateClerkUserById(id, data);
	return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};

export const updateUserRoleAndAccept = async (id: string, unsafeData: Partial<typeof user.$inferInsert>) => {
	const { success, data } = assignRoleSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Invalid data" };
	return await updateClerkUserById(id, { ...data, accepted: true });
};

export const updateClientsCoach = async (userId: string | null, coachId: string | null) => {
	if (!userId) return { error: true, message: "Invalid user ID" };
	const rv = await updateClientById(userId, { coachId });
	return { error: !rv, message: rv ? "Coach updated successfully" : "Failed to update coach" };
};

export const updateClientIsReentryStatus = async (
	userId: string | null,
	isReentryClient: boolean,
	coachIsViewing: boolean
) => {
	if (!userId) return { error: true, message: "Invalid user ID" };
	const rv = await updateClientById(userId, { isReentryClient }, coachIsViewing);
	return { error: !rv, message: rv ? "Re-entry status updated successfully" : "Failed to update re-entry status" };
};

export const createClientService = async (userId: null, data: ClientServiceInsert, coachIsViewing?: boolean) => {
	const rv = await insertClientService(data, !!coachIsViewing);
	return { error: !rv, message: rv ? "Service created successfully" : "Failed to create service" };
};

export const updateClientService = async (
	serviceId: string | null,
	data: Partial<ClientServiceInsert>,
	coachIsViewing?: boolean
) => {
	if (!serviceId) {
		return { error: true, message: "Invalid service ID" };
	}
	const rv = await updateClientServiceById(serviceId, data, !!coachIsViewing);
	return { error: !rv, message: rv ? "Service updated successfully" : "Failed to update service" };
};

export const deleteClientService = async (serviceId: string, coachIsViewing?: boolean) => {
	const rv = await deleteClientServiceById(serviceId, !!coachIsViewing);
	return { error: !rv, message: rv ? "Service deleted successfully" : "Failed to delete service" };
};

export const addClientChecklistItem = async (clientId: string, itemId: string, coachIsViewing?: boolean) => {
	const rv = await addClientReentryCheckListItemForClient(clientId, itemId, !!coachIsViewing);
	return { error: !rv, message: rv ? "Checklist item added successfully" : "Failed to add checklist item" };
};

export const deleteClientChecklistItem = async (clientId: string, itemId: string, coachIsViewing?: boolean) => {
	const rv = await removeClientReentryCheckListItemForClient(clientId, itemId, !!coachIsViewing);
	return { error: !rv, message: rv ? "Checklist item deleted successfully" : "Failed to delete checklist item" };
};
//#endregion

//#region Coach Actions
export const updateCoachDetails = async (
	coachId: string,
	data: { coach: Partial<typeof coach.$inferInsert>; user: Partial<typeof user.$inferInsert> },
	previousRole?: string
) => {
	const rv = await updateCoachById(coachId, data, previousRole);
	return { error: !rv, message: rv ? "Coach updated successfully" : "Failed to update coach" };
};

export const insertCoachTraining = async (coachId: string, trainingId: string) => {
	const rv = await addCoachTrainingById(coachId, trainingId);
	if (!rv) return { error: true, message: "Failed to add coach training" };
	return { error: false, message: "Coach training added successfully" };
};

export const removeCoachTraining = async (coachId: string, trainingId: string) => {
	const rv = await deleteCoachTrainingById(trainingId);
	if (!rv) return { error: true, message: "Failed to remove coach training" };
	return { error: false, message: "Coach training removed successfully" };
};

export const insertCoachHours = async (coachId: string, data: Partial<CoachHours>) => {
	if (!Number(data.paidHours) && !Number(data.volunteerHours)) {
		return { error: true, message: "At least one of paid or volunteer hours must be provided" };
	}
	if (!Number(data.paidHours)) delete data.paidHours;
	if (!Number(data.volunteerHours)) delete data.volunteerHours;

	const rv = await addCoachHoursById(coachId, data);
	if (!rv) return { error: true, message: "Failed to log coach hours" };
	return { error: false, message: "Coach hours logged successfully" };
};

export const updateCoachHours = async (hoursId: string | null, data: Partial<CoachHours>) => {
	if (!hoursId) return { error: true, message: "Invalid hours ID" };
	if (!Number(data.paidHours) && !Number(data.volunteerHours))
		return { error: true, message: "At least one of paid or volunteer hours must be provided" };

	if (!Number(data.paidHours)) delete data.paidHours;
	if (!Number(data.volunteerHours)) delete data.volunteerHours;

	const rv = await updateCoachHoursById(hoursId, data);
	if (!rv) return { error: true, message: "Failed to update coach hours" };
	return { error: false, message: "Coach hours updated successfully" };
};

export const deleteCoachHours = async (hoursId: string) => {
	const rv = await deleteCoachHoursById(hoursId);
	if (!rv) return { error: true, message: "Failed to delete coach hours" };
	return { error: false, message: "Coach hours deleted successfully" };
};

export const insertCoachMiles = async (coachId: string, data: Partial<CoachMiles>) => {
	if (!Number(data.miles)) return { error: true, message: "Miles must be provided" };
	const rv = await addCoachMileageById(coachId, data);
	if (!rv) return { error: true, message: "Failed to log coach miles" };
	return { error: false, message: "Coach miles logged successfully" };
};

export const updateCoachMiles = async (milesId: string | null, data: Partial<CoachMiles>) => {
	if (!milesId) return { error: true, message: "Invalid miles ID" };
	if (!Number(data.miles)) return { error: true, message: "Miles must be provided" };
	const rv = await updateCoachMileageById(milesId, data);
	if (!rv) return { error: true, message: "Failed to update coach miles" };
	return { error: false, message: "Coach miles updated successfully" };
};

export const deleteCoachMiles = async (milesId: string) => {
	const rv = await deleteCoachMileageById(milesId);
	if (!rv) return { error: true, message: "Failed to delete coach miles" };
	return { error: false, message: "Coach miles deleted successfully" };
};
//#endregion
