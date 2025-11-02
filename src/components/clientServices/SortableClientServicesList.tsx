"use client";

import SortableList, { SortableItem } from "../SortableList";
import { Button } from "../ui/button";
import { FilePenLineIcon, Trash2Icon, GripVerticalIcon } from "lucide-react";
import { ActionButton } from "../ActionButton";
import { removeClientService, updateClientServicesOrders } from "@/tableInteractions/actions";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ClientServiceFormDialog from "./ClientServiceFormDialog";

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
		<SortableList items={items} onOrderChange={updateClientServicesOrders}>
			{(sorted) =>
				sorted.map((item, index) => (
					<SortableItem key={item.id} id={item.id}>
						{({ attributes, listeners }) => (
							<div
								className={cn(
									index % 2 === 0 ? "bg-background-light" : "bg-background-light/30",
									"w-full grid grid-cols-[24%,31%,10%,9%,9%,17%] items-start py-1 border-b border-gray-200 text-xs lg:text-base"
								)}
							>
								{/* content columns */}
								<div className="flex items-center cursor-grab px-1 pt-2" {...attributes} {...listeners}>
									<GripVerticalIcon className="text-muted-foreground w-5 h-5" />
									<div>{item.name}</div>
								</div>
								<div className="px-1 pt-2">{item.description}</div>
								<div className="text-center pt-2">{item.dispersesFunds ? "Yes" : "No"}</div>
								<div className="text-center pt-2">
									{new Date(item.createdAt).toLocaleDateString("en-US", dateOptions)}
								</div>
								<div className="text-center pt-2">
									{new Date(item.updatedAt).toLocaleDateString("en-US", dateOptions)}
								</div>
								{/* actions column */}
								<div className="flex justify-end gap-2">
									<ClientServiceFormDialog clientService={item}>
										<DialogTrigger asChild>
											<Button>
												<FilePenLineIcon className="w-4 h-4" />
												<span className="sr-only">Edit</span>
											</Button>
										</DialogTrigger>
									</ClientServiceFormDialog>
									<ActionButton
										variant="destructiveOutline"
										action={removeClientService.bind(null, item.id)}
										requireAreYouSure
										className="mr-1"
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
