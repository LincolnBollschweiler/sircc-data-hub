"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { clerkUserSchema } from "@/userInteractions/schema";
import { User } from "@/types";
import ProfileForm from "./ProfileForm";

export default function ProfileFormDialog({
	profile,
	children,
}: {
	// profile: z.infer<typeof userSchema> & { id: string };
	profile: User;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{profile ? "Edit Profile" : "Add New Profile"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<ProfileForm
						profile={profile as z.infer<typeof clerkUserSchema> & { id: string }}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
