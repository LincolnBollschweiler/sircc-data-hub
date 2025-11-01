import PageHeader from "@/components/PageHeader";
import VolunteerTypesForm from "@/components/volunteerTypes/VolunteerTypesForm";

export default function NewVolunteerTypesPage() {
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="New Volunteer Type" />
			<VolunteerTypesForm />
		</div>
	);
}
