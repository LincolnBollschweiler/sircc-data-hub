"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as cacheTags from "./cacheTags";

export const revalidateUserCache = async (id: string) => {
	revalidateTag(cacheTags.getAllUsersGlobalTag(), "max");
	revalidateTag(cacheTags.getUserIdTag(id), "max");
	revalidatePath("/");
};
