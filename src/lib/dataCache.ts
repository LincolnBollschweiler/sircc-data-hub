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
	| "cities"
	| "visits"
	| "referral-sources"
	| "referred-out"
	| "sites"
	| "user-sites";

export const getGlobalTag = (tag: CACHE_TAG) => `global:${tag}` as const;
export const getIdTag = (tag: CACHE_TAG, id: string) => `id:${id}-${tag}` as const;
export const getUserTag = (tag: CACHE_TAG, userId: string) => `user:${userId}-${tag}` as const;
export const getCoachTag = (tag: CACHE_TAG, userId: string) => `coach:${userId}-${tag}` as const;
