"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { City, Location, Service, ReferralSource, ReferredOut, Visit } from "@/tableInteractions/db";
import { ClientCombobox } from "./ClientCombobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClientService } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientServiceInsert } from "@/userInteractions/db";

export default function ClientServiceFormDialog({
	clientId,
	newServiceProps,
	values,
	children,
}: {
	clientId: string | null;
	values?: Partial<ClientServiceInsert>;
	newServiceProps: {
		services: Service[];
		locations: Location[];
		referralSources: ReferralSource[];
		referredOut: ReferredOut[];
		visits: Visit[];
		cities: City[];
	};
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [requestedServiceId, setRequestedServiceId] = useState<string | null>(values?.requestedServiceId || null);
	const [providedServiceId, setProvidedServiceId] = useState<string | null>(values?.providedServiceId || null);
	const [locationId, setLocationId] = useState<string | null>(values?.locationId || null);
	const [cityId, setCityId] = useState<string | null>(values?.cityId || null);
	const [referralSourceId, setReferralSourceId] = useState<string | null>(values?.referralSourceId || null);
	const [referredOutId, setReferredOutId] = useState<string | null>(values?.referredOutId || null);
	const [visitTypeId, setVisitTypeId] = useState<string | null>(values?.visitId || null);
	const [clientNotes, setClientNotes] = useState<string>(values?.notes || "");
	const [funds, setFunds] = useState<string>(values?.funds ? values.funds.toString() : "");
	const [fundsVisible, setFundsVisible] = useState(values?.funds ? true : false);
	const fundsInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (providedServiceId) {
			const selectedService = newServiceProps.services.find((service) => service.id === providedServiceId);
			if (selectedService && selectedService.requiresFunding) {
				setFundsVisible(true);
			} else {
				setFundsVisible(false);
			}
		} else {
			setFundsVisible(false);
		}
	}, [providedServiceId, newServiceProps.services]);

	useEffect(() => {
		if (fundsVisible) fundsInputRef.current?.focus();
	}, [fundsVisible]);

	const [action, setAction] = useState<"save" | "cancel" | "dismiss" | null>(null);

	const handleCancel = () => {
		setAction("cancel");
		setIsOpen(false);
		setProvidedServiceId(null);
		setRequestedServiceId(null);
		setCityId(null);
		setLocationId(null);
		setReferralSourceId(null);
		setReferredOutId(null);
		setVisitTypeId(null);
		setFunds("");
		setClientNotes("");
	};

	const handleSave = async () => {
		setAction("save");
		setIsOpen(false);

		if (!clientId) {
			console.error("Client ID is null. Cannot create client service.");
			return;
		}

		if (!providedServiceId) {
			const actionData = { error: true, message: "Please select a provided service." };
			actionToast({ actionData });
			return;
		}

		const clientService = {
			clientId,
			cityId: cityId,
			locationId: locationId,
			requestedServiceId: requestedServiceId,
			providedServiceId: providedServiceId,
			referralSourceId: referralSourceId,
			referredOutId: referredOutId,
			visitId: visitTypeId,
			notes: clientNotes,
			funds: fundsVisible && funds ? parseFloat(funds) : null,
		} as ClientServiceInsert;

		const action = createClientService.bind(null, null);
		const actionData = await action(clientService);
		if (actionData) {
			actionToast({ actionData });
			requestAnimationFrame(() => window.location.reload());
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
					<DialogTitle>{`${!values ? "Add New Client Service" : "Edit Client Service"}`}</DialogTitle>
				</DialogHeader>
				<div className="my-4 flex flex-col gap-2">
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Requested Service</Label>
						<ClientCombobox
							label="Select Service"
							items={newServiceProps.services}
							value={requestedServiceId}
							onChange={setRequestedServiceId}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Provided Service</Label>
						<ClientCombobox
							label="Select Service"
							items={newServiceProps.services}
							value={providedServiceId}
							onChange={setProvidedServiceId}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className={cn("font-medium text-right w-[30%]", !fundsVisible && "opacity-50")}>
							Funds Disbursed
						</Label>
						<div className="relative">
							<DollarSign className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="newServiceFunds"
								ref={fundsInputRef}
								disabled={!fundsVisible}
								type="number"
								value={funds}
								onChange={(e) => setFunds(e.target.value)}
								min="0"
								step="0.01"
								placeholder="0"
								className="w-[60%] pl-9"
							/>
						</div>
					</div>

					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">City</Label>
						<ClientCombobox
							label="Select City"
							items={newServiceProps.cities}
							value={cityId}
							onChange={setCityId}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Location</Label>
						<ClientCombobox
							label="Select Location"
							items={newServiceProps.locations}
							value={locationId}
							onChange={setLocationId}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Referral Source</Label>
						<ClientCombobox
							label="Select Referral Source"
							items={newServiceProps.referralSources}
							value={referralSourceId}
							onChange={setReferralSourceId}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Referred Out To</Label>
						<ClientCombobox
							label="Select Referred Out"
							items={newServiceProps.referredOut}
							value={referredOutId}
							onChange={setReferredOutId}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Visit Reason</Label>
						<ClientCombobox
							label="Select Visit Reason"
							items={newServiceProps.visits}
							value={visitTypeId}
							onChange={setVisitTypeId}
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
