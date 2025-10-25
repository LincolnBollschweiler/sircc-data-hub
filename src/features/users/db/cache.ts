import { revalidateTag } from "next/cache";

export const getUserGlobalTag = () => {
	return "users";
};

export const getUserIdTag = (id: string) => {
	return `user${id}`;
};

export const revalidateUserCache = (id: string) => {
	revalidateTag(getUserGlobalTag());
	revalidateTag(getUserIdTag(id));
};
