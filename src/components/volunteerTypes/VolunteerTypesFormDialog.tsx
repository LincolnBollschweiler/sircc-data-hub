"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import VolunteerTypesForm from "./VolunteerTypesForm";

export default function VolunteerTypesFormDialog({
	volunteerType,
	children,
}: {
	volunteerType?: { id: string; name: string; description: string | null };
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{volunteerType ? "Edit Volunteer Type" : "Add New Volunteer Type"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<VolunteerTypesForm volunteerType={volunteerType} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
