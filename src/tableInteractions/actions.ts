"use server";

import { z } from "zod";
import { clientServiceSchema } from "./schemas";
import { deleteClientService, insertClientService, updateClientServiceById } from "./db";

export const createClientService = async (unsafeData: z.infer<typeof clientServiceSchema>) => {
	const { success, data } = clientServiceSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const clientService = await insertClientService(data);

	return {
		error: !clientService,
		message: !clientService ? "Failed to create client service" : "Client service created successfully",
	};
};

export const updateClientService = async (id: string, unsafeData: z.infer<typeof clientServiceSchema>) => {
	const { success, data } = clientServiceSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };
	return await updateClientServiceById(id, data);
};

export const removeClientService = async (id: string) => {
	const clientService = await deleteClientService(id);

	return {
		error: !clientService,
		message: !clientService ? "Failed to remove client service" : "Client service removed successfully",
	};
};
