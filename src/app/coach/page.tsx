import CoachDetailsWrapper from "@/components/users/coaches/CoachDetailsWrapper";
import { getCurrentClerkUser } from "@/services/clerk";
import { clerkUserSchema } from "@/userInteractions/schema";
import { z } from "zod";

export default async function CoachPage() {
	const currentUser = await getCurrentClerkUser({ allData: true });
	const profile = currentUser?.data as z.infer<typeof clerkUserSchema> & { id: string };

	if (!currentUser || !currentUser.role!.includes("coach")) {
		return (
			<div className="container py-4 mx-auto">
				<span>
					You are not listed as a coach. If you should be, please contact an SIRCC Admin. Or, if you are an
					Admin, find yourself on the
				</span>
				<a href="/admin/admins" className="ml-1 mr-1 text-blue-500 hover:underline">
					admins
				</a>
				<span> page and update your role to include &quot;coach&quot;.</span>
			</div>
		);
	}

	return (
		<>
			<CoachDetailsWrapper coachId={profile.id} />
		</>
	);
}
