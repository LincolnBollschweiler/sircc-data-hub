import { getGlobalTag, getIdTag } from "@/lib/dataCache";

export const getVolunteeringTypeGlobalTag = () => getGlobalTag("volunteer-types");
export const getVolunteeringTypeIdTag = (id: string) => getIdTag("volunteer-types", id);
export const getReentryChecklistItemGlobalTag = () => getGlobalTag("reentry-checklist-items");
export const getReentryChecklistItemIdTag = (id: string) => getIdTag("reentry-checklist-items", id);
export const getCoachTrainingGlobalTag = () => getGlobalTag("coach-trainings");
export const getCoachTrainingIdTag = (id: string) => getIdTag("coach-trainings", id);
export const getLocationGlobalTag = () => getGlobalTag("locations");
export const getLocationIdTag = (id: string) => getIdTag("locations", id);
export const getSiteGlobalTag = () => getGlobalTag("sites");
export const getSiteIdTag = (id: string) => getIdTag("sites", id);
export const getReferralSourceGlobalTag = () => getGlobalTag("referral-sources");
export const getReferralSourceIdTag = (id: string) => getIdTag("referral-sources", id);
export const getClientServiceGlobalTag = () => getGlobalTag("client-services");
export const getClientServiceIdTag = (id: string) => getIdTag("client-services", id);
export const getUserSitesGlobalTag = () => getGlobalTag("user-sites");
