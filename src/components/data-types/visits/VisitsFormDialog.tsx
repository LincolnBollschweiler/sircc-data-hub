"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import { z } from "zod";
import VisitsForm from "./VisitsForm";

export default function VisitsFormDialog({
	visit,
	children,
}: {
	visit?: z.infer<typeof generalSchema> & z.infer<typeof updateSchema>;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{visit ? "Edit Visit" : "Add New Visit"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<VisitsForm visit={visit} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
