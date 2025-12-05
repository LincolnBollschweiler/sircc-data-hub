import { ClientReentryCheckListItem } from "@/userInteractions/db";
import ReentryCheckList from "./ReentryCheckList";
import { getReentryChecklistItems } from "@/tableInteractions/db";

export default async function ReentryCheckListWrapper({
	clientId,
	clientCheckListItems,
	isClientView,
}: {
	clientId: string;
	clientCheckListItems: ClientReentryCheckListItem[];
	isClientView?: boolean;
}) {
	const checkListItems = await getReentryChecklistItems();

	return (
		<ReentryCheckList
			clientId={clientId}
			clientCheckListItems={clientCheckListItems}
			checkListItems={checkListItems}
			isClientView={isClientView}
		/>
	);
}
