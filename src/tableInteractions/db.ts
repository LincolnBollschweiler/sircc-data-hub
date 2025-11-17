import { db } from "@/drizzle/db";
import * as dbTable from "@/drizzle/schema";
import * as cache from "./cache";
import * as cacheTags from "./cacheTags";
import { eq } from "drizzle-orm";
import { isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";

//#region Volunteer Types
export const insertVolunteerType = async (data: typeof dbTable.volunteeringType.$inferInsert) => {
	const [rv] = await db.insert(dbTable.volunteeringType).values(data).returning();
	if (!rv) return;

	cache.revalidateVolunteeringTypeCache(rv.id);
	return rv;
};

export const getVolunteerTypeById = async (id: string) => {
	const volunteerType = await db.query.volunteeringType.findFirst({
		columns: { id: true, name: true, description: true },
		where: eq(dbTable.volunteeringType.id, id),
	});

	if (!volunteerType) {
		throw new Error("Volunteer type not found");
	}
	return volunteerType;
};

export const updateVolunteerTypeById = async (
	id: string,
	data: Partial<typeof dbTable.volunteeringType.$inferInsert>
) => {
	const [rv] = await db
		.update(dbTable.volunteeringType)
		.set(data)
		.where(eq(dbTable.volunteeringType.id, id))
		.returning();
	if (!rv) {
		return { error: true, message: "Failed to update volunteer type" };
	}
	cache.revalidateVolunteeringTypeCache(id);
	return { error: false, message: "Volunteer type updated successfully" };
};

export const deleteVolunteerType = async (id: string) => {
	const [rv] = await db
		.update(dbTable.volunteeringType)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.volunteeringType.id, id))
		.returning();
	if (!rv) return;

	cache.revalidateVolunteeringTypeCache(id);
	return rv;
};

const cachedVolunteerTypes = unstable_cache(
	async () => {
		console.log("Fetching volunteer types from DB (not cache)");
		return await db
			.select({
				id: dbTable.volunteeringType.id,
				name: dbTable.volunteeringType.name,
				description: dbTable.volunteeringType.description,
				createdAt: dbTable.volunteeringType.createdAt,
				updatedAt: dbTable.volunteeringType.updatedAt,
			})
			.from(dbTable.volunteeringType)
			.where(isNull(dbTable.volunteeringType.deletedAt))
			.orderBy(dbTable.volunteeringType.order);
	},
	["getVolunteerTypes"],
	{ tags: [cacheTags.getVolunteeringTypeGlobalTag()] }
);

export const getVolunteerTypes = async () => cachedVolunteerTypes();

export const updateVolunteerTypeOrders = async (orderedIds: string[]) => {
	const services = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.volunteeringType)
				.set({ order: index })
				.where(eq(dbTable.volunteeringType.id, id))
				.returning();
			return rv;
		})
	);

	services.flat().forEach((svc) => {
		if (svc) {
			cache.revalidateVolunteeringTypeCache(svc.id);
		}
	});

	return services;
};
//#endregion

//#region Reentry Checklist Items
export const insertReentryChecklistItem = async (data: typeof dbTable.reentryCheckListItem.$inferInsert) => {
	const [rv] = await db.insert(dbTable.reentryCheckListItem).values(data).returning();
	if (!rv) return;

	cache.revalidateReentryChecklistItemCache(rv.id);
	return rv;
};

export const getReentryChecklistItemById = async (id: string) => {
	const reentryChecklistItem = await db.query.reentryCheckListItem.findFirst({
		columns: { id: true, name: true, description: true },
		where: eq(dbTable.reentryCheckListItem.id, id),
	});

	if (!reentryChecklistItem) {
		throw new Error("Reentry checklist item not found");
	}
	return reentryChecklistItem;
};

export const updateReentryChecklistItemById = async (
	id: string,
	data: Partial<typeof dbTable.reentryCheckListItem.$inferInsert>
) => {
	const [rv] = await db
		.update(dbTable.reentryCheckListItem)
		.set(data)
		.where(eq(dbTable.reentryCheckListItem.id, id))
		.returning();
	if (!rv) {
		return { error: true, message: "Failed to update reentry checklist item" };
	}
	cache.revalidateReentryChecklistItemCache(id);
	return { error: false, message: "Reentry checklist item updated successfully" };
};

