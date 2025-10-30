// TODO: review video timestamp 1:28:00 for cache invalidation strategy

// TODO: Add more tags as needed
type CACHE_TAG =
	| "users"
	| "coaches"
	| "clients"
	| "volunteers"
	| "client-services"
	| "volunteer-types"
	| "reentry-checklist-items"
	| "coach-trainings"
	| "locations"
	| "referral-sources"
	| "sites";

export const getGlobalTag = (tag: CACHE_TAG) => {
	return `global:${tag}` as const;
};

export const getIdTag = (tag: CACHE_TAG, id: string) => {
	return `id:${id}-${tag}` as const;
};

export const getUserTag = (tag: CACHE_TAG, userId: string) => {
	return `user:${userId}-${tag}` as const;
};

export const getCoachTag = (tag: CACHE_TAG, userId: string) => {
	return `coach:${userId}-${tag}` as const;
};
