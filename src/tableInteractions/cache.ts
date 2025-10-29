import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidatePath, revalidateTag } from "next/cache";

//#region Volunteer Types Cache Tags
export const getVolunteeringTypeGlobalTag = () => {
	return getGlobalTag("volunteer-types");
};

export const getVolunteeringTypeIdTag = (id: string) => {
	console.log("Getting ID tag for client service ID:", id, getIdTag("volunteer-types", id));
	return getIdTag("volunteer-types", id);
};

export const revalidateVolunteeringTypeCache = async (id: string) => {
	console.log(">>> revalidate called for id:", id);
	revalidateTag(getVolunteeringTypeGlobalTag(), "max");
	revalidateTag(getVolunteeringTypeIdTag(id), "max");
	revalidatePath("/admin/data-types/volunteer-types");
	revalidatePath(`/admin/data-types/volunteer-types/${id}/edit`);
};
//#endregion

//#region Client Services Cache Tags
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
//#endregion