export const deleteReentryChecklistItem = async (id: string) => {
	const [rv] = await db
		.update(dbTable.reentryCheckListItem)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.reentryCheckListItem.id, id))
		.returning();
	if (!rv) return;

	cache.revalidateReentryChecklistItemCache(id);
	return rv;
};

const cachedReentryChecklistItems = unstable_cache(
	async () => {
		console.log("Fetching reentry checklist items from DB (not cache)");
		return await db
			.select({
				id: dbTable.reentryCheckListItem.id,
				name: dbTable.reentryCheckListItem.name,
				description: dbTable.reentryCheckListItem.description,
				createdAt: dbTable.reentryCheckListItem.createdAt,
				updatedAt: dbTable.reentryCheckListItem.updatedAt,
			})
			.from(dbTable.reentryCheckListItem)
			.where(isNull(dbTable.reentryCheckListItem.deletedAt))
			.orderBy(dbTable.reentryCheckListItem.order);
	},
	["getReentryChecklistItems"],
	{ tags: [cacheTags.getReentryChecklistItemGlobalTag()] }
);

export const getReentryChecklistItems = async () => cachedReentryChecklistItems();

export const updateReentryChecklistItemOrders = async (orderedIds: string[]) => {
	const items = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.reentryCheckListItem)
				.set({ order: index })
				.where(eq(dbTable.reentryCheckListItem.id, id))
				.returning();
			return rv;
		})
	);

	items.flat().forEach((item) => {
		if (item) {
			cache.revalidateReentryChecklistItemCache(item.id);
		}
	});

	return items;
};
//#endregion

//#region Coach Trainings
export const insertCoachTraining = async (data: typeof dbTable.training.$inferInsert) => {
	const [rv] = await db.insert(dbTable.training).values(data).returning();
	if (!rv) return;

	cache.revalidateCoachTrainingCache(rv.id);
	return rv;
};

export const getCoachTrainingById = async (id: string) => {
	const coachTraining = await db.query.training.findFirst({
		columns: { id: true, name: true, description: true },
		where: eq(dbTable.training.id, id),
	});
	if (!coachTraining) throw new Error("Coach training not found");
	return coachTraining;
};

export const updateCoachTrainingById = async (id: string, data: Partial<typeof dbTable.training.$inferInsert>) => {
	const [rv] = await db.update(dbTable.training).set(data).where(eq(dbTable.training.id, id)).returning();
	if (!rv) {
		return { error: true, message: "Failed to update coach training" };
	}
	cache.revalidateCoachTrainingCache(id);
	return { error: false, message: "Coach training updated successfully" };
};

export const deleteCoachTraining = async (id: string) => {
	const [rv] = await db
		.update(dbTable.training)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.training.id, id))
		.returning();
	if (!rv) return;

	cache.revalidateCoachTrainingCache(id);
	return rv;
};

const cachedCoachTrainings = unstable_cache(
	async () => {
		console.log("Fetching coach trainings from DB (not cache)");
		return await db
			.select({
				id: dbTable.training.id,
				name: dbTable.training.name,
				description: dbTable.training.description,
				createdAt: dbTable.training.createdAt,
				updatedAt: dbTable.training.updatedAt,
			})
			.from(dbTable.training)
			.where(isNull(dbTable.training.deletedAt))
			.orderBy(dbTable.training.order);
	},
	["getCoachTrainings"],
	{ tags: [cacheTags.getCoachTrainingGlobalTag()] }
);

export const getCoachTrainings = async () => cachedCoachTrainings();

export const updateCoachTrainingOrders = async (orderedIds: string[]) => {
	const trainings = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.training)
				.set({ order: index })
				.where(eq(dbTable.training.id, id))
				.returning();
			return rv;
		})
	);

	trainings.flat().forEach((training) => {
		if (training) {
			cache.revalidateCoachTrainingCache(training.id);
		}
	});

	return trainings;
};
//#endregion

//#region Locations DB Interactions
export const insertLocation = async (data: typeof dbTable.location.$inferInsert) => {
	const [newLocation] = await db.insert(dbTable.location).values(data).returning();

	if (!newLocation) return;
	cache.revalidateLocationCache(newLocation.id);
	return newLocation;
};

