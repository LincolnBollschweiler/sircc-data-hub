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
	console.log("calling revalidate for client id:", id);
	revalidatePath(`/admin/clients/${id}/edit`);
};

export const revalidateCoachCache = async (id: string) => {
	revalidateTag(cacheTags.getCoachGlobalTag(), "max");
	revalidateTag(cacheTags.getCoachIdTag(id), "max");
	revalidatePath("/admin/coaches");
	console.log("calling revalidate for coach id:", id);
	revalidatePath(`/admin/coaches/${id}/edit`);
};
