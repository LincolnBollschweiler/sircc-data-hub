import PageHeader from "@/components/PageHeader";
import ReentryChecklistItemsForm from "@/components/reentryChecklistItems/ReentryChecklistItemsForm";

export default function NewVolunteerTypesPage() {
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="New Reentry Checklist Item" />
			<ReentryChecklistItemsForm />
		</div>
	);
}
