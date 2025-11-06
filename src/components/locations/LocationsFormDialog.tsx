"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import LocationsForm from "./LocationsForm";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import z from "zod";

export default function LocationsFormDialog({
	location,
	children,
}: {
	location?: z.infer<typeof generalSchema> & z.infer<typeof updateSchema>;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{location ? "Edit Location" : "Add New Location"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<LocationsForm location={location} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
