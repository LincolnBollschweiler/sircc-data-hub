"use client";

import { useEffect, useState } from "react";
import { actionToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { findDuplicates } from "../duplicate/duplicates";
import { mergeRoles } from "../duplicate/mergeRoles";
import { mergeUsersAction } from "@/userInteractions/actions";
import { DuplicateReviewDialog } from "../duplicate/DuplicateReviewDialog";

interface MergeUsersDialogProps {
	user: User;
	open: boolean;
	onClose: () => void;
}

export default function MergeUsersDialog({ user, open, onClose }: MergeUsersDialogProps) {
	const [duplicates, setDuplicates] = useState<User[] | null>(null);

	const onLocalClose = () => {
		setDuplicates(null);
		onClose();
	};

	const mergeUsers = async (duplicateUser: User, pendingUser: User) => {
		if (duplicateUser.role.includes("developer") || pendingUser.role.includes("developer")) {
			actionToast({
				actionData: { error: true, message: `Not allowed: trying to merge with an existing developer.` },
			});
			onLocalClose();
			return;
		}

		if (duplicateUser.clerkUserId && pendingUser.clerkUserId) {
			actionToast({
				actionData: { error: true, message: `Not allowed: both users have site login accounts.` },
			});
			onLocalClose();
			return;
		}

		if (duplicateUser.clerkUserId && !pendingUser.clerkUserId) {
			const tempUser: User = { ...pendingUser };
			pendingUser = { ...duplicateUser };
			duplicateUser = { ...tempUser };
		}

		const disallowedMerges = {
			client: {
				roles: ["admin", "coach"],
				message: "Clients cannot be merged with Admin or Coach accounts.",
			},
			staff: {
				roles: ["admin"],
				message: "Staff cannot be merged with Admin accounts.",
			},
		};

		function isMergeDisallowed(from: User, to: User) {
			const disallowed = disallowedMerges[from.role as keyof typeof disallowedMerges];
			return disallowed?.roles.some((role) => to.role.includes(role)) ? disallowed.message : null;
		}

		const message = isMergeDisallowed(pendingUser, duplicateUser) || isMergeDisallowed(duplicateUser, pendingUser);
		if (message) {
			actionToast({ actionData: { error: true, message } });
			onLocalClose();
			return;
		}

		if (!pendingUser.phone && duplicateUser.phone) pendingUser.phone = duplicateUser.phone;
		if (!pendingUser.address1 && duplicateUser.address1) pendingUser.address1 = duplicateUser.address1;
		if (!pendingUser.address2 && duplicateUser.address2) pendingUser.address2 = duplicateUser.address2;
		if (!pendingUser.city && duplicateUser.city) pendingUser.city = duplicateUser.city;
		if (!pendingUser.state && duplicateUser.state) pendingUser.state = duplicateUser.state;
		if (!pendingUser.zip && duplicateUser.zip) pendingUser.zip = duplicateUser.zip;
		if (!pendingUser.birthMonth && duplicateUser.birthMonth) pendingUser.birthMonth = duplicateUser.birthMonth;
		if (!pendingUser.birthDay && duplicateUser.birthDay) pendingUser.birthDay = duplicateUser.birthDay;

		pendingUser.notes = [pendingUser.notes, duplicateUser.notes].filter(Boolean).join("\n");
		pendingUser.role = mergeRoles(duplicateUser.role, pendingUser.role!) as User["role"];

		const action = mergeUsersAction.bind(null, duplicateUser, pendingUser);
		const actionData = await action();

		if (actionData) actionToast({ actionData });
		onLocalClose();
	};

	useEffect(() => {
		if (!open) return;
		const queryForDuplicates = async () => {
			const dups = await findDuplicates(user as User);
			if (dups.length) {
				setDuplicates(dups);
			} else {
				actionToast({
					actionData: { error: true, message: `No duplicate records found to merge.` },
				});
				onClose();
			}
		};
		queryForDuplicates();
	}, [open, user, onClose]);

	if (!open || !duplicates?.length) return null;

	return (
		<DuplicateReviewDialog
			open={open}
			duplicates={duplicates}
			pendingValues={user}
			onCancel={onLocalClose}
			onMerge={mergeUsers}
			onCreateNew={onLocalClose}
			cannotAddNew={true}
		/>
	);
}
