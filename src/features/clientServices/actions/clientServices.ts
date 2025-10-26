"use server";

import { z } from "zod";
import { clientServiceSchema } from "../schemas/clientServices";
import { redirect } from "next/navigation";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { insertClientService } from "../db/clientServices";

export const createClientService = async (unsafeData: z.infer<typeof clientServiceSchema>) => {
	const { success, data } = clientServiceSchema.safeParse(unsafeData);

	if (!success) return { error: true, message: "Validation failed" };

	const clientService = await insertClientService(data);

	if (!clientService || !canAccessAdminPages(await getCurrentUser())) {
		return { error: true, message: "Failed to create client service" };
	}

	redirect("/admin/data-types/client-services");
};
