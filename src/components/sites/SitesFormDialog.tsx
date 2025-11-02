"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import SitesForm from "./SitesForm";

export default function SitesFormDialog({
	site,
	children,
}: {
	site?: { id: string; name: string; address: string; phone: string };
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{site ? "Edit Site" : "Add New Site"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<SitesForm site={site} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
