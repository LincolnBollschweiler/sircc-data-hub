import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import ReentryChecklistItems from "@/components/ReentryChecklistItems";
import { getReentryChecklistItems } from "@/tableInteractions/db";

export default async function ReentryChecklistItemsPage() {
	const reentryChecklistItems = await getReentryChecklistItems();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Reentry Checklist Items">
				<Button asChild>
					<Link href="/admin/data-types/reentry-checklist-items/new">Add New Reentry Checklist Item</Link>
				</Button>
			</PageHeader>

			{/* scroll container handled inside ReentryChecklistItems */}
			<ReentryChecklistItems items={reentryChecklistItems} />
		</div>
	);
}
