"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import ContactUpdateForm from "./ContactUpdateForm";
import { contactSchema } from "@/contactInteractions/schema";
import { Contact } from "@/types";

export default function ContactUpdateDialog({ contact, children }: { contact?: Contact; children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{`${contact ? "Edit" : "Add"} Contact Details`}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<ContactUpdateForm
						contact={contact as z.infer<typeof contactSchema> & { id: string }}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