export const getLocationById = async (id: string) => {
	const location = await db.query.location.findFirst({
		columns: { id: true, name: true, description: true },
		where: eq(dbTable.location.id, id),
	});

	if (!location) throw new Error("Location not found");
	return location;
};

export const updateLocationById = async (id: string, data: Partial<typeof dbTable.location.$inferInsert>) => {
	const [updatedLocation] = await db
		.update(dbTable.location)
		.set(data)
		.where(eq(dbTable.location.id, id))
		.returning();
	if (!updatedLocation) {
		return { error: true, message: "Failed to update location" };
	}
	cache.revalidateLocationCache(id);
	return { error: false, message: "Location updated successfully" };
};

export const deleteLocation = async (id: string) => {
	const [deletedLocation] = await db
		.update(dbTable.location)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.location.id, id))
		.returning();
	if (!deletedLocation) return;
	cache.revalidateLocationCache(id);
	return deletedLocation;
};

export type Location = typeof dbTable.location.$inferSelect;
const cachedLocations = unstable_cache(
	async () => {
		console.log("Fetching locations from DB (not cache)");
		return await db
			.select({
				id: dbTable.location.id,
				name: dbTable.location.name,
				description: dbTable.location.description,
				createdAt: dbTable.location.createdAt,
				updatedAt: dbTable.location.updatedAt,
			})
			.from(dbTable.location)
			.where(isNull(dbTable.location.deletedAt))
			.orderBy(dbTable.location.order);
	},
	["getLocations"],
	{ tags: [cacheTags.getLocationGlobalTag()] }
);

export const getLocations = async () => cachedLocations();

export const updateLocationOrders = async (orderedIds: string[]) => {
	const locations = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.location)
				.set({ order: index })
				.where(eq(dbTable.location.id, id))
				.returning();
			return rv;
		})
	);

	locations.flat().forEach((location) => {
		if (location) {
			cache.revalidateLocationCache(location.id);
		}
	});

	return locations;
};
//#endregion Locations DB Interactions

//#region Cities DB Interactions
export const insertCity = async (data: typeof dbTable.city.$inferInsert) => {
	const [newCity] = await db.insert(dbTable.city).values(data).returning();
	if (!newCity) return;
	cache.revalidateCitiesCache(newCity.id);
	return newCity;
};
export const getCityById = async (id: string) => {
	const city = await db.query.city.findFirst({
		columns: { id: true, name: true },
		where: eq(dbTable.city.id, id),
	});

	if (!city) throw new Error("City not found");
	return city;
};
export const updateCityById = async (id: string, data: Partial<typeof dbTable.city.$inferInsert>) => {
	const [updatedCity] = await db.update(dbTable.city).set(data).where(eq(dbTable.city.id, id)).returning();
	if (!updatedCity) {
		return { error: true, message: "Failed to update city" };
	}
	cache.revalidateCitiesCache(id);
	return { error: false, message: "City updated successfully" };
};
export const deleteCity = async (id: string) => {
	const [deletedCity] = await db
		.update(dbTable.city)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.city.id, id))
		.returning();
	if (!deletedCity) return;
	cache.revalidateCitiesCache(id);
	return deletedCity;
};
export type City = typeof dbTable.city.$inferSelect;
const cachedCities = unstable_cache(
	async () => {
		console.log("Fetching cities from DB (not cache)");
		return await db
			.select({
				id: dbTable.city.id,
				name: dbTable.city.name,
				createdAt: dbTable.city.createdAt,
				updatedAt: dbTable.city.updatedAt,
			})
			.from(dbTable.city)
			.where(isNull(dbTable.city.deletedAt))
			.orderBy(dbTable.city.order);
	},
	["getCities"],
	{ tags: [cacheTags.getCitiesGlobalTag()] }
);
export const getCities = async () => cachedCities();
export const updateCityOrders = async (orderedIds: string[]) => {
	const cities = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db.update(dbTable.city).set({ order: index }).where(eq(dbTable.city.id, id)).returning();
			return rv;
		})
	);

	cities.flat().forEach((city) => {
		if (city) {
			cache.revalidateCitiesCache(city.id);
		}
	});

	return cities;
};
//#endregion Cities DB Interactions

