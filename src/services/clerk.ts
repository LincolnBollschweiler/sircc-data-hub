import { db } from "@/drizzle/db";
import { user, UserRole } from "@/drizzle/schema";
import { getUserIdTag } from "@/userInteractions/cacheTags";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const client = await clerkClient();

const getCachedClerkUser = (userId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await db.query.user.findFirst({
				where: eq(user.id, userId),
			});
		},
		["getUserById", userId],
		{ tags: [getUserIdTag(userId)] }
	);
	return cachedFn(); // execute it only when this function is called
};

export const getCurrentClerkUser = async ({ allData = false } = {}) => {
	const { userId, sessionClaims, redirectToSignIn } = await auth();

	return {
		clerkUserId: userId,
		userId: sessionClaims?.dbId,
		role: sessionClaims?.role as UserRole | undefined,
		data: allData && sessionClaims?.dbId != null ? await getCachedClerkUser(sessionClaims.dbId) : undefined,
		redirectToSignIn,
	};
};

export const syncClerkUserMetadata = (user: { id: string; clerkUserId: string | null; role: UserRole }) => {
	// console.log("Syncing Clerk user metadata for:", user.clerkUserId, "with role:", user.role);
	if (!user.clerkUserId) return;
	return client.users.updateUserMetadata(user.clerkUserId, {
		publicMetadata: {
			dbId: user.id,
			role: user.role,
		},
	});
};
