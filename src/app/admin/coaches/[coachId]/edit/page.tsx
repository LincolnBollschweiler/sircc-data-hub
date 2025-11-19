import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/users/DataTable";
import { getCoachById, CoachHours, ClientFull, CoachMiles } from "@/userInteractions/db";
import Link from "next/link";

export default async function ViewCoachPage({ params }: { params: Promise<{ coachId: string }> }) {
	const { coachId } = await params;
	const fullCoach = await getCoachById(coachId);
	// console.dir(fullCoach, { depth: null });
	if (!fullCoach) {
		return <div className="text-center py-10 text-xl font-semibold">Coach not found</div>;
	}

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={`View Coach`}>
				<Button asChild>
					<Link href="/admin/coaches">Back to Coaches</Link>
				</Button>
			</PageHeader>
			{fullCoach && (
				<>
					{/* <ClientDetails user={fullCoach.user} client={fullCoach.client} allCoaches={allCoaches} /> */}
					{/* {fullCoach.client.isReentryClient && <ReentryCheckListWrapper clientId={coachId} />} */}

					<DataTable title="Clients" data={fullCoach.clients as ClientFull[]} userType="coach-clients" />
					<br />
					<DataTable title="Hours" data={fullCoach.coachHours as CoachHours[]} userType="coach-hours" />
					<br />
					<DataTable title="Miles" data={fullCoach.coachMiles as CoachMiles[]} userType="coach-miles" />
				</>
			)}
		</div>
	);
}
