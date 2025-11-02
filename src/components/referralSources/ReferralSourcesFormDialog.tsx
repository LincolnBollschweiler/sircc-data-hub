"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ReferralSourcesForm from "./ReferralSourcesForm";

export default function ReferralSourcesFormDialog({
	referralSource,
	children,
}: {
	referralSource?: { id: string; name: string; description: string | null };
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{referralSource ? "Edit Referral Source" : "Add New Referral Source"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<ReferralSourcesForm referralSource={referralSource} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
