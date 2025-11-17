"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import ServiceForm from "./ServiceForm";
import { z } from "zod";
import { servicesSchema, updateSchema } from "../../../tableInteractions/schemas";
export default function ServiceFormDialog({
	clientService,
	children,
}: {
	clientService?: z.infer<typeof servicesSchema> & z.infer<typeof updateSchema>;

	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{clientService ? "Edit Client Service" : "Add New Client Service"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<ServiceForm clientService={clientService} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
