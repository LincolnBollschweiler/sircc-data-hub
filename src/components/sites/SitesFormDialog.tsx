"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import SitesForm from "./SitesForm";
import { siteSchema } from "@/tableInteractions/schemas";
import z from "zod";

export default function SitesFormDialog({
	site,
	children,
}: {
	site?: z.infer<typeof siteSchema> & { id: string };
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
				<div className="mt-4 grid gap-4">
					<SitesForm site={site} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
