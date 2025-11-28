import PageHeader from "@/components/PageHeader";
import DataTable from "../DataTable";
import { getVolunteerById, VolunteerHours } from "@/userInteractions/db";
import { getVolunteerTypes, VolunteerType } from "@/tableInteractions/db";

export default async function VolunteerDetailsWrapper({ volunteerId }: { volunteerId: string }) {
	const [fullVolunteer, volunteerTypes] = await Promise.all([getVolunteerById(volunteerId), getVolunteerTypes()]);

	return (
		<>
			{fullVolunteer && (
				<div className="container py-4 mx-auto">
					<PageHeader title="Volunteer Details" />

					<DataTable
						data={fullVolunteer?.volunteerHours as VolunteerHours[]}
						volunteerTypes={volunteerTypes as VolunteerType[]}
						userId={volunteerId}
						userType="volunteer-hours-view"
						title="Hours"
					/>
				</div>
			)}
		</>
	);
}
