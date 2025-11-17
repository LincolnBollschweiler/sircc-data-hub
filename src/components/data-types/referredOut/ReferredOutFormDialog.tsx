"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import { z } from "zod";
import ReferredOutForm from "./ReferredOutForm";

export default function ReferredOutFormDialog({
	referredOut,
	children,
}: {
	referredOut?: z.infer<typeof generalSchema> & z.infer<typeof updateSchema>;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{referredOut ? "Edit Referred Out" : "Add New Referred Out"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<ReferredOutForm referredOut={referredOut} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
