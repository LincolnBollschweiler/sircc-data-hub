import CoachTrainingsForm from "@/components/coachTrainings/CoachTrainingsForm";
import PageHeader from "@/components/PageHeader";

export default function NewCoachTrainingPage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Volunteering Type" />
			<CoachTrainingsForm />
		</div>
	);
}
