"use client";

import { ReactNode, useId, useOptimistic, useTransition } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { actionToast } from "@/hooks/use-toast";

type UseSortableReturn = ReturnType<typeof useSortable>;

export default function SortableList<T extends { id: string }>({
	items,
	onOrderChange,
	children,
}: {
	items: T[];
	onOrderChange: (newOrder: string[]) => Promise<{ error: boolean; message: string }>;
	children: (items: T[]) => ReactNode;
}) {
	const dndContextId = useId();
	const [optimisticItems, setOptimisticItems] = useOptimistic(items);
	const [, startTransition] = useTransition();

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const newItems = arrayMove(
			optimisticItems,
			optimisticItems.findIndex((i) => i.id === active.id),
			optimisticItems.findIndex((i) => i.id === over.id)
		);

		startTransition(async () => {
			setOptimisticItems(newItems);
			const actionData = await onOrderChange(newItems.map((s) => s.id));
			actionToast({ actionData });
		});
	}

	return (
		<DndContext id={dndContextId} onDragEnd={handleDragEnd}>
			<SortableContext items={optimisticItems} strategy={verticalListSortingStrategy}>
				<div className="flex flex-col w-full">{children(optimisticItems)}</div>
			</SortableContext>
		</DndContext>
	);
}

export function SortableItem({
	id,
	children,
	className,
}: {
	id: string;
	children: (props: {
		attributes: UseSortableReturn["attributes"];
		listeners: UseSortableReturn["listeners"];
	}) => ReactNode;
	className?: string;
}) {
	const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({ id });

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn("flex items-center rounded-md", isDragging && "z-10 border shadow-md", className)}
		>
			{children({ attributes, listeners })}
		</div>
	);
}
