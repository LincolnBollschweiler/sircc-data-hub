"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types";
import { z } from "zod";
import { staffSchema } from "@/userInteractions/schema";
import StaffUpdateForm from "./StaffUpdateForm";

export default function StaffUpdateDialog({ user, children }: { user?: User; children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{user ? "Edit Staff Details" : "Add Staff Role to Existing User"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<StaffUpdateForm
						user={user as z.infer<typeof staffSchema> & { id: string }}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
