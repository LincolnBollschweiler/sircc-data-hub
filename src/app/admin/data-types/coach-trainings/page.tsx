import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getTrainings } from "@/tableInteractions/db";
import Trainings from "@/components/data-types/coachTrainings/Trainings";
import TrainingsFormDialog from "@/components/data-types/coachTrainings/TrainingsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default async function TrainingsPage() {
	const coachTrainings = await getTrainings();

	return (
		<div className="container py-4">
			<PageHeader title="Coach Trainings">
				<TrainingsFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Coach Training</Button>
					</DialogTrigger>
				</TrainingsFormDialog>
			</PageHeader>
			<Trainings items={coachTrainings} />
		</div>
	);
}
