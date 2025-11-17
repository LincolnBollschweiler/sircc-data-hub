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

//#region Cities
export const createCity = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.insertCity(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create city" : "City created successfully",
	};
};
export const updateCity = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.updateCityById(id, data);
	return {
		error: !rv,
		message: !rv ? "Failed to update city" : "City updated successfully",
	};
};

export const removeCity = async (id: string) => {
	const rv = await dbTable.deleteCity(id);
	return {
		error: !rv,
		message: !rv ? "Failed to remove city" : "City removed successfully",
	};
};
export const updateCityOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No cities to update" };
	await dbTable.updateCityOrders(orderedIds);
	return { error: false, message: "City orders updated successfully" };
};

//#region Visits
export const createVisit = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.insertVisit(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create visit" : "Visit created successfully",
	};
};
export const updateVisit = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.updateVisitById(id, data);

	return {
		error: !rv,
		message: !rv ? "Failed to update visit" : "Visit updated successfully",
	};
};

export const removeVisit = async (id: string) => {
	const rv = await dbTable.deleteVisit(id);
	return {
		error: !rv,
		message: !rv ? "Failed to remove visit" : "Visit removed successfully",
	};
};
export const updateVisitOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No visits to update" };
	await dbTable.updateVisitOrders(orderedIds);
	return { error: false, message: "Visit orders updated successfully" };
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

//#region Referred Out
export const createReferredOut = async (unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.insertReferredOut(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create referred out" : "Referred out created successfully",
	};
};
export const updateReferredOut = async (id: string, unsafeData: z.infer<typeof schemas.generalSchema>) => {
	const { success, data } = schemas.generalSchema.safeParse(unsafeData);
	if (!success) return { error: true, message: "Validation failed" };
	const rv = await dbTable.updateReferredOutById(id, data);
	return {
		error: !rv,
		message: !rv ? "Failed to update referred out" : "Referred out updated successfully",
	};
};

export const removeReferredOut = async (id: string) => {
	const rv = await dbTable.deleteReferredOut(id);
	return {
		error: !rv,
		message: !rv ? "Failed to remove referred out" : "Referred out removed successfully",
	};
};
export const updateReferredOutOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No referred out items to update" };
	await dbTable.updateReferredOutOrders(orderedIds);
	return { error: false, message: "Referred out orders updated successfully" };
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

//#region Services
export const createService = async (unsafeData: z.infer<typeof schemas.servicesSchema>) => {
	const { success, data } = schemas.servicesSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const rv = await dbTable.insertService(data);

	return {
		error: !rv,
		message: !rv ? "Failed to create service" : "Service created successfully",
	};
};

export const updateService = async (id: string, unsafeData: z.infer<typeof schemas.servicesSchema>) => {
	const { success, data } = schemas.servicesSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };
	return await dbTable.updateServiceById(id, data);
};

export const removeService = async (id: string) => {
	const service = await dbTable.deleteService(id);

	return {
		error: !service,
		message: !service ? "Failed to remove service" : "Service removed successfully",
	};
};

export const updateServicesOrders = async (orderedIds: string[]) => {
	if (orderedIds.length === 0) return { error: true, message: "No services to update" };

	await dbTable.updateServiceOrders(orderedIds);
	return { error: false, message: "Service orders updated successfully" };
};
//#endregion
