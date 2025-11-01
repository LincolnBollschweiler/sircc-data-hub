import PageHeader from "@/components/PageHeader";
import { unstable_cache } from "next/cache";
import ReentryChecklistItemsForm from "@/components/reentryChecklistItems/ReentryChecklistItemsForm";
import { getReentryChecklistItemIdTag } from "@/tableInteractions/cache";
import { getReentryChecklistItemById } from "@/tableInteractions/db";

export default async function EditReentryChecklistItemsPage({
	params,
}: {
	params: Promise<{ reentryChecklistItemId: string }>;
}) {
	const { reentryChecklistItemId } = await params;
	const reentryChecklistItem = await getCachedReentryChecklistItem(reentryChecklistItemId);
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="Edit Reentry Checklist Item" />
			<ReentryChecklistItemsForm reentryChecklistItem={reentryChecklistItem} />
		</div>
	);
}

const getCachedReentryChecklistItem = (reentryChecklistItemId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getReentryChecklistItemById(reentryChecklistItemId);
		},
		["getReentryChecklistItemById", reentryChecklistItemId],
		{ tags: [getReentryChecklistItemIdTag(reentryChecklistItemId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
