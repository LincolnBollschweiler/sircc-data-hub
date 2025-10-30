import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidatePath, revalidateTag } from "next/cache";

//#region Volunteer Types Cache Tags
export const getVolunteeringTypeGlobalTag = () => {
	return getGlobalTag("volunteer-types");
};

export const getVolunteeringTypeIdTag = (id: string) => {
	console.log("Getting ID tag for client service ID:", id, getIdTag("volunteer-types", id));
	return getIdTag("volunteer-types", id);
};

export const revalidateVolunteeringTypeCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(getVolunteeringTypeGlobalTag(), "max");
	revalidateTag(getVolunteeringTypeIdTag(id), "max");
	revalidatePath("/admin/data-types/volunteer-types");
	revalidatePath(`/admin/data-types/volunteer-types/${id}/edit`);
};
//#endregion

//#region Reentry Checklist Items Cache Tags
export const getReentryChecklistItemGlobalTag = () => {
	return getGlobalTag("reentry-checklist-items");
};

export const getReentryChecklistItemIdTag = (id: string) => {
	console.log("Getting ID tag for reentry checklist item ID:", id, getIdTag("reentry-checklist-items", id));
	return getIdTag("reentry-checklist-items", id);
};

export const revalidateReentryChecklistItemCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(getReentryChecklistItemGlobalTag(), "max");
	revalidateTag(getReentryChecklistItemIdTag(id), "max");
	revalidatePath("/admin/data-types/reentry-checklist-items");
	revalidatePath(`/admin/data-types/reentry-checklist-items/${id}/edit`);
};
//#endregion

//#region Coach Trainings Cache Tags
export const getCoachTrainingGlobalTag = () => {
	return getGlobalTag("coach-trainings");
};

export const getCoachTrainingIdTag = (id: string) => {
	console.log("Getting ID tag for coach training ID:", id, getIdTag("coach-trainings", id));
	return getIdTag("coach-trainings", id);
};
export const revalidateCoachTrainingCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(getCoachTrainingGlobalTag(), "max");
	revalidateTag(getCoachTrainingIdTag(id), "max");
	revalidatePath("/admin/data-types/coach-trainings");
	revalidatePath(`/admin/data-types/coach-trainings/${id}/edit`);
};
//#endregion

//#region Locations Cache Tags
export const getLocationGlobalTag = () => {
	return getGlobalTag("locations");
};

export const getLocationIdTag = (id: string) => {
	console.log("Getting ID tag for location ID:", id, getIdTag("locations", id));
	return getIdTag("locations", id);
};

export const revalidateLocationCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(getLocationGlobalTag(), "max");
	revalidateTag(getLocationIdTag(id), "max");
	revalidatePath("/admin/data-types/locations");
	revalidatePath(`/admin/data-types/locations/${id}/edit`);
};
//#endregion

//#region Client Services Cache Tags
export const getClientServiceGlobalTag = () => {
	return getGlobalTag("client-services");
};

export const getClientServiceIdTag = (id: string) => {
	console.log("Getting ID tag for client service ID:", id, getIdTag("client-services", id));
	return getIdTag("client-services", id);
};

export const revalidateClientServiceCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(getClientServiceGlobalTag(), "max");
	revalidateTag(getClientServiceIdTag(id), "max");
	revalidatePath("/admin/data-types/client-services");
	revalidatePath(`/admin/data-types/client-services/${id}/edit`);
};
//#endregion
