import { db } from "@/drizzle/db";
import { service } from "@/drizzle/schema";
import { revalidateClientServiceCache } from "../cache/clientService";

export const insertClientService = async (data: typeof service.$inferInsert) => {
	const [newClientService] = await db.insert(service).values(data).returning();

	if (!newClientService) {
		throw new Error("Failed to insert client service");
	}

	revalidateClientServiceCache(newClientService.id);

	return newClientService;
};
