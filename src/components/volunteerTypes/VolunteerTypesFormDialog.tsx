"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import VolunteerTypesForm from "./VolunteerTypesForm";
import { generalSchema } from "@/tableInteractions/schemas";
import { z } from "zod";

export default function VolunteerTypesFormDialog({
	volunteerType,
	children,
}: {
	volunteerType?: z.infer<typeof generalSchema> & { id: string };
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{volunteerType ? "Edit Volunteer Type" : "Add New Volunteer Type"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<VolunteerTypesForm volunteerType={volunteerType} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
