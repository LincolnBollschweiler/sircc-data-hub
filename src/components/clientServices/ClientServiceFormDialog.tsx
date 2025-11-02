"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import ClientServiceForm from "./ClientServiceForm";
import { getCachedClientService } from "@/tableInteractions/db";

export default async function ClientServiceFormDialog({
	clientServiceId,
	children,
}: {
	clientServiceId: string;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const clientService = await getCachedClientService(clientServiceId);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Client Service</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<ClientServiceForm clientService={clientService} onSuccess={() => setIsOpen(false)} />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
