"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as cacheTags from "./cacheTags";

export const revalidateContactCache = async (id: string) => {
	revalidateTag(cacheTags.getAllContactsGlobalTag(), "max");
	revalidateTag(cacheTags.getContactIdTag(id), "max");
	revalidatePath("/admin/business-contacts");
};
