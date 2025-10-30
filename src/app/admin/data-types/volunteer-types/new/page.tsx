import PageHeader from "@/components/PageHeader";
import VolunteerTypesForm from "@/components/volunteerTypes/VolunteerTypesForm";

export default function NewVolunteerTypesPage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Volunteer Type" />
			<VolunteerTypesForm />
		</div>
	);
}
