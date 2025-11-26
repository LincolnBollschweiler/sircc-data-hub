"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { ClientCombobox } from "./ClientCombobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCoachDetails } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { Coach, CoachUpdate } from "@/userInteractions/db";
import { User } from "@/types";
import PhoneInput from "react-phone-number-input/input";
import { Input } from "@/components/ui/input";

// import { Service } from "@/tableInteractions/db";

export default function EditCoachDialog({ user, coach, children }: { user: User; coach: Coach; children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [website, setWebsite] = useState<string>(coach.website || "");
	const [llc, setLlc] = useState<string>(coach.llc || "");
	const [phone, setPhone] = useState<string>(user.phone || "");
	const [notes, setNotes] = useState<string>(coach.notes || "");
	const [address1, setAddress1] = useState<string>(user.address1 || "");
	const [address2, setAddress2] = useState<string>(user.address2 || "");
	const [city, setCity] = useState<string>(user.city || "");
	const [state, setState] = useState<string>(user.state || "");
	const [zip, setZip] = useState<string>(user.zip || "");
	const [action, setAction] = useState<"save" | "cancel" | "dismiss" | null>(null);

	const handleCancel = () => {
		setAction("cancel");
		setIsOpen(false);
		setWebsite(coach.website || "");
		setLlc(coach.llc || "");
		setPhone(user.phone || "");
		setNotes(coach.notes || "");
		setAddress1(user.address1 || "");
		setAddress2(user.address2 || "");
		setCity(user.city || "");
		setState(user.state || "");
		setZip(user.zip || "");
	};

	const handleSave = async () => {
		if (state && state.length > 2) {
			alert("Please enter the 2-letter state abbreviation.");
			return;
		}

		setAction("save");
		setIsOpen(false);

		const coachUpdate = {
			user: {
				phone: phone,
				address1: address1,
				address2: address2,
				city: city,
				state: state,
				zip: zip,
			},
			coach: {
				website: website,
				llc: llc,
				notes: notes,
			},
		} as CoachUpdate;

		const action = updateCoachDetails.bind(null, coach.id);
		const actionData = await action(coachUpdate);
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
					<DialogTitle>Edit Coach Details</DialogTitle>
				</DialogHeader>
				<div className="my-4 flex flex-col gap-2">
					<p className="w-full text-muted-foreground text-sm">
						{`${user.firstName}'s email and name are managed through their user account. If they want to change it
						let them know to click their profile icon in the top right and go to &quot;Manage Account&quot;.`}
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
					<div className="flex flex-col w-full">
						<div className="flex gap-2 items-center">
							<Label className="font-medium text-right w-[30%]">Address</Label>
							<Input
								type="text"
								placeholder="Address Line 1"
								value={address1}
								onChange={(e) => setAddress1(e.target.value)}
								className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mb-1"
							/>
						</div>
						<div className="flex gap-2 items-center">
							<Label className="font-medium text-right w-[30%]"></Label>
							<Input
								type="text"
								placeholder="Address Line 2"
								value={address2}
								onChange={(e) => setAddress2(e.target.value)}
								className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mb-1"
							/>
						</div>
						<div className="flex gap-2 items-center">
							<Label className="font-medium text-right w-[30%]"></Label>
							<Input
								type="text"
								placeholder="City"
								value={city}
								onChange={(e) => setCity(e.target.value)}
								className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
							/>
						</div>
						<div className="flex gap-2 items-center mt-1">
							<Label className="font-medium text-right w-[30%]"></Label>
							<Input
								type="text"
								placeholder="State"
								value={state}
								onChange={(e) => setState(e.target.value)}
								className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mr-2"
							/>
						</div>
						<div className="flex gap-2 items-center mt-1">
							<Label className="font-medium text-right w-[30%]"></Label>
							<Input
								type="text"
								placeholder="Zip Code"
								value={zip}
								onChange={(e) => setZip(e.target.value)}
								className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mr-2"
							/>
						</div>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">LLC</Label>
						<Input
							type="text"
							value={llc}
							onChange={(e) => setLlc(e.target.value)}
							className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
						/>
					</div>
					<div className="flex gap-2 items-center">
						<Label className="font-medium text-right w-[30%]">Website</Label>
						<Input
							type="text"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
							className="flex h-9 w-[70%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
