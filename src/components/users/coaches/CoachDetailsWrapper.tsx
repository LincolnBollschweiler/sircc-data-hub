import { ClientFull, CoachHours, CoachMiles, getCoachById } from "@/userInteractions/db";
import TrainingsWrapper from "./TrainingsWrapper";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import HoursDialog from "./HoursDialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import MilesDialog from "./MilesDialog";

export default async function CoachDetailsWrapper({ coachId }: { coachId: string }) {
	const fullCoach = await getCoachById(coachId);

	if (!fullCoach) return null;

	// console.dir(fullCoach, { depth: null });

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Your Account Details">
				<HoursDialog coachId={coachId}>
					<DialogTrigger asChild>
						<Button>Log Hours</Button>
					</DialogTrigger>
				</HoursDialog>
				<MilesDialog coachId={coachId}>
					<DialogTrigger asChild>
						<Button className="ml-2">Log Miles</Button>
					</DialogTrigger>
				</MilesDialog>
			</PageHeader>
			{/* <div className="flex justify-end mb-4">
				<HoursDialog coachId={coachId}>
					<DialogTrigger asChild>
						<Button>Log Hours</Button>
					</DialogTrigger>
				</HoursDialog>
				<MilesDialog coachId={coachId}>
					<DialogTrigger asChild>
						<Button className="ml-2">Log Miles</Button>
					</DialogTrigger>
				</MilesDialog>
			</div> */}
			<TrainingsWrapper coachId={coachId} isCoachView={true} />
			<DataTable title="Clients" data={fullCoach.clients as ClientFull[]} userType="coach-clients" />
			<br />
			<DataTable title="Hours" data={fullCoach.coachHours as CoachHours[]} userType="coach-hours" />
			<br />
			<DataTable title="Miles" data={fullCoach.coachMiles as CoachMiles[]} userType="coach-miles" />
		</div>
	);
}
