import { getGlobalTag, getIdTag } from "@/lib/dataCache";

export const getUserSitesGlobalTag = () => getGlobalTag("user-sites");
export const getAllUsersGlobalTag = () => getGlobalTag("users");
export const getUserGlobalTag = () => getGlobalTag("users");
export const getUserIdTag = (id: string) => getIdTag("users", id);
