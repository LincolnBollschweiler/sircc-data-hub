import { db } from "@/drizzle/db";
import * as dbTable from "@/drizzle/schema";
import * as cache from "./cache";
import { eq } from "drizzle-orm";
import { isNull } from "drizzle-orm";
import { getClientServiceGlobalTag } from "@/tableInteractions/cache";
import { revalidatePath, unstable_cache } from "next/cache";

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
	{ tags: [cache.getVolunteeringTypeGlobalTag()] }
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
	revalidatePath("/admin/data-types/volunteer-types");

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
	{ tags: [cache.getReentryChecklistItemGlobalTag()] }
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
	revalidatePath("/admin/data-types/reentry-checklist-items");

	return items;
};
//#endregion

//#region Client Service DB Interactions
export const insertClientService = async (data: typeof dbTable.service.$inferInsert) => {
	const [newClientService] = await db.insert(dbTable.service).values(data).returning();

	if (!newClientService) return;

	cache.revalidateClientServiceCache(newClientService.id);

	return newClientService;
};

export const getClientServiceById = async (id: string) => {
	const clientService = await db.query.service.findFirst({
		columns: { id: true, name: true, description: true, dispersesFunds: true },
		where: eq(dbTable.service.id, id),
	});

	if (!clientService) {
		throw new Error("Client service not found");
	}
	return clientService;
};

export const updateClientServiceById = async (id: string, data: Partial<typeof dbTable.service.$inferInsert>) => {
	const [updatedClientService] = await db
		.update(dbTable.service)
		.set(data)
		.where(eq(dbTable.service.id, id))
		.returning();
	if (!updatedClientService) {
		return { error: true, message: "Failed to update client service" };
	}
	cache.revalidateClientServiceCache(id);
	return { error: false, message: "Client service updated successfully" };
};

export const deleteClientService = async (id: string) => {
	const [deletedClientService] = await db
		.update(dbTable.service)
		.set({ deletedAt: new Date() })
		.where(eq(dbTable.service.id, id))
		.returning();

	if (!deletedClientService) return;

	cache.revalidateClientServiceCache(id);
	return deletedClientService;
};

const cachedClientServices = unstable_cache(
	async () => {
		console.log("Fetching client services from DB (not cache)");
		return await db
			.select({
				id: dbTable.service.id,
				name: dbTable.service.name,
				description: dbTable.service.description,
				dispersesFunds: dbTable.service.dispersesFunds,
				createdAt: dbTable.service.createdAt,
				updatedAt: dbTable.service.updatedAt,
			})
			.from(dbTable.service)
			.where(isNull(dbTable.service.deletedAt))
			.orderBy(dbTable.service.order);
	},
	["getClientServices"],
	{ tags: [getClientServiceGlobalTag()] }
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
			cache.revalidateClientServiceCache(svc.id);
		}
	});
	revalidatePath("/admin/data-types/client-services");

	return services;
};
//#endregion Client Service DB Interactions
