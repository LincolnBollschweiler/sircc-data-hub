"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { actionToast } from "@/hooks/use-toast";
import { deleteClientService } from "@/userInteractions/actions";

export function useDeleteClientService() {
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

	const startDelete = (id: string) => setPendingDeleteId(id);
	const cancelDelete = () => setPendingDeleteId(null);

	const confirmDelete = async () => {
		if (!pendingDeleteId) return;

		const action = deleteClientService.bind(null, pendingDeleteId);
		const actionData = await action();

		if (actionData) actionToast({ actionData });

		setPendingDeleteId(null);

		if (!actionData?.error) {
			requestAnimationFrame(() => window.location.reload());
		}
	};

	const dialog = (
		<AlertDialog open={!!pendingDeleteId} onOpenChange={(v) => !v && cancelDelete()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this service?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. The service will be permanently removed.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={confirmDelete}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);

	return { startDelete, dialog };
}
