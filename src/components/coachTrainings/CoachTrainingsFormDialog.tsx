"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CoachTrainingsForm from "./CoachTrainingsForm";

export default function CoachTrainingsFormDialog({
	coachTraining,
	children,
}: {
	coachTraining?: { id: string; name: string; description: string | null };
	children: ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{children}
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{coachTraining ? "Edit Coach Training" : "Add New Coach Training"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<CoachTrainingsForm coachTraining={coachTraining} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
