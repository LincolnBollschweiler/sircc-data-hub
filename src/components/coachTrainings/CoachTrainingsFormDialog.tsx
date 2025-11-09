"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import CoachTrainingsForm from "./CoachTrainingsForm";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import z from "zod";

export default function CoachTrainingsFormDialog({
	coachTraining,
	children,
}: {
	coachTraining?: z.infer<typeof generalSchema> & z.infer<typeof updateSchema>;
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
				<div className="mt-4 grid gap-4">
					<CoachTrainingsForm coachTraining={coachTraining} onSuccess={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
