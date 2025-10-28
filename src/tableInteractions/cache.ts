import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidatePath, revalidateTag } from "next/cache";

export const getClientServiceGlobalTag = () => {
	return getGlobalTag("client-services");
};

export const getClientServiceIdTag = (id: string) => {
	console.log("Getting ID tag for client service ID:", id, getIdTag("client-services", id));
	return getIdTag("client-services", id);
};

export const revalidateClientServiceCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(getClientServiceGlobalTag(), "max");
	revalidateTag(getClientServiceIdTag(id), "max");
	revalidatePath("/admin/data-types/client-services");
	revalidatePath(`/admin/data-types/client-services/${id}/edit`);
};
