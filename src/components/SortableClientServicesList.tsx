"use client";

import SortableList, { SortableItem } from "./SortableList";
import Link from "next/link";
import { Button } from "./ui/button";
import { FilePenLineIcon, Trash2Icon, GripVerticalIcon } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { removeClientService, updateOrders } from "@/tableInteractions/actions";

export function SortableClientServicesList({
	items,
}: {
	items: {
		id: string;
		name: string;
		description: string | null;
		dispersesFunds: boolean | null;
		createdAt: Date;
		updatedAt: Date;
	}[];
}) {
	const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

	return (
		<SortableList items={items} onOrderChange={updateOrders}>
			{(sorted) =>
				sorted.map((item) => (
					<SortableItem key={item.id} id={item.id}>
						{({ attributes, listeners }) => (
							<div className="grid grid-cols-[40px,27%,32%,7%,8%,8%,18%] items-center gap-3 px-3 py-2 border-b border-gray-200 bg-white">
								{/* handle column */}
								<div className="flex justify-center" {...attributes} {...listeners}>
									<GripVerticalIcon className="text-muted-foreground cursor-grab w-5 h-5" />
								</div>

								{/* content columns */}
								<div>{item.name}</div>
								<div className="truncate">{item.description}</div>
								<div>{item.dispersesFunds ? "Yes" : "No"}</div>
								<div>{new Date(item.createdAt).toLocaleDateString("en-US", dateOptions)}</div>
								<div>{new Date(item.updatedAt).toLocaleDateString("en-US", dateOptions)}</div>

								{/* actions column */}
								<div className="flex justify-end gap-2">
									<Button asChild>
										<Link href={`/admin/data-types/client-services/${item.id}/edit`}>
											<FilePenLineIcon className="w-4 h-4" />
											<span className="sr-only">Edit</span>
										</Link>
									</Button>
									<ActionButton
										variant="destructiveOutline"
										action={removeClientService.bind(null, item.id)}
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
