"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from "./UserForm";
import { User } from "@/types";
import { Client } from "@/userInteractions/db";
import { userSchema } from "@/userInteractions/schema";
import { z } from "zod";

export default function UserFormDialog({
	user,
	client,
	reentryUpdateCallback,
	children,
}: {
	user?: User;
	client?: Client;
	reentryUpdateCallback?: (checked: boolean) => void;
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const values =
		user && client
			? {
					id: user.id,
					isClerkUser: !!user.clerkUserId,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
					email: user.email,
					phone: user.phone,
					address1: user.address1,
					address2: user.address2,
					city: user.city,
					state: user.state,
					zip: user.zip,
					birthMonth: user.birthMonth,
					birthDay: user.birthDay,
					followUpNeeded: client.followUpNeeded,
					followUpNotes: client.followUpNotes,
					followUpDate: client.followUpDate,
					isReentryClient: client.isReentryClient,
			  }
			: null;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>{values ? "Edit Client or Volunteer" : "Add a Client or Volunteer"}</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid gap-4">
					<UserForm
						user={values as z.infer<typeof userSchema> & { id: string } & { isClerkUser: boolean }}
						onSuccess={() => setIsOpen(false)}
						reentryUpdateCallback={reentryUpdateCallback}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
