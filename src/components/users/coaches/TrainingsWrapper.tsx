import { getTrainingsForCoach } from "@/userInteractions/db";
import { getCoachTrainings } from "@/tableInteractions/db";
import Trainings from "./Trainings";

export default async function TrainingsWrapper({ coachId, isCoachView }: { coachId: string; isCoachView?: boolean }) {
	const trainingsForCoach = await getTrainingsForCoach(coachId);
	const trainings = await getCoachTrainings();

	return (
		<Trainings
			coachId={coachId}
			trainingsForCoach={trainingsForCoach}
			trainings={trainings}
			isCoachView={isCoachView}
		/>
	);
}
