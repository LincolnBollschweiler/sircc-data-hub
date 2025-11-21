"use client";

import SortableList, { SortableItem } from "../../SortableList";
import { Button } from "../../ui/button";
import { FilePenLineIcon, Trash2Icon, GripVerticalIcon } from "lucide-react";
import { ActionButton } from "../../ActionButton";
import { removeTraining, updateTrainingOrders } from "@/tableInteractions/actions";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import TrainingsFormDialog from "./TrainingsFormDialog";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import { z } from "zod";

export function SortableTrainingsList({
	items,
}: {
	items: (z.infer<typeof generalSchema> & z.infer<typeof updateSchema>)[];
}) {
	const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

	return (
		<SortableList items={items} onOrderChange={updateTrainingOrders}>
			{(sorted) =>
				sorted.map((item, index) => (
					<SortableItem key={item.id} id={item.id}>
						{({ attributes, listeners }) => (
							<div
								className={cn(
									index % 2 === 0 ? "bg-background-light" : "bg-background",
									"w-full grid grid-cols-[30%,38%,9%,9%,14%] data-types-row"
								)}
							>
								{/* content columns */}
								<div className="flex items-center cursor-grab px-1 pt-2" {...attributes} {...listeners}>
									<GripVerticalIcon className="text-muted-foreground w-5 h-5" />
									<div>{item.name}</div>
								</div>
								<div className="px-1 pt-2">{item.description}</div>
								<div className="text-center pt-2">
									{new Date(item.createdAt).toLocaleDateString("en-US", dateOptions)}
								</div>
								<div className="text-center pt-2">
									{new Date(item.updatedAt).toLocaleDateString("en-US", dateOptions)}
								</div>

								{/* actions column */}
								<div className="flex justify-end gap-2">
									<TrainingsFormDialog coachTraining={item}>
										<DialogTrigger asChild>
											<Button>
												<FilePenLineIcon className="w-4 h-4" />
												<span className="sr-only">Edit</span>
											</Button>
										</DialogTrigger>
									</TrainingsFormDialog>
									<ActionButton
										variant="destructiveOutline"
										action={removeTraining.bind(null, item.id)}
										requireAreYouSure
									>
										<Trash2Icon className="w-4 h-4" />
										<span className="sr-only">Delete</span>
									</ActionButton>
								</div>
							</div>
						)}
					</SortableItem>
				))
			}
		</SortableList>
	);
}
