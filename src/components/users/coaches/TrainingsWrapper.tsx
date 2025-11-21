import { getTrainingsForCoach } from "@/userInteractions/db";
import { getTrainings } from "@/tableInteractions/db";
import Trainings from "./Trainings";

export default async function TrainingsWrapper({ coachId, isCoachView }: { coachId: string; isCoachView?: boolean }) {
	const trainingsForCoach = await getTrainingsForCoach(coachId);
	const trainings = await getTrainings();

	return (
		<Trainings
			coachId={coachId}
			trainingsForCoach={trainingsForCoach}
			trainings={trainings}
			isCoachView={isCoachView}
		/>
	);
}
