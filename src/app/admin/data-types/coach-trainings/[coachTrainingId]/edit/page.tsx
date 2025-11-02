import CoachTrainingsForm from "@/components/coachTrainings/CoachTrainingsForm";
import PageHeader from "@/components/PageHeader";
import { getCoachTrainingIdTag } from "@/tableInteractions/cacheTags";
import { getCoachTrainingById } from "@/tableInteractions/db";
import { unstable_cache } from "next/cache";

export default async function EditCoachTrainingPage({ params }: { params: Promise<{ coachTrainingId: string }> }) {
	const { coachTrainingId } = await params;
	const coachTraining = await getCachedCoachTraining(coachTrainingId);
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="Edit Coach Training" />
			<CoachTrainingsForm coachTraining={coachTraining} />
		</div>
	);
}

const getCachedCoachTraining = (coachTrainingId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getCoachTrainingById(coachTrainingId);
		},
		["getCoachTrainingById", coachTrainingId],
		{ tags: [getCoachTrainingIdTag(coachTrainingId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
