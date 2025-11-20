"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as cacheTags from "./cacheTags";

export const revalidateVolunteeringTypeCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getVolunteeringTypeGlobalTag(), "max");
	revalidateTag(cacheTags.getVolunteeringTypeIdTag(id), "max");
	revalidatePath("/admin/data-types/volunteer-types");
	revalidatePath(`/admin/data-types/volunteer-types/${id}/edit`);
};

export const revalidateReentryChecklistItemCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getReentryChecklistItemGlobalTag(), "max");
	revalidateTag(cacheTags.getReentryChecklistItemIdTag(id), "max");
	revalidatePath("/admin/data-types/reentry-checklist-items");
	revalidatePath(`/admin/data-types/reentry-checklist-items/${id}/edit`);
};

export const revalidateCoachTrainingCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getCoachTrainingGlobalTag(), "max");
	revalidateTag(cacheTags.getCoachTrainingIdTag(id), "max");
	revalidatePath("/admin/data-types/coach-trainings");
	revalidatePath(`/admin/data-types/coach-trainings/${id}/edit`);
};

export const revalidateLocationCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getLocationGlobalTag(), "max");
	revalidateTag(cacheTags.getLocationIdTag(id), "max");
	revalidatePath("/admin/data-types/locations");
	revalidatePath(`/admin/data-types/locations/${id}/edit`);
};

export const revalidateCitiesCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getCitiesGlobalTag(), "max");
	revalidateTag(cacheTags.getCitiesIdTag(id), "max");
	revalidatePath("/admin/data-types/cities");
	revalidatePath(`/admin/data-types/cities/${id}/edit`);
};

export const revalidateVisitsCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getVisitGlobalTag(), "max");
	revalidateTag(cacheTags.getVisitIdTag(id), "max");
	revalidatePath("/admin/data-types/visits");
	revalidatePath(`/admin/data-types/visits/${id}/edit`);
};

export const revalidateSiteCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getSiteGlobalTag(), "max");
	revalidateTag(cacheTags.getSiteIdTag(id), "max");
	revalidatePath("/admin/data-types/sites");
	revalidatePath(`/admin/data-types/sites/${id}/edit`);
};

export const revalidateReferralSourceCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getReferralSourceGlobalTag(), "max");
	revalidateTag(cacheTags.getReferralSourceIdTag(id), "max");
	revalidatePath("/admin/data-types/referral-sources");
	revalidatePath(`/admin/data-types/referral-sources/${id}/edit`);
};

export const revalidateReferredOutCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getReferredOutGlobalTag(), "max");
	revalidateTag(cacheTags.getReferredOutIdTag(id), "max");
	revalidatePath("/admin/data-types/referred-out");
	revalidatePath(`/admin/data-types/referred-out/${id}/edit`);
};

export const revalidateServiceCache = async (id: string) => {
	// console.log(">>> revalidate called for id:", id);
	revalidateTag(cacheTags.getServiceGlobalTag(), "max");
	revalidateTag(cacheTags.getServiceIdTag(id), "max");
	revalidatePath("/admin/data-types/client-services");
	revalidatePath(`/admin/data-types/client-services/${id}/edit`);
};