//#region Visits DB Interactions
export const insertVisit = async (data: typeof dbTable.visit.$inferInsert) => {
	const [newVisit] = await db.insert(dbTable.visit).values(data).returning();
	if (!newVisit) return;
	cache.revalidateVisitsCache(newVisit.id);
	return newVisit;
};
export const getVisitById = async (id: string) => {
	const visit = await db.query.visit.findFirst({
		columns: { id: true, name: true, description: true },
		where: eq(dbTable.visit.id, id),
	});

	if (!visit) throw new Error("Visit not found");
	return visit;
};
export const updateVisitById = async (id: string, data: Partial<typeof dbTable.visit.$inferInsert>) => {
	const [updatedVisit] = await db.update(dbTable.visit).set(data).where(eq(dbTable.visit.id, id)).returning();
	if (!updatedVisit) {
		return { error: true, message: "Failed to update visit" };
	}
	cache.revalidateVisitsCache(id);
	return { error: false, message: "Visit updated successfully" };
};
export const deleteVisit = async (id: string) => {
	const [deletedVisit] = await db
		.update(dbTable.visit)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.visit.id, id))
		.returning();
	if (!deletedVisit) return;
	cache.revalidateVisitsCache(id);
	return deletedVisit;
};
export type Visit = typeof dbTable.visit.$inferSelect;
const cachedVisits = unstable_cache(
	async () => {
		console.log("Fetching visits from DB (not cache)");
		return await db
			.select({
				id: dbTable.visit.id,
				name: dbTable.visit.name,
				description: dbTable.visit.description,
				createdAt: dbTable.visit.createdAt,
				updatedAt: dbTable.visit.updatedAt,
			})
			.from(dbTable.visit)
			.where(isNull(dbTable.visit.deletedAt))
			.orderBy(dbTable.visit.order);
	},
	["getVisits"],
	{ tags: [cacheTags.getVisitGlobalTag()] }
);
export const getVisits = async () => cachedVisits();

export const updateVisitOrders = async (orderedIds: string[]) => {
	const visits = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.visit)
				.set({ order: index })
				.where(eq(dbTable.visit.id, id))
				.returning();
			return rv;
		})
	);

	visits.flat().forEach((visit) => {
		if (visit) {
			cache.revalidateVisitsCache(visit.id);
		}
	});

	return visits;
};
//#endregion Visits DB Interactions

//#region Referral Sources DB Interactions
export const insertReferralSource = async (data: typeof dbTable.referralSource.$inferInsert) => {
	const [newReferralSource] = await db.insert(dbTable.referralSource).values(data).returning();

	if (!newReferralSource) return;
	cache.revalidateReferralSourceCache(newReferralSource.id);
	return newReferralSource;
};

export const getReferralSourceById = async (id: string) => {
	const referralSource = await db.query.referralSource.findFirst({
		columns: { id: true, name: true, description: true },
		where: eq(dbTable.referralSource.id, id),
	});

	if (!referralSource) throw new Error("Referral source not found");
	return referralSource;
};

export const updateReferralSourceById = async (
	id: string,
	data: Partial<typeof dbTable.referralSource.$inferInsert>
) => {
	const [updatedReferralSource] = await db
		.update(dbTable.referralSource)
		.set(data)
		.where(eq(dbTable.referralSource.id, id))
		.returning();
	if (!updatedReferralSource) {
		return { error: true, message: "Failed to update referral source" };
	}
	cache.revalidateReferralSourceCache(id);
	return { error: false, message: "Referral source updated successfully" };
};

export const deleteReferralSource = async (id: string) => {
	const [deletedReferralSource] = await db
		.update(dbTable.referralSource)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.referralSource.id, id))
		.returning();

	if (!deletedReferralSource) return;

	cache.revalidateReferralSourceCache(id);
	return deletedReferralSource;
};

export type ReferralSource = typeof dbTable.referralSource.$inferSelect;
const cachedReferralSources = unstable_cache(
	async () => {
		console.log("Fetching referral sources from DB (not cache)");
		return await db
			.select({
				id: dbTable.referralSource.id,
				name: dbTable.referralSource.name,
				description: dbTable.referralSource.description,
				createdAt: dbTable.referralSource.createdAt,
				updatedAt: dbTable.referralSource.updatedAt,
			})
			.from(dbTable.referralSource)
			.where(isNull(dbTable.referralSource.deletedAt))
			.orderBy(dbTable.referralSource.order);
	},
	["getReferralSources"],
	{ tags: [cacheTags.getReferralSourceGlobalTag()] }
);

