import { getTrainingsForCoach } from "@/userInteractions/db";
import { getTrainings } from "@/tableInteractions/db";
import Trainings from "./Trainings";

export default async function TrainingsWrapper({ coachId, isCoachView }: { coachId: string; isCoachView?: boolean }) {
	const [trainingsForCoach, trainings] = await Promise.all([getTrainingsForCoach(coachId), getTrainings()]);

	return (
		<Trainings
			coachId={coachId}
			trainingsForCoach={trainingsForCoach}
			trainings={trainings}
			isCoachView={isCoachView}
		/>
	);
}
