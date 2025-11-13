"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import ClientServiceForm from "./ClientServiceForm";
import { z } from "zod";
import { clientServiceSchema, updateSchema } from "../../../tableInteractions/schemas";
export default function ClientServiceFormDialog({
	clientService,
	children,
}: {
	clientService?: z.infer<typeof clientServiceSchema> & z.infer<typeof updateSchema>;

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
					<ClientServiceForm clientService={clientService} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