export const getReferralSources = async () => cachedReferralSources();

export const updateReferralSourceOrders = async (orderedIds: string[]) => {
	const sources = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.referralSource)
				.set({ order: index })
				.where(eq(dbTable.referralSource.id, id))
				.returning();
			return rv;
		})
	);

	sources.flat().forEach((src) => {
		if (src) {
			cache.revalidateReferralSourceCache(src.id);
		}
	});

	return sources;
};
//#endregion Referral Sources DB Interactions

//#region Referred Out DB Interactions
export const insertReferredOut = async (data: typeof dbTable.referredOut.$inferInsert) => {
	const [newReferredOut] = await db.insert(dbTable.referredOut).values(data).returning();
	if (!newReferredOut) return;
	cache.revalidateReferredOutCache(newReferredOut.id);
	return newReferredOut;
};

export const getReferredOutById = async (id: string) => {
	const referredOut = await db.query.referredOut.findFirst({
		columns: { id: true, name: true, description: true },
		where: eq(dbTable.referredOut.id, id),
	});

	if (!referredOut) throw new Error("Referred out not found");
	return referredOut;
};

export const updateReferredOutById = async (id: string, data: Partial<typeof dbTable.referredOut.$inferInsert>) => {
	const [updatedReferredOut] = await db
		.update(dbTable.referredOut)
		.set(data)
		.where(eq(dbTable.referredOut.id, id))
		.returning();
	if (!updatedReferredOut) {
		return { error: true, message: "Failed to update referred out" };
	}
	cache.revalidateReferredOutCache(id);
	return { error: false, message: "Referred out updated successfully" };
};

export const deleteReferredOut = async (id: string) => {
	const [deletedReferredOut] = await db
		.update(dbTable.referredOut)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.referredOut.id, id))
		.returning();

	if (!deletedReferredOut) return;

	cache.revalidateReferredOutCache(id);
	return deletedReferredOut;
};

export type ReferredOut = typeof dbTable.referredOut.$inferSelect;
const cachedReferredOut = unstable_cache(
	async () => {
		console.log("Fetching referred out from DB (not cache)");
		return await db
			.select({
				id: dbTable.referredOut.id,
				name: dbTable.referredOut.name,
				description: dbTable.referredOut.description,
				createdAt: dbTable.referredOut.createdAt,
				updatedAt: dbTable.referredOut.updatedAt,
			})
			.from(dbTable.referredOut)
			.where(isNull(dbTable.referredOut.deletedAt))
			.orderBy(dbTable.referredOut.order);
	},
	["getReferredOut"],
	{ tags: [cacheTags.getReferredOutGlobalTag()] }
);
export const getReferredOut = async () => cachedReferredOut();

export const updateReferredOutOrders = async (orderedIds: string[]) => {
	const referredOuts = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.referredOut)
				.set({ order: index })
				.where(eq(dbTable.referredOut.id, id))
				.returning();
			return rv;
		})
	);

	referredOuts.flat().forEach((referredOut) => {
		if (referredOut) {
			cache.revalidateReferredOutCache(referredOut.id);
		}
	});

	return referredOuts;
};
//#endregion Referred Out DB Interactions

//#region Sites DB Interactions
export const insertSite = async (data: typeof dbTable.site.$inferInsert) => {
	const [newSite] = await db.insert(dbTable.site).values(data).returning();
	if (!newSite) return;
	cache.revalidateSiteCache(newSite.id);
	return newSite;
};

export const getSiteById = async (id: string) => {
	const site = await db.query.site.findFirst({
		columns: { id: true, name: true, address: true, phone: true },
		where: eq(dbTable.site.id, id),
	});

	if (!site) throw new Error("Site not found");
	return site;
};

export const updateSiteById = async (id: string, data: Partial<typeof dbTable.site.$inferInsert>) => {
	const [updatedSite] = await db.update(dbTable.site).set(data).where(eq(dbTable.site.id, id)).returning();
	if (!updatedSite) {
		return { error: true, message: "Failed to update site" };
	}
	cache.revalidateSiteCache(id);
	return { error: false, message: "Site updated successfully" };
};

