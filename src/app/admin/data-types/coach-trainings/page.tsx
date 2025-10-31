import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { getCoachTrainings } from "@/tableInteractions/db";
import CoachTrainings from "@/components/coachTrainings/CoachTrainings";

export default async function CoachTrainingsPage() {
	const coachTrainings = await getCoachTrainings();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Coach Trainings">
				<Button asChild>
					<Link href="/admin/data-types/coach-trainings/new">Add New Coach Training</Link>
				</Button>
			</PageHeader>

			{/* scroll container handled inside ClientServices */}
			<CoachTrainings items={coachTrainings} />
		</div>
	);
}
