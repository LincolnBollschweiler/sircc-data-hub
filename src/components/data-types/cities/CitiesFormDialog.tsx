"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import CitiesForm from "./CitiesForm";
import { z } from "zod";

export default function CitiesFormDialog({
	city,
	children,
}: {
	city?: z.infer<typeof generalSchema> & z.infer<typeof updateSchema>;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{city ? "Edit City" : "Add New City"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<CitiesForm city={city} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
