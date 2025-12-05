import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import ReentryChecklistItems from "@/components/data-types/reentryChecklistItems/ReentryChecklistItems";
import { getReentryChecklistItems } from "@/tableInteractions/db";
import ReentryChecklistItemsFormDialog from "@/components/data-types/reentryChecklistItems/ReentryChecklistItemsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export default async function ReentryChecklistItemsPage() {
	const reentryChecklistItems = await getReentryChecklistItems();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Re-entry Checklist Items">
				<ReentryChecklistItemsFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add Re-entry Checklist Item</Button>
					</DialogTrigger>
				</ReentryChecklistItemsFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<ReentryChecklistItems items={reentryChecklistItems} />
		</div>
	);
}
