import CoachTrainingsForm from "@/components/coachTrainings/CoachTrainingsForm";
import PageHeader from "@/components/PageHeader";

export default function NewCoachTrainingPage() {
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="New Coach Training" />
			<CoachTrainingsForm />
		</div>
	);
}
