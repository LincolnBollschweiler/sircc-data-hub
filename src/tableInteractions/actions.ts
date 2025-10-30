"use server";

import { z } from "zod";
import * as schemas from "./schemas";
import * as dbTable from "./db";

//#region Volunteer Types
export const createVolunteerType = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertVolunteerType(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create volunteer type" : "Volunteer type created successfully",
	};
};

export const updateVolunteerType = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.updateVolunteerTypeById(id, data);

	return {
		error: !rv,
		message: !rv ? "Failed to update volunteer type" : "Volunteer type updated successfully",
	};
};

export const removeVolunteerType = async (id: string) => {
	const rv = await dbTable.deleteVolunteerType(id);

	return {
		error: !rv,
		message: !rv ? "Failed to remove volunteer type" : "Volunteer type removed successfully",
	};
};

export const updateVolunteerTypeOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No volunteer types to update" };

	await dbTable.updateVolunteerTypeOrders(orderedIds);
	return { error: false, message: "Volunteer type orders updated successfully" };
};
//#endregion

//#region Reentry Checklist Items
export const createReentryChecklistItem = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertReentryChecklistItem(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create reentry checklist item" : "Reentry checklist item created successfully",
	};
};

export const updateReentryChecklistItem = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.updateReentryChecklistItemById(id, data);

	return {
		error: !rv,
		message: !rv ? "Failed to update reentry checklist item" : "Reentry checklist item updated successfully",
	};
};

export const removeReentryChecklistItem = async (id: string) => {
	const rv = await dbTable.deleteReentryChecklistItem(id);

	return {
		error: !rv,
		message: !rv ? "Failed to remove reentry checklist item" : "Reentry checklist item removed successfully",
	};
};

export const updateReentryChecklistItemOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No reentry checklist items to update" };

	await dbTable.updateReentryChecklistItemOrders(orderedIds);
	return { error: false, message: "Reentry checklist item orders updated successfully" };
};
//#endregion

//#region Coach Trainings
export const createCoachTraining = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertCoachTraining(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create coach training" : "Coach training created successfully",
	};
};

export const updateCoachTraining = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.updateCoachTrainingById(id, data);

	return {
		error: !rv,
		message: !rv ? "Failed to update coach training" : "Coach training updated successfully",
	};
};

export const removeCoachTraining = async (id: string) => {
	const rv = await dbTable.deleteCoachTraining(id);
	return {
		error: !rv,
		message: !rv ? "Failed to remove coach training" : "Coach training removed successfully",
	};
};
export const updateCoachTrainingOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No coach trainings to update" };
	await dbTable.updateCoachTrainingOrders(orderedIds);
	return { error: false, message: "Coach training orders updated successfully" };
};
//#endregion

//#region Locations
export const createLocation = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertLocation(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create location" : "Location created successfully",
	};
};

export const updateLocation = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.updateLocationById(id, data);

	return {
		error: !rv,
		message: !rv ? "Failed to update location" : "Location updated successfully",
	};
};

export const removeLocation = async (id: string) => {
	const rv = await dbTable.deleteLocation(id);
	return {
		error: !rv,
		message: !rv ? "Failed to remove location" : "Location removed successfully",
	};
};
export const updateLocationOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No locations to update" };
	await dbTable.updateLocationOrders(orderedIds);
	return { error: false, message: "Location orders updated successfully" };
};
//#endregion

//#region Referral Sources
export const createReferralSource = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertReferralSource(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create referral source" : "Referral source created successfully",
	};
};

export const updateReferralSource = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.updateReferralSourceById(id, data);
	return {
		error: !rv,
		message: !rv ? "Failed to update referral source" : "Referral source updated successfully",
	};
};

export const removeReferralSource = async (id: string) => {
	const rv = await dbTable.deleteReferralSource(id);
	return {
		error: !rv,
		message: !rv ? "Failed to remove referral source" : "Referral source removed successfully",
	};
};

export const updateReferralSourceOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No referral sources to update" };
	await dbTable.updateReferralSourceOrders(orderedIds);
	return { error: false, message: "Referral source orders updated successfully" };
};
//#endregion

//#region Sites
export const createSite = async (unsafeData: z.infer<typeof schemas.siteSchema>) => {
	const { success, data } = schemas.siteSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertSite(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create site" : "Site created successfully",
	};
};

export const updateSite = async (id: string, unsafeData: z.infer<typeof schemas.siteSchema>) => {
	const { success, data } = schemas.siteSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.updateSiteById(id, data);
	return {
		error: !rv,
		message: !rv ? "Failed to update site" : "Site updated successfully",
	};
};

export const removeSite = async (id: string) => {
	const rv = await dbTable.deleteSite(id);
	return {
		error: !rv,
		message: !rv ? "Failed to remove site" : "Site removed successfully",
	};
};

export const updateSiteOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No sites to update" };
	await dbTable.updateSiteOrders(orderedIds);
	return { error: false, message: "Site orders updated successfully" };
};
//#endregion

//#region Client Services
export const createClientService = async (unsafeData: z.infer<typeof schemas.clientServiceSchema>) => {
	const { success, data } = schemas.clientServiceSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertClientService(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create client service" : "Client service created successfully",
	};
};

export const updateClientService = async (id: string, unsafeData: z.infer<typeof schemas.clientServiceSchema>) => {
	const { success, data } = schemas.clientServiceSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };
	return await dbTable.updateClientServiceById(id, data);
};

export const removeClientService = async (id: string) => {
	const clientService = await dbTable.deleteClientService(id);

	return {
		error: !clientService,
		message: !clientService ? "Failed to remove client service" : "Client service removed successfully",
	};
};

export const updateClientServicesOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No client services to update" };

	await dbTable.updateClientServiceOrders(orderedIds);
	return { error: false, message: "Client service orders updated successfully" };
};
//#endregion
