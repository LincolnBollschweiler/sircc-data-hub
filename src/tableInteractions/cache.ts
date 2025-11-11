"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as cacheTags from "./cacheTags";

export const revalidateVolunteeringTypeCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getVolunteeringTypeGlobalTag(), "max");
	revalidateTag(cacheTags.getVolunteeringTypeIdTag(id), "max");
	revalidatePath("/admin/data-types/volunteer-types");
	revalidatePath(`/admin/data-types/volunteer-types/${id}/edit`);
};

export const revalidateReentryChecklistItemCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getReentryChecklistItemGlobalTag(), "max");
	revalidateTag(cacheTags.getReentryChecklistItemIdTag(id), "max");
	revalidatePath("/admin/data-types/reentry-checklist-items");
	revalidatePath(`/admin/data-types/reentry-checklist-items/${id}/edit`);
};

export const revalidateCoachTrainingCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getCoachTrainingGlobalTag(), "max");
	revalidateTag(cacheTags.getCoachTrainingIdTag(id), "max");
	revalidatePath("/admin/data-types/coach-trainings");
	revalidatePath(`/admin/data-types/coach-trainings/${id}/edit`);
};

export const revalidateLocationCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getLocationGlobalTag(), "max");
	revalidateTag(cacheTags.getLocationIdTag(id), "max");
	revalidateTag(cacheTags.getUserSitesGlobalTag(), "max");
	revalidatePath("/admin/data-types/locations");
	revalidatePath(`/admin/data-types/locations/${id}/edit`);
};

export const revalidateSiteCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getSiteGlobalTag(), "max");
	revalidateTag(cacheTags.getSiteIdTag(id), "max");
	revalidatePath("/admin/data-types/sites");
	revalidatePath(`/admin/data-types/sites/${id}/edit`);
};

export const revalidateReferralSourceCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getReferralSourceGlobalTag(), "max");
	revalidateTag(cacheTags.getReferralSourceIdTag(id), "max");
	revalidatePath("/admin/data-types/referral-sources");
	revalidatePath(`/admin/data-types/referral-sources/${id}/edit`);
};

export const revalidateClientServiceCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getClientServiceGlobalTag(), "max");
	revalidateTag(cacheTags.getClientServiceIdTag(id), "max");
	revalidatePath("/admin/data-types/client-services");
	revalidatePath(`/admin/data-types/client-services/${id}/edit`);
};

export const revalidateUserCache = async (id: string) => {
	revalidateTag(cacheTags.getAllUsersGlobalTag(), "max");
	revalidateTag(cacheTags.getUserIdTag(id), "max");
	revalidatePath("/");
	// revalidatePath("/admin/applicants");
};

export const revalidateUserSitesCache = async () => {
	// revalidatePath("/admin/applicants");
};
