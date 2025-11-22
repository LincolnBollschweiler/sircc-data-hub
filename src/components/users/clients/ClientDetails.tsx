"use client";

import { ClientFull } from "@/userInteractions/db";
import { formatPhoneNumber } from "react-phone-number-input";
import { ClientCoach } from "./ClientCoach";
import BigIconCheckbox from "../../BigIconCheckbox";
import { useState } from "react";
import { updateClientIsReentryStatus } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import EditClientDialog from "./EditClientDialog";

export const ClientDetails = ({
	user,
	client,
	allCoaches,
	coachIsViewing,
}: {
	user: ClientFull["user"];
	client: ClientFull["client"];
	allCoaches: ClientFull["coach"][];
	coachIsViewing?: boolean;
}) => {
	const [isReentry, setIsReentry] = useState(client.isReentryClient);

	const setIsReentryClient = async (checked: boolean) => {
		// Here you would typically call an action to update the client's re-entry status in the backend
		setIsReentry(checked);

		const action = updateClientIsReentryStatus.bind(null, client.id);
		const actionData = await action(checked, !!coachIsViewing);
		if (actionData) {
			actionToast({ actionData });
		}
	};

	return (
		<div className="flex flex-wrap gap-x-2 gap-y-0 items-center container mx-auto mb-6 border border-[border-muted/50] p-2.5 rounded-lg shadow-md  bg-background-light">
			<div className="flex w-full justify-between items-center">
				<div className="font-semibold text-xl mb-1">General Info</div>
				<EditClientDialog user={user} client={client} reentryUpdateCallback={setIsReentryClient}>
					<DialogTrigger asChild>
						<Button>Edit Client</Button>
					</DialogTrigger>
				</EditClientDialog>
			</div>
			<div>
				{user?.firstName} {user?.lastName}
			</div>
			{user?.email && <div>{user.email}</div>}
			{user?.phone && <div>{formatPhoneNumber(user.phone)}</div>}
			{user?.address1 && (
				<div>
					{user?.address1 && <span>{user.address1} </span>}
					{user?.address2 && <span>{user.address2} </span>}
					{user?.city && (
						<span>
							{user.city}
							{user?.state && `, ${user.state}`} {user?.zip ?? ""}
						</span>
					)}
				</div>
			)}
			<ClientCoach client={client} allCoaches={allCoaches} coachIsViewing={coachIsViewing} />
			<div className="flex items-center gap-1">
				<BigIconCheckbox checked={!!isReentry} onChange={(checked) => setIsReentryClient(checked)} />
				<span>Re-entry Client</span>
			</div>
		</div>
	);
};
