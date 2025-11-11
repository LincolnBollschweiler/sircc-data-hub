import PageHeader from "@/components/PageHeader";
import ReentryChecklistItemsForm from "@/components/reentryChecklistItems/ReentryChecklistItemsForm";

export default function NewVolunteerTypesPage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Reentry Checklist Item" />
			<ReentryChecklistItemsForm />
		</div>
	);
}
