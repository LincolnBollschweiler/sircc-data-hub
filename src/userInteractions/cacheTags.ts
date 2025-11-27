import { getGlobalTag, getIdTag } from "@/lib/dataCache";

export const getUserSitesGlobalTag = () => getGlobalTag("user-sites");
export const getAllUsersGlobalTag = () => getGlobalTag("users");
export const getUserGlobalTag = () => getGlobalTag("users");
export const getUserIdTag = (id: string) => getIdTag("users", id);
export const getClientGlobalTag = () => getGlobalTag("clients");
export const getClientIdTag = (id: string) => getIdTag("clients", id);
export const getCoachGlobalTag = () => getGlobalTag("coaches");
export const getCoachIdTag = (id: string) => getIdTag("coaches", id);
