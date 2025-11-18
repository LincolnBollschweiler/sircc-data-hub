import { getClientReentryCheckListItemsForClient } from "@/userInteractions/db";
import ReentryCheckList from "./ReentryCheckList";
import { getReentryChecklistItems } from "@/tableInteractions/db";

export default async function ReentryCheckListWrapper({ clientId }: { clientId: string }) {
	const clientCheckListItems = await getClientReentryCheckListItemsForClient(clientId);
	const checkListItems = await getReentryChecklistItems();

	return (
		<ReentryCheckList
			clientId={clientId}
			clientCheckListItems={clientCheckListItems}
			checkListItems={checkListItems}
		/>
	);
}
