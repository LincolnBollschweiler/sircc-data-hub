import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/users/DataTable";
import { VolunteerDetails } from "@/components/users/volunteers/VolunteerDetails";
import { getVolunteerTypes, VolunteerType } from "@/tableInteractions/db";
import { getVolunteerById, VolunteerHours } from "@/userInteractions/db";
import Link from "next/link";

export default async function ViewVolunteersPage({ params }: { params: Promise<{ volunteerId: string }> }) {
	const { volunteerId } = await params;

	const [fullVolunteer, volunteerTypes] = await Promise.all([getVolunteerById(volunteerId), getVolunteerTypes()]);

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={`View Volunteer`}>
				<Button asChild>
					<Link href="/admin/volunteers">Back to Volunteers</Link>
				</Button>
			</PageHeader>
			{fullVolunteer && (
				<>
					<VolunteerDetails user={fullVolunteer.user} />
					<DataTable
						data={fullVolunteer?.volunteerHours as VolunteerHours[]}
						volunteerTypes={volunteerTypes as VolunteerType[]}
						userId={volunteerId}
						userType="volunteer-hours"
						title="Hours"
					/>
				</>
			)}
		</div>
	);
}
