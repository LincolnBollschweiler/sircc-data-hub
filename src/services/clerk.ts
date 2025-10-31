import { db } from "@/drizzle/db";
import { user, UserRole } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const client = await clerkClient();

const getCachedUser = (userId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			// console.log("Fetching from DB (not cache):", userId);
			return await db.query.user.findFirst({
				where: eq(user.id, userId),
			});
		},
		["getUserById", userId],
		{ tags: [getUserIdTag(userId)] }
	);
	return cachedFn(); // execute it only when this function is called
};

export const getCurrentUser = async ({ allData = false } = {}) => {
	const { userId, sessionClaims, redirectToSignIn } = await auth();

	return {
		clerkUserId: userId,
		userId: sessionClaims?.dbId,
		role: sessionClaims?.role as UserRole | undefined,
		data: allData && sessionClaims?.dbId != null ? await getCachedUser(sessionClaims.dbId) : undefined,
		redirectToSignIn,
	};
};

export const syncClerkUserMetadata = (user: { id: string; clerkUserId: string; role: UserRole }) => {
	console.log("Syncing Clerk user metadata for:", user.clerkUserId, "with role:", user.role);
	return client.users.updateUserMetadata(user.clerkUserId, {
		publicMetadata: {
			dbId: user.id,
			role: user.role,
		},
	});
};