export const deleteSite = async (id: string) => {
	const [deletedSite] = await db
		.update(dbTable.site)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.site.id, id))
		.returning();

	if (!deletedSite) return;

	cache.revalidateSiteCache(id);
	return deletedSite;
};

export type Site = typeof dbTable.site.$inferSelect;
const cachedSites = unstable_cache(
	async () => {
		console.log("Fetching sites from DB (not cache)");
		return await db
			.select({
				id: dbTable.site.id,
				name: dbTable.site.name,
				address: dbTable.site.address,
				phone: dbTable.site.phone,
				createdAt: dbTable.site.createdAt,
				updatedAt: dbTable.site.updatedAt,
			})
			.from(dbTable.site)
			.where(isNull(dbTable.site.deletedAt))
			.orderBy(dbTable.site.order);
	},
	["getSites"],
	{ tags: [cacheTags.getSiteGlobalTag()] }
);

export const getSites = async () => cachedSites();

export const updateSiteOrders = async (orderedIds: string[]) => {
	const sites = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db.update(dbTable.site).set({ order: index }).where(eq(dbTable.site.id, id)).returning();
			return rv;
		})
	);

	sites.flat().forEach((site) => {
		if (site) {
			cache.revalidateSiteCache(site.id);
		}
	});

	return sites;
};
//#endregion Sites DB Interactions

//#region Client Service DB Interactions
export const insertService = async (data: typeof dbTable.service.$inferInsert) => {
	const [newClientService] = await db.insert(dbTable.service).values(data).returning();

	if (!newClientService) return;

	cache.revalidateServiceCache(newClientService.id);

	return newClientService;
};

export const getClientServiceById = async (id: string) => {
	const clientService = await db.query.service.findFirst({
		columns: { id: true, name: true, description: true, requiresFunding: true },
		where: eq(dbTable.service.id, id),
	});

	if (!clientService) {
		throw new Error("Client service not found");
	}
	return clientService;
};

export const updateServiceById = async (id: string, data: Partial<typeof dbTable.service.$inferInsert>) => {
	const [updatedClientService] = await db
		.update(dbTable.service)
		.set(data)
		.where(eq(dbTable.service.id, id))
		.returning();
	if (!updatedClientService) {
		return { error: true, message: "Failed to update client service" };
	}
	cache.revalidateServiceCache(id);
	return { error: false, message: "Client service updated successfully" };
};

export const deleteClientService = async (id: string) => {
	const [deletedClientService] = await db
		.update(dbTable.service)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.service.id, id))
		.returning();

	if (!deletedClientService) return;

	cache.revalidateServiceCache(id);
	return deletedClientService;
};

export type ClientService = typeof dbTable.service.$inferSelect;
export type ClientServiceInsert = typeof dbTable.clientService.$inferInsert;

const cachedClientServices = unstable_cache(
	async () => {
		console.log("Fetching client services from DB (not cache)");
		return await db
			.select({
				id: dbTable.service.id,
				name: dbTable.service.name,
				description: dbTable.service.description,
				requiresFunding: dbTable.service.requiresFunding,
				createdAt: dbTable.service.createdAt,
				updatedAt: dbTable.service.updatedAt,
			})
			.from(dbTable.service)
			.where(isNull(dbTable.service.deletedAt))
			.orderBy(dbTable.service.order);
	},
	["getClientServices"],
	{ tags: [cacheTags.getClientServiceGlobalTag()] }
);

export const getClientServices = async () => cachedClientServices();

export const updateClientServiceOrders = async (orderedIds: string[]) => {
	const services = await Promise.all(
		orderedIds.map(async (id, index) => {
			const [rv] = await db
				.update(dbTable.service)
				.set({ order: index })
				.where(eq(dbTable.service.id, id))
				.returning();
			return rv;
		})
	);

	services.flat().forEach((svc) => {
		if (svc) {
			cache.revalidateServiceCache(svc.id);
		}
	});

	return services;
};

export const getCachedClientService = (clientServiceId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getClientServiceById(clientServiceId);
		},
		["getClientServiceById", clientServiceId],
		{ tags: [cacheTags.getClientServiceIdTag(clientServiceId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
//#endregion Client Service DB Interactions
