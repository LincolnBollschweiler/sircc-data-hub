"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coach } from "@/userInteractions/db";
import { User } from "@/types";
import GenUserUpdateForm from "./CoachUpdateForm";
import { z } from "zod";
import { coachSchema } from "@/userInteractions/schema";

export default function EditCoachDialog({ user, coach, children }: { user: User; coach: Coach; children: ReactNode }) {
	const mergedUser = {
		...user,
		...coach,
		id: user.id,
	};

	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>Edit Coach Details</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<GenUserUpdateForm
						user={mergedUser as z.infer<typeof coachSchema> & { id: string }}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
