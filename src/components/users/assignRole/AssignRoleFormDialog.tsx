"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { assignRoleSchema } from "@/userInteractions/schema";
import { User } from "@/types";
import AssignRoleForm from "./AssignRoleForm";

export default function AssignRoleFormDialog({ profile, children }: { profile: User; children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{"Assign Role & Accept"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<AssignRoleForm
						profile={profile as z.infer<typeof assignRoleSchema> & { id: string }}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
