"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { actionToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { CoachMiles } from "@/userInteractions/db";
import { insertCoachMiles, updateCoachMiles } from "@/userInteractions/actions";

export default function MilesDialog({
	coachId,
	values,
	children,
}: {
	coachId?: string;
	values?: Partial<CoachMiles>;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [calendarOpen, setCalendarOpen] = useState(false);
	const [miles, setMiles] = useState(values?.miles ?? "");
	const [date, setDate] = useState<Date | undefined>(values?.date ? new Date(values.date) : new Date());
	const [notes, setNotes] = useState(values?.notes ?? "");

	const [action, setAction] = useState<"save" | "cancel" | "dismiss" | null>(null);

	const handleCancel = () => {
		setAction("cancel");
		setIsOpen(false);
		setMiles("");
		setDate(new Date());
		setNotes("");
	};

	const handleSave = async () => {
		setAction("save");
		setIsOpen(false);

		if (!coachId && !values) return;

		const loggedMiles: Partial<CoachMiles> = {
			miles,
			date,
			notes,
		};

		console.log("Logged Miles:", loggedMiles);

		const action = coachId ? insertCoachMiles.bind(null, coachId) : updateCoachMiles.bind(null, values?.id ?? null);
		const actionData = await action(loggedMiles);
		if (actionData) actionToast({ actionData });
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
						<Label htmlFor="miles" className="font-medium text-right w-[30%]">
							Miles
						</Label>
						<Input
							type="number"
							id="miles"
							className="w-48"
							value={miles}
							// only allow positive numbers and decimals with max 2 decimal places
							onChange={(e) =>
								setMiles(
									e.target.value
										.replace(/[^0-9.]/g, "")
										.replace(/(\..*)\./g, "$1")
										.replace(/^(\d+)\.(\d{0,2}).*$/, "$1.$2")
								)
							}
						/>
					</div>
				</div>
				<div className="mb-4">
					<Textarea
						className="min-h-20 resize-none"
						placeholder="Optional notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value.trim())}
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
