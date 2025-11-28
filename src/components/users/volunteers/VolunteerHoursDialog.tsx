"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { ClientCombobox } from "./ClientCombobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { actionToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { VolunteerHours } from "@/userInteractions/db";
import { VolunteerType } from "@/tableInteractions/db";
import { insertVolunteerHours, updateVolunteerHours } from "@/userInteractions/actions";
import { ClientCombobox } from "../clients/ClientCombobox";

// import { Service } from "@/tableInteractions/db";

export default function VolunteerHoursDialog({
	volunteerId,
	volunteerTypes,
	values,
	children,
}: {
	volunteerId?: string;
	volunteerTypes: VolunteerType[] | undefined;
	values?: VolunteerHours;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [calendarOpen, setCalendarOpen] = useState(false);
	const [volunteeringTypeId, setVolunteeringTypeId] = useState<string | null>(values?.volunteeringTypeId || null);
	const [hours, setHours] = useState(values?.hours ?? "");
	const [date, setDate] = useState<Date | undefined>(values?.date ? new Date(values.date) : new Date());
	const [notes, setNotes] = useState(values?.notes ?? "");

	const [action, setAction] = useState<"save" | "cancel" | "dismiss" | null>(null);

	const resetAll = () => {
		setHours(values?.hours ?? "");
		setDate(values?.date ? new Date(values.date) : undefined);
		setNotes(values?.notes ?? "");
		setVolunteeringTypeId(values?.volunteeringTypeId || null);
	};

	const handleCancel = () => {
		setAction("cancel");
		setIsOpen(false);
		resetAll();
	};

	const handleSave = async () => {
		if (hours === "" || !date || !volunteeringTypeId) {
			actionToast({ actionData: { error: true, message: "Please fill in all required fields." } });
			return;
		}

		setAction("save");
		setIsOpen(false);

		const loggedHours: Partial<VolunteerHours> = {
			volunteerId,
			volunteeringTypeId,
			hours,
			date,
			notes: notes?.trim() || null,
		};

		// volunteerId is present when adding new hours for a volunteer
		// values.id is present when editing existing hours
		const action = volunteerId
			? insertVolunteerHours.bind(null, volunteerId)
			: updateVolunteerHours.bind(null, values?.id ?? null);
		const actionData = await action(loggedHours);
		if (actionData) actionToast({ actionData });
		if (!actionData.error) resetAll();
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
					<DialogTitle>Log Hours</DialogTitle>
				</DialogHeader>
				<div className="my-4 flex flex-col gap-2">
					<div className="flex gap-2 items-center">
						<Label htmlFor="date" className="font-medium text-right w-[30%]">
							Date
						</Label>
						<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
							<PopoverTrigger asChild>
								<Button variant="outline" id="date" className="w-48 justify-between font-normal">
									{date ? date.toLocaleDateString() : "Select date"}
									<ChevronDownIcon />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto overflow-hidden p-0" align="start">
								<Calendar
									mode="single"
									selected={date}
									captionLayout="dropdown"
									onSelect={(newDate) => {
										setDate(newDate);
										setCalendarOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="flex gap-2 items-center">
						<Label htmlFor="hours" className="font-medium text-right w-[30%]">
							Hours
						</Label>
						<Input
							type="number"
							id="hours"
							className="w-48"
							value={hours}
							// only allow positive numbers and decimals with max 2 decimal places
							onChange={(e) =>
								setHours(
									e.target.value
										.replace(/[^0-9.]/g, "")
										.replace(/(\..*)\./g, "$1")
										.replace(/^(\d+)\.(\d{0,2}).*$/, "$1.$2")
								)
							}
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Requested Service</Label>
						<ClientCombobox
							label="Select Type"
							items={volunteerTypes as VolunteerType[]}
							value={volunteeringTypeId}
							onChange={setVolunteeringTypeId}
						/>
					</div>
				</div>
				<div className="mb-4">
					<Textarea
						className="min-h-20 resize-none"
						placeholder="Optional notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
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
