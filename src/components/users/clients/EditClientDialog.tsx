"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateClientDetails } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { Client, ClientUpdate } from "@/userInteractions/db";
import { User } from "@/types";
import PhoneInput from "react-phone-number-input/input";
import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// import { Service } from "@/tableInteractions/db";

export default function EditClientDialog({
	user,
	client,
	children,
	reentryUpdateCallback,
}: {
	user: User;
	client: Client;
	children: ReactNode;
	reentryUpdateCallback: (checked: boolean) => void;
}) {
	// const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };
	const [calendarOpen, setCalendarOpen] = useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const [phone, setPhone] = useState<string>(user.phone || "");
	const [isReentryClient, setIsReentryClient] = useState<boolean>(client.isReentryClient || false);
	const [followUpNotes, setFollowUpNotes] = useState<string>(client.followUpNotes || "");
	const [followUpNeeded, setFollowUpNeeded] = useState<boolean>(client.followUpNeeded || false);
	const [followUpDate, setFollowUpDate] = useState<Date | undefined>(
		client.followUpDate ? new Date(client.followUpDate) : new Date()
	);

	const [action, setAction] = useState<"save" | "cancel" | "dismiss" | null>(null);

	const setDefaults = () => {
		setPhone(user.phone || "");
		setIsReentryClient(client.isReentryClient || false);
		setFollowUpNotes(client.followUpNotes || "");
		setFollowUpNeeded(client.followUpNeeded || false);
		setFollowUpDate(client.followUpDate ? new Date(client.followUpDate) : new Date());
	};

	const handleCancel = () => {
		setAction("cancel");
		setIsOpen(false);
		setDefaults();
	};

	const handleSave = async () => {
		setAction("save");
		setIsOpen(false);

		const clientUpdate = {
			user: {
				phone: phone,
			},
			client: {
				isReentryClient: isReentryClient,
				followUpNotes: followUpNotes,
				followUpNeeded: followUpNeeded,
				followUpDate: followUpDate ? new Date(followUpDate) : null,
			},
		} as ClientUpdate;

		const action = updateClientDetails.bind(null, client.id);
		const actionData = await action(clientUpdate);
		if (actionData) actionToast({ actionData });
		if (reentryUpdateCallback) {
			reentryUpdateCallback(isReentryClient);
		}
	};

	const handleOpenChange = (open: boolean) => {
		// When dialog closes without clicking Save or Cancel
		if (!open && action === null) {
			setAction("dismiss"); // clicking outside or pressing ESC
		}
		setIsOpen(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>Edit Coach Details</DialogTitle>
				</DialogHeader>
				<div className="my-4 flex flex-col gap-2">
					<p className="w-full text-muted-foreground text-sm">
						A coach&apos;s email and name are managed through their user account. If they want to change it
						let them know to click their profile icon in the top right and go to &quot;Manage Account&quot;.
					</p>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Phone</Label>
						<PhoneInput
							country="US"
							value={phone}
							onChange={(value) => setPhone(value ?? "")}
							className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Re-entry Client</Label>
						<input
							type="checkbox"
							checked={isReentryClient}
							onChange={(e) => setIsReentryClient(e.target.checked)}
							className="h-6 w-6 rounded border border-input bg-transparent checked:bg-primary checked:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Follow-up Needed</Label>
						<input
							type="checkbox"
							checked={followUpNeeded}
							onChange={(e) => setFollowUpNeeded(e.target.checked)}
							className="h-6 w-6 rounded border border-input bg-transparent checked:bg-primary checked:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Follow-up Date</Label>
						<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
							<PopoverTrigger asChild>
								<Button variant="outline" id="date" className="w-48 justify-between font-normal">
									{followUpDate ? followUpDate.toLocaleDateString() : "Select date"}
									<ChevronDownIcon />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto overflow-hidden p-0" align="start">
								<Calendar
									mode="single"
									selected={followUpDate}
									captionLayout="dropdown"
									onSelect={(newDate) => {
										setFollowUpDate(newDate);
										setCalendarOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<div className="mb-4">
					<Textarea
						className="min-h-20 resize-none"
						placeholder="Optional notes"
						value={followUpNotes}
						onChange={(e) => setFollowUpNotes(e.target.value)}
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
