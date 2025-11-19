"use client";

import { useEffect, useRef, useState } from "react";
import BigIconCheckbox from "@/components/BigIconCheckbox";
import { actionToast } from "@/hooks/use-toast";
import { addClientChecklistItem, deleteClientChecklistItem } from "@/userInteractions/actions";
import { ClientReentryCheckListItem } from "@/userInteractions/db";
import { ReentryChecklistItems } from "@/tableInteractions/db";

export default function ReentryCheckList({
	clientId,
	clientCheckListItems,
	checkListItems,
	isClientView,
}: {
	clientId: string;
	clientCheckListItems: ClientReentryCheckListItem[];
	checkListItems: ReentryChecklistItems;
	isClientView?: boolean;
}) {
	// Local state
	const [checkedItems, setCheckedItems] = useState(clientCheckListItems.map((item) => item.reentryCheckListItemId));

	// Debounce timer reference
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	// Store pending operations to run after debounce
	const pendingOps = useRef<{ itemId: string; adding: boolean } | null>(null);

	// Debounced DB sync effect
	useEffect(() => {
		if (!pendingOps.current || isClientView) return;

		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(async () => {
			const { itemId, adding } = pendingOps.current!;
			const action = adding ? addClientChecklistItem : deleteClientChecklistItem;

			const actionData = await action(clientId, itemId);
			if (actionData) actionToast({ actionData });

			pendingOps.current = null;
		}, 500);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [checkedItems, clientId, isClientView]);

	// Handle UI toggle instantly
	const handleCheckboxChange = (itemId: string) => {
		if (isClientView) return;
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
	}, [checkListItems]);

	return (
		<div className="container border py-1 rounded-lg shadow-md mb-6 bg-background-light">
			{isClientView && <h2 className="font-semibold mb-2 mt-1">Your Re-entry Checklist</h2>}
			<div
				className="grid justify-center gap-x-2 gap-y-0 mx-auto"
				style={{
					gridTemplateColumns: `repeat(auto-fit, minmax(${maxWidth}px, auto))`,
				}}
			>
				{checkListItems.map((item) => {
					const isChecked = checkedItems.includes(item.id);

					return (
						<div key={item.id} className="flex items-center gap-1 justify-start">
							<BigIconCheckbox
								checked={isChecked}
								onChange={() => handleCheckboxChange(item.id)}
								noHover={isClientView}
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
