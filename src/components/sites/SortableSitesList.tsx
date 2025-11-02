"use client";

import SortableList, { SortableItem } from "../SortableList";
import { Button } from "../ui/button";
import { FilePenLineIcon, Trash2Icon, GripVerticalIcon } from "lucide-react";
import { ActionButton } from "../ActionButton";
import { cn } from "@/lib/utils";
import { removeSite, updateSiteOrders } from "@/tableInteractions/actions";
import { formatPhoneNumber } from "react-phone-number-input";
import SitesFormDialog from "./SitesFormDialog";
import { DialogTrigger } from "../ui/dialog";

export function SortableSitesList({
	items,
}: {
	items: {
		id: string;
		name: string;
		address: string;
		phone: string;
		createdAt: Date;
		updatedAt: Date;
	}[];
}) {
	const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

	return (
		<SortableList items={items} onOrderChange={updateSiteOrders}>
			{(sorted) =>
				sorted.map((item, index) => (
					<SortableItem key={item.id} id={item.id}>
						{({ attributes, listeners }) => (
							<div
								className={cn(
									index % 2 === 0 ? "bg-background-light" : "bg-background-light/30",
									"w-full grid grid-cols-[24%,36%,8%,9%,9%,14%] items-start py-1 border-b border-gray-200 text-xs lg:text-base"
								)}
							>
								{/* content columns */}
								<div className="flex items-center cursor-grab px-1 pt-2" {...attributes} {...listeners}>
									<GripVerticalIcon className="text-muted-foreground w-5 h-5" />
									<div>{item.name}</div>
								</div>
								<div className="px-1 pt-2">{item.address}</div>
								<div className="text-center px-1 pt-2">{formatPhoneNumber(item.phone)}</div>
								<div className="text-center pt-2">
									{new Date(item.createdAt).toLocaleDateString("en-US", dateOptions)}
								</div>
								<div className="text-center pt-2">
									{new Date(item.updatedAt).toLocaleDateString("en-US", dateOptions)}
								</div>

								{/* actions column */}
								<div className="flex justify-end gap-2">
									<SitesFormDialog site={item}>
										<DialogTrigger asChild>
											<Button>
												<FilePenLineIcon className="w-4 h-4" />
												<span className="sr-only">Edit</span>
											</Button>
										</DialogTrigger>
									</SitesFormDialog>
									<ActionButton
										variant="destructiveOutline"
										action={removeSite.bind(null, item.id)}
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
