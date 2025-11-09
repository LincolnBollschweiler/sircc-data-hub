"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ReferralSourcesForm from "./ReferralSourcesForm";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import z from "zod";

export default function ReferralSourcesFormDialog({
	referralSource,
	children,
}: {
	referralSource?: z.infer<typeof generalSchema> & z.infer<typeof updateSchema>;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{referralSource ? "Edit Referral Source" : "Add New Referral Source"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<ReferralSourcesForm referralSource={referralSource} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
