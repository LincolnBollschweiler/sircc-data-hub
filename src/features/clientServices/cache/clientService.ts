import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getClientServiceGlobalTag = () => {
	return getGlobalTag("client-services");
};

export const getClientServiceIdTag = (id: string) => {
	return getIdTag("client-services", id);
};

export const revalidateClientServiceCache = (id: string) => {
	revalidateTag(getClientServiceGlobalTag(), "max");
	revalidateTag(getClientServiceIdTag(id), "max");
};
