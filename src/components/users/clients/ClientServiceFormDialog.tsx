"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	City,
	Location,
	ClientService,
	ReferralSource,
	ReferredOut,
	Visit,
	ClientServiceInsert,
} from "@/tableInteractions/db";
import { ReactNode, useState } from "react";
import { ClientCombobox } from "./ClientCombobox";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { createClientService } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";

export default function ClientServiceFormDialog({
	clientId,
	newServiceProps,
	children,
}: {
	clientId: string | null;
	newServiceProps: {
		services: ClientService[];
		locations: Location[];
		referralSources: ReferralSource[];
		referredOut: ReferredOut[];
		visits: Visit[];
		cities: City[];
	};
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const [serviceValue, setServiceValue] = useState<string | null>(null);
	const [locationValue, setLocationValue] = useState<string | null>(null);
	const [cityValue, setCityValue] = useState<string | null>(null);
	const [referralSourceValue, setReferralSourceValue] = useState<string | null>(null);
	const [referredOutValue, setReferredOutValue] = useState<string | null>(null);
	const [visitValue, setVisitValue] = useState<string | null>(null);
	const [clientNotes, setClientNotes] = useState<string>("");

	const [action, setAction] = useState<"save" | "cancel" | "dismiss" | null>(null);

	const handleCancel = () => {
		setAction("cancel");
		setIsOpen(false);
		setServiceValue(null);
		setCityValue(null);
		setLocationValue(null);
		setReferralSourceValue(null);
		setReferredOutValue(null);
		setVisitValue(null);
		setClientNotes("");
	};

	const handleSave = async () => {
		setAction("save");
		setIsOpen(false);
		console.log("Client service saved with the following details:");
		console.log("Service ID:", serviceValue);
		console.log("City ID:", cityValue);
		console.log("Location ID:", locationValue);
		console.log("Referral Source ID:", referralSourceValue);
		console.log("Referred Out ID:", referredOutValue);
		console.log("Visit ID:", visitValue);
		console.log("Client Notes:", clientNotes);

		if (!clientId) {
			console.error("Client ID is null. Cannot create client service.");
			return;
		}
		const clientService = {
			clientId,
			cityId: cityValue,
			locationId: locationValue,
			providedServiceId: serviceValue,
			referralSourceId: referralSourceValue,
			referredOutId: referredOutValue,
			visitId: visitValue,
			notes: clientNotes,
		} as ClientServiceInsert;

		const action = createClientService.bind(null, null);
		const actionData = await action(clientService);
		if (actionData) {
			actionToast({ actionData });
		}
	};

	const handleOpenChange = (open: boolean) => {
		// When dialog closes without clicking Save or Cancel
		if (!open && action === null) {
			setAction("dismiss"); // clicking outside or pressing ESC
			console.log("Client service dialog dismissed without action.");
		}
		setIsOpen(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{"Add New Client Service"}</DialogTitle>
				</DialogHeader>
				<div className="my-4 flex flex-col gap-2">
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Service</Label>
						<ClientCombobox
							label="Select Service"
							items={newServiceProps.services}
							value={serviceValue}
							onChange={setServiceValue}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">City</Label>
						<ClientCombobox
							label="Select City"
							items={newServiceProps.cities}
							value={cityValue}
							onChange={setCityValue}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Location</Label>
						<ClientCombobox
							label="Select Location"
							items={newServiceProps.locations}
							value={locationValue}
							onChange={setLocationValue}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Referral Source</Label>
						<ClientCombobox
							label="Select Referral Source"
							items={newServiceProps.referralSources}
							value={referralSourceValue}
							onChange={setReferralSourceValue}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Referred Out To</Label>
						<ClientCombobox
							label="Select Referred Out"
							items={newServiceProps.referredOut}
							value={referredOutValue}
							onChange={setReferredOutValue}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Visit Reason</Label>
						<ClientCombobox
							label="Select Visit Reason"
							items={newServiceProps.visits}
							value={visitValue}
							onChange={setVisitValue}
						/>
					</div>
				</div>
				<div className="mb-4">
					<Textarea
						className="min-h-20 resize-none"
						placeholder="Notes ..."
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
