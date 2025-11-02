"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ClientServiceForm from "./ClientServiceForm";

export default function ClientServiceFormDialog({
	clientService,
	children,
}: {
	clientService?: {
		id: string;
		name: string;
		description: string | null;
		dispersesFunds: boolean | null;
		createdAt: Date;
		updatedAt: Date;
	};
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{clientService ? "Edit Client Service" : "Add New Client Service"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<ClientServiceForm clientService={clientService} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
