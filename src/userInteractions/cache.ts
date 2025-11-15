"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as cacheTags from "./cacheTags";

export const revalidateUserCache = async (id: string) => {
	revalidateTag(cacheTags.getAllUsersGlobalTag(), "max");
	revalidateTag(cacheTags.getUserIdTag(id), "max");
	revalidatePath("/");
};

export const revalidateClientCache = async (id: string) => {
	revalidateTag(cacheTags.getClientGlobalTag(), "max");
	revalidateTag(cacheTags.getClientIdTag(id), "max");
	revalidatePath("/admin/clients");
	revalidatePath(`/admin/clients/${id}/edit`);
};
