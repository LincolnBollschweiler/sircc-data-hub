"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientCombobox } from "./ClientCombobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClientService } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { ClientServiceInsert } from "@/userInteractions/db";
import { Service } from "@/tableInteractions/db";

export default function ClientServiceDialog({
	clientId,
	services,
	children,
}: {
	clientId: string | null;
	services?: Service[];
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [requestedServiceId, setRequestedServiceId] = useState<string | null>(null);
	const [clientNotes, setClientNotes] = useState<string>("");
	const [action, setAction] = useState<"save" | "cancel" | "dismiss" | null>(null);

	const handleCancel = () => {
		setAction("cancel");
		setIsOpen(false);
		setRequestedServiceId(null);
		setClientNotes("");
	};

	const handleSave = async () => {
		setAction("save");
		setIsOpen(false);

		if (!clientId) {
			console.error("Client ID is null. Cannot create client service.");
			return;
		}

		if (!requestedServiceId) {
			const actionData = { error: true, message: "Please select a requested service." };
			actionToast({ actionData });
			return;
		}

		const clientService = {
			clientId,
			requestedServiceId: requestedServiceId,
			notes: clientNotes,
		} as ClientServiceInsert;

		const action = createClientService.bind(null, null);
		const actionData = await action(clientService);
		if (actionData) actionToast({ actionData });
	};

	const handleOpenChange = (open: boolean) => {
		// When dialog closes without clicking Save or Cancel
		if (!open && action === null) setAction("dismiss"); // clicking outside or pressing ESC
		setIsOpen(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>Request a Service</DialogTitle>
				</DialogHeader>
				<div className="my-4 flex flex-col gap-2">
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Requested Service</Label>
						<ClientCombobox
							label="Select Service"
							items={services ? services : []}
							value={requestedServiceId}
							onChange={setRequestedServiceId}
						/>
					</div>
				</div>
				<div className="mb-4">
					<Textarea
						className="min-h-20 resize-none"
						placeholder="Optional notes about your service request"
						value={clientNotes}
						onChange={(e) => setClientNotes(e.target.value)}
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" onClick={handleSave}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
