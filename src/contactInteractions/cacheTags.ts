import { getGlobalTag, getIdTag } from "@/lib/dataCache";

export const getAllContactsGlobalTag = () => getGlobalTag("contacts");
export const getContactIdTag = (id: string) => getIdTag("contacts", id);
