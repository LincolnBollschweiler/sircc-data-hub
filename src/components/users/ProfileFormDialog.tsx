"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { z } from "zod";
import { userSchema, UserType } from "@/userInteractions/schema";
import ProfileForm from "./ProfileForm";

export default function ProfileFormDialog({
	profile,
	sites,
	children,
}: {
	profile: UserType;
	sites: {
		id: string;
		name: string;
	}[];
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="overflow-y-auto max-h-screen sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{profile ? "Edit Profile" : "Add New Profile"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
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
