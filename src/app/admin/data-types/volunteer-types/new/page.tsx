import PageHeader from "@/components/PageHeader";
import VolunteerTypesForm from "@/components/VolunteerTypesForm";

export default function NewVolunteerTypesPage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Volunteering Type" />
			<VolunteerTypesForm />
		</div>
	);
}
