"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { userSchema } from "@/userInteractions/schema";
import { User, Site } from "@/drizzle/types";
import ProfileForm from "./ProfileForm";

export default function ProfileFormDialog({
	profile,
	sites,
	children,
}: {
	// profile: z.infer<typeof userSchema> & { id: string };
	profile: User;
	sites: Site[];
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
						profile={profile as z.infer<typeof userSchema> & { id: string }}
						sites={sites}
						onSuccess={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
