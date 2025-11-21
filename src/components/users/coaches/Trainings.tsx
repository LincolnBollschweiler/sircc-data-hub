"use client";

import { useEffect, useRef, useState } from "react";
import BigIconCheckbox from "@/components/BigIconCheckbox";
import { actionToast } from "@/hooks/use-toast";
import { CoachTrainings } from "@/userInteractions/db";
import { Trainings as TrainingsType } from "@/tableInteractions/db";
import { insertCoachTraining, removeCoachTraining } from "@/userInteractions/actions";

export default function Trainings({
	coachId,
	trainingsForCoach,
	trainings,
	isCoachView,
}: {
	coachId: string;
	trainingsForCoach: CoachTrainings;
	trainings: TrainingsType;
	isCoachView?: boolean;
}) {
	// Local state
	const [checkedItems, setCheckedItems] = useState(trainingsForCoach.map((item) => item.trainingId));

	// Debounce timer reference
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	// Store pending operations to run after debounce
	const pendingOps = useRef<{ itemId: string; adding: boolean } | null>(null);

	// Debounced DB sync effect
	useEffect(() => {
		if (!pendingOps.current || isCoachView) return;

		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(async () => {
			const { itemId, adding } = pendingOps.current!;
			const action = adding ? insertCoachTraining : removeCoachTraining;

			const actionData = await action(coachId, itemId);
			if (actionData) actionToast({ actionData });

			pendingOps.current = null;
		}, 500);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [checkedItems, coachId, isCoachView]);

	// Handle UI toggle instantly
	const handleCheckboxChange = (itemId: string) => {
		if (isCoachView) return;
		const adding = !checkedItems.includes(itemId);

		setCheckedItems((prev) => (adding ? [...prev, itemId] : prev.filter((id) => id !== itemId)));

		// Queue operation for debounce
		pendingOps.current = { itemId, adding };
	};

	// Measure longest label width — ensures equal-width grid cells
	const [maxWidth, setMaxWidth] = useState(0);
	const measureRefs = useRef<Record<string, HTMLSpanElement | null>>({});

	useEffect(() => {
		const widths = Object.values(measureRefs.current)
			.filter(Boolean)
			.map((el) => el!.offsetWidth);

		if (widths.length) {
			setMaxWidth(Math.max(...widths) + 50); // +50 to accommodate checkbox
		}
	}, [trainings]);

	return (
		<div className="container p-2.5 border rounded-lg shadow-md mb-6 bg-background-light">
			<div className="font-semibold text-xl">Trainings</div>
			<div
				className="grid justify-center gap-x-2 gap-y-0 mx-auto"
				style={{
					gridTemplateColumns: `repeat(auto-fit, minmax(${maxWidth}px, auto))`,
				}}
			>
				{trainings.map((item) => {
					const isChecked = checkedItems.includes(item.id);

					return (
						<div key={item.id} className="flex items-center gap-1 justify-start">
							<BigIconCheckbox
								checked={isChecked}
								onChange={() => handleCheckboxChange(item.id)}
								noHover={isCoachView}
							/>
							<span
								ref={(el) => {
									measureRefs.current[item.id] = el;
								}}
							>
								{item.name}
							</span>{" "}
						</div>
					);
				})}
			</div>
		</div>
	);
}
