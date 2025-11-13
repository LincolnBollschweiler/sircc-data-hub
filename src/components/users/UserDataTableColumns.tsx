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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUser } from "./actions";
import { actionToast } from "@/hooks/use-toast";
import { DialogTrigger } from "../ui/dialog";
import AssignRoleFormDialog from "./assignRole/AssignRoleFormDialog";

const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

const processAcceptance = async (user: Partial<User>, accepted: boolean | null) => {
	const action = user.id ? updateUser.bind(null, user.id) : undefined;
	if (!action) return;
	const actionData = await action({ ...user, accepted });
	if (actionData) actionToast({ actionData });
	if (!actionData?.error) requestAnimationFrame(() => window.location.reload());
};

export const userDataTableColumns = (userType: string): ColumnDef<Partial<User>>[] => {
	if (userType === "rejected" || userType === "applicant")
		return [
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
								<Button
									variant="ghost"
									className="text-left p-0 px-1 h-auto whitespace-nowrap text-ellipsis"
								>
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
								{userType !== "rejected" && (
									<DropdownMenuItem asChild>
										<a href={`mailto:${user.email}`}>Send Email</a>
									</DropdownMenuItem>
								)}
								{userType === "rejected" && (
									<DropdownMenuItem onClick={() => processAcceptance(user, null)}>
										Undecided Applicant
									</DropdownMenuItem>
								)}
								{userType !== "rejected" && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<AssignRoleFormDialog profile={user as User}>
												<DialogTrigger className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 hover:!bg-green-600">
													Assign Role & Accept
												</DialogTrigger>
											</AssignRoleFormDialog>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="hover:!bg-red-500"
											onClick={() => processAcceptance(user, false)}
										>
											Reject
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		];

	if (userType === "client" || userType === "client-volunteer")
		return [
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
								<Button
									variant="ghost"
									className="text-left p-0 px-1 h-auto whitespace-nowrap text-ellipsis"
								>
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

	if (userType === "volunteer" || userType === "client-volunteer")
		return [
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
								<Button
									variant="ghost"
									className="text-left p-0 px-1 h-auto whitespace-nowrap text-ellipsis"
								>
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

	if (userType === "coach")
		return [
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
								<Button
									variant="ghost"
									className="text-left p-0 px-1 h-auto whitespace-nowrap text-ellipsis"
								>
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

	if (userType === "admin")
		return [
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
								<Button
									variant="ghost"
									className="text-left p-0 px-1 h-auto whitespace-nowrap text-ellipsis"
								>
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

	// should never happen but needed for TS
	return [];
};
