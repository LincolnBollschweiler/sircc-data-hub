"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types";
import { z } from "zod";
import { adminSchema } from "@/userInteractions/schema";
import AdminUpdateForm from "./AdminUpdateForm";

export default function AdminUpdateDialog({ user, children }: { user?: User; children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{user ? "Edit Admin Details" : "Add Admin Role to Existing User"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<AdminUpdateForm
						user={user as z.infer<typeof adminSchema> & { id: string }}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
