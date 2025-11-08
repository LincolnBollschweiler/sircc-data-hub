"use client";

import { User } from "@/drizzle/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatPhoneNumber } from "react-phone-number-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

export const clientColumns: ColumnDef<Partial<User>>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: (info) => `${info.row.original.firstName} ${info.row.original.lastName}`,
	},
	{
		accessorKey: "phone",
		header: "Phone",
		cell: (info) => {
			const phone = formatPhoneNumber(info.getValue<string>() || "");
			return phone || "N/A";
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "notes",
		header: "Notes",
		cell: ({ getValue }) => {
			const notes = getValue<string>() || "";
			const truncated = notes.length > 30 ? `${notes.slice(0, 30)}…` : notes;

			return (
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" className="text-left p-0 px-1 h-auto whitespace-nowrap text-ellipsis">
							{truncated}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="max-w-sm">
						<p className="whitespace-pre-wrap">{notes}</p>
					</PopoverContent>
				</Popover>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Added",
		cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
	},
];
