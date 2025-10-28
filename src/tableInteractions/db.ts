import { db } from "@/drizzle/db";
import { service } from "@/drizzle/schema";
import { revalidateClientServiceCache } from "./cache";
import { eq } from "drizzle-orm";
import { isNull, desc } from "drizzle-orm";
import { getClientServiceGlobalTag } from "@/tableInteractions/cache";
import { unstable_cache } from "next/cache";

//#region Client Service DB Interactions
export const insertClientService = async (data: typeof service.$inferInsert) => {
	const [newClientService] = await db.insert(service).values(data).returning();

	if (!newClientService) return;

	revalidateClientServiceCache(newClientService.id);

	return newClientService;
};

export const deleteClientService = async (id: string) => {
	const [deletedClientService] = await db
		.update(service)
		.set({ deletedAt: new Date() })
		.where(eq(service.id, id))
		.returning();

	if (!deletedClientService) return;

	revalidateClientServiceCache(id);
	return deletedClientService;
};

export const updateClientServiceById = async (id: string, data: Partial<typeof service.$inferInsert>) => {
	const [updatedClientService] = await db.update(service).set(data).where(eq(service.id, id)).returning();
	if (!updatedClientService) {
		return { error: true, message: "Failed to update client service" };
	}
	revalidateClientServiceCache(id);
	return { error: false, message: "Client service updated successfully" };
};

export const getClientServiceById = async (id: string) => {
	const clientService = await db.query.service.findFirst({
		columns: { id: true, name: true, description: true, dispersesFunds: true },
		where: eq(service.id, id),
	});

	if (!clientService) {
		throw new Error("Client service not found");
	}
	return clientService;
};

const cachedClientServices = unstable_cache(
	async () => {
		console.log("Fetching client services from DB (not cache)");
		return await db
			.select({
				id: service.id,
				name: service.name,
				description: service.description,
				dispersesFunds: service.dispersesFunds,
				createdAt: service.createdAt,
				updatedAt: service.updatedAt,
			})
			.from(service)
			.where(isNull(service.deletedAt))
			.orderBy(desc(service.createdAt));
	},
	["getClientServices"],
	{ tags: [getClientServiceGlobalTag()] }
);

export const getClientServices = async () => cachedClientServices();
//#endregion Client Service DB Interactions
