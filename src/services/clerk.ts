import { UserRole } from "@/drizzle/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";

const client = await clerkClient();

export const getCurrentUser = async () => {
	const { userId, sessionClaims, redirectToSignIn } = await auth();

	return {
		clerkUserId: userId,
		userId: sessionClaims?.dbId,
		role: sessionClaims?.role as UserRole | undefined,
		redirectToSignIn,
	};
};

export const syncClerkUserMetadata = (user: { id: string; clerkUserId: string; role: UserRole }) => {
	return client.users.updateUserMetadata(user.clerkUserId, {
		publicMetadata: {
			dbId: user.id,
			role: user.role,
		},
	});
};
