"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ReentryChecklistItemsForm from "./ReentryChecklistItemsForm";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import z from "zod";

export default function ReentryChecklistItemsFormDialog({
	reentryChecklistItem,
	children,
}: {
	reentryChecklistItem?: z.infer<typeof generalSchema> & z.infer<typeof updateSchema>;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>
						{reentryChecklistItem ? "Edit Reentry Checklist Item" : "Add Reentry Checklist Item"}
					</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<ReentryChecklistItemsForm
						reentryChecklistItem={reentryChecklistItem}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
