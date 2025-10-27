import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getClientServiceGlobalTag = () => {
	return getGlobalTag("client-services");
};

export const getClientServiceIdTag = (id: string) => {
	console.log("Getting ID tag for client service ID:", id, getIdTag("client-services", id));
	return getIdTag("client-services", id);
};

export const revalidateClientServiceCache = async (id: string) => {
	// console.log("Revalidating cache for client service ID:", id, getClientServiceIdTag(id));
	revalidateTag(getClientServiceGlobalTag(), "max");
	revalidateTag(getClientServiceIdTag(id), "max");
};
