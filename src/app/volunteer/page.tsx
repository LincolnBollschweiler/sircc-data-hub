import VolunteerDetailsWrapper from "@/components/users/volunteers/VolunteerDetailsWrapper";
import { getCurrentClerkUser } from "@/services/clerk";
import { clerkUserSchema } from "@/userInteractions/schema";
import { z } from "zod";

export default async function VolunteerPage() {
	const currentUser = await getCurrentClerkUser({ allData: true });
	const profile = currentUser?.data as z.infer<typeof clerkUserSchema> & { id: string };

	if (!currentUser || !currentUser.role!.includes("volunteer")) {
		return (
			<div className="container py-4 mx-auto">
				<span>
					You are not listed as a volunteer. If you should be, please contact an SIRCC Admin. Or, if you are
					an Admin, find yourself on the
				</span>
				<a href="/admin/admins" className="ml-1 mr-1 text-blue-600 hover:underline">
					admins
				</a>
				<span> page and update your role to include &quot;client&quot;.</span>
			</div>
		);
	}

	return (
		<>
			<VolunteerDetailsWrapper volunteerId={profile.id} />
		</>
	);
}
