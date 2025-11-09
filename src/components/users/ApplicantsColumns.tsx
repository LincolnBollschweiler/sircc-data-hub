"use client";

import { User } from "@/drizzle/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { formatPhoneNumber } from "react-phone-number-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUser } from "./actions";
import { actionToast } from "@/hooks/use-toast";

const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

const processAcceptance = async (user: Partial<User>, accepted: boolean) => {
	const action = user.id ? updateUser.bind(null, user.id) : undefined;
	if (!action) return;
	const actionData = await action({ ...user, accepted });
	if (actionData) actionToast({ actionData });
	if (!actionData?.error) requestAnimationFrame(() => window.location.reload());
};

export const applicantsColumns: ColumnDef<Partial<User>>[] = [
	{
		id: "name",
		accessorFn: (row) => `${row.firstName} ${row.lastName}`,
		header: ({ column }) => (
			<Button
				className="px-0"
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Name
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		sortingFn: (rowA, rowB) => {
			const nameA = `${rowA.original.firstName} ${rowA.original.lastName}`.toLowerCase();
			const nameB = `${rowB.original.firstName} ${rowB.original.lastName}`.toLowerCase();
			if (nameA > nameB) return 1;
			if (nameA < nameB) return -1;
			return 0;
		},
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
		accessorKey: "desiredRole",
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Desired Role
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
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
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Added
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},

		cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
	},
	{
		id: "actions",
		// header: "Actions",
		cell: ({ row }) => {
			const user = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email ?? "")}>
							Copy Email
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => processAcceptance(user, true)}>Accept</DropdownMenuItem>
						<DropdownMenuItem onClick={() => processAcceptance(user, false)}>Reject</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
