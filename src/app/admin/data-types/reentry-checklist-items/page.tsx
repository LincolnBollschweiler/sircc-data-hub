import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import ReentryChecklistItems from "@/components/reentryChecklistItems/ReentryChecklistItems";
import { getReentryChecklistItems } from "@/tableInteractions/db";
import ReentryChecklistItemsFormDialog from "@/components/reentryChecklistItems/ReentryChecklistItemsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default async function ReentryChecklistItemsPage() {
	const reentryChecklistItems = await getReentryChecklistItems();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Reentry Checklist Items">
				<ReentryChecklistItemsFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Reentry Checklist Item</Button>
					</DialogTrigger>
				</ReentryChecklistItemsFormDialog>
			</PageHeader>
			<ReentryChecklistItems items={reentryChecklistItems} />
		</div>
	);
}
