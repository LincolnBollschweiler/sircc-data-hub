import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getTrainings } from "@/tableInteractions/db";
import Trainings from "@/components/data-types/coachTrainings/Trainings";
import TrainingsFormDialog from "@/components/data-types/coachTrainings/TrainingsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export default async function TrainingsPage() {
	const coachTrainings = await getTrainings();

	return (
		<div className="container py-4">
			<PageHeader title="Coach Trainings">
				<TrainingsFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New Coach Training</Button>
					</DialogTrigger>
				</TrainingsFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<Trainings items={coachTrainings} />
		</div>
	);
}
