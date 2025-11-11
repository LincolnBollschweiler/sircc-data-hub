import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getCoachTrainings } from "@/tableInteractions/db";
import CoachTrainings from "@/components/coachTrainings/CoachTrainings";
import CoachTrainingsFormDialog from "@/components/coachTrainings/CoachTrainingsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default async function CoachTrainingsPage() {
	const coachTrainings = await getCoachTrainings();

	return (
		<div className="container py-4">
			<PageHeader title="Coach Trainings">
				<CoachTrainingsFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Coach Training</Button>
					</DialogTrigger>
				</CoachTrainingsFormDialog>
			</PageHeader>
			<CoachTrainings items={coachTrainings} />
		</div>
	);
}
