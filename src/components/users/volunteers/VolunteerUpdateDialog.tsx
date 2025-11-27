"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types";
import VolunteerUpdateForm from "./VolunteerUpdateForm";
import { z } from "zod";
import { volunteerSchema } from "@/userInteractions/schema";

export default function VolunteerUpdateDialog({ user, children }: { user?: User; children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const userWithClerkFlag = { ...user, isClerkUser: !!user?.clerkUserId };

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{`${user ? "Edit" : "Add"} Volunteer Details`}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<VolunteerUpdateForm
						user={
							userWithClerkFlag as z.infer<typeof volunteerSchema> & { id: string } & {
								isClerkUser?: boolean;
							}
						}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
