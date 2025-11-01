"use client";

import SortableList, { SortableItem } from "../SortableList";
import Link from "next/link";
import { Button } from "../ui/button";
import { FilePenLineIcon, Trash2Icon, GripVerticalIcon } from "lucide-react";
import { ActionButton } from "../ActionButton";
import { removeVolunteerType, updateVolunteerTypeOrders } from "@/tableInteractions/actions";
import { cn } from "@/lib/utils";

export function SortableVolunteerTypesList({
	items,
}: {
	items: {
		id: string;
		name: string;
		description: string | null;
		createdAt: Date;
		updatedAt: Date;
	}[];
}) {
	const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

	return (
		<SortableList items={items} onOrderChange={updateVolunteerTypeOrders}>
			{(sorted) =>
				sorted.map((item, index) => (
					<SortableItem key={item.id} id={item.id}>
						{({ attributes, listeners }) => (
							<div
								className={cn(
									index % 2 === 0 ? "bg-background-light" : "bg-background-light/30",
									"w-full grid grid-cols-[30%,38%,9%,9%,14%] items-start py-1 border-b border-gray-200 text-xs lg:text-base"
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
									<Button asChild>
										<Link href={`/admin/data-types/volunteer-types/${item.id}/edit`}>
											<FilePenLineIcon className="w-4 h-4" />
											<span className="sr-only">Edit</span>
										</Link>
									</Button>
									<ActionButton
										variant="destructiveOutline"
										action={removeVolunteerType.bind(null, item.id)}
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
