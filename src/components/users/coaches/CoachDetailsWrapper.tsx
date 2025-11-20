import { ClientFull, CoachHours, CoachMiles, getCoachById } from "@/userInteractions/db";
import TrainingsWrapper from "./TrainingsWrapper";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";

export default async function CoachDetailsWrapper({ coachId }: { coachId: string }) {
	const fullCoach = await getCoachById(coachId);

	if (!fullCoach) return null;

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Your Account Details" />
			<TrainingsWrapper coachId={coachId} />

			<DataTable title="Clients" data={fullCoach.clients as ClientFull[]} userType="coach-clients" />
			<br />
			<DataTable title="Hours" data={fullCoach.coachHours as CoachHours[]} userType="coach-hours" />
			<br />
			<DataTable title="Miles" data={fullCoach.coachMiles as CoachMiles[]} userType="coach-miles" />
		</div>
	);
}
