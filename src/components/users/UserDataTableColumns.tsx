"use client";

import { User } from "@/types";
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
import { updateUser } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { DialogTrigger } from "../ui/dialog";
import AssignRoleFormDialog from "./assignRole/AssignRoleFormDialog";
import { ClientList } from "@/userInteractions/db";

const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

// helpers.ts (or in same file)
const asClient = (row: unknown): ClientList => row as ClientList;
const asUser = (row: unknown): User => row as User;
const asUserRow = (row: unknown) => row as User;

const processAcceptance = async (user: Partial<User>, accepted: boolean | null) => {
	const action = user.id ? updateUser.bind(null, user.id) : undefined;
	if (!action) return;
	const actionData = await action({ ...user, accepted });
	if (actionData) actionToast({ actionData });
	if (!actionData?.error) requestAnimationFrame(() => window.location.reload());
};

export const userDataTableColumns = (userType: string): ColumnDef<unknown>[] => {
	if (userType === "rejected" || userType === "applicant")
		return [
			{
				id: "name",
				accessorFn: (row) => {
					const r = asUserRow(row);
					return `${r.firstName} ${r.lastName}`;
				},
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
					const rA = asUserRow(rowA.original);
					const rB = asUserRow(rowB.original);
					const nameA = `${rA.firstName} ${rA.lastName}`.toLowerCase();
					const nameB = `${rB.firstName} ${rB.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asUser(info.row.original);
					return `${r.firstName} ${r.lastName}`;
				},
			},
			{
				accessorKey: "phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const phone = formatPhoneNumber(info.getValue<string>() || "");
					return <div className="text-center">{phone || "N/A"}</div>;
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
							className="text-center w-full"
							variant="ghost"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Desired Role
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: (info) => <div className="text-center">{info.getValue<string>() || "N/A"}</div>,
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
							className="text-center w-full"
							variant="ghost"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Added
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: (info) => (
					<div className="text-center">
						{new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions)}
					</div>
				),
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const user = row.original;

					return (
						<div className="text-right">
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
											<a href={`mailto:${(user as User).email}`}>Send Email</a>
										</DropdownMenuItem>
									)}
									{userType === "rejected" && (
										<DropdownMenuItem onClick={() => processAcceptance(user as User, null)}>
											Undecided Applicant
										</DropdownMenuItem>
									)}
									{userType !== "rejected" && (
										<>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<AssignRoleFormDialog profile={user as User}>
													<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-green-600">
														Assign Role & Accept
													</DialogTrigger>
												</AssignRoleFormDialog>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="hover:!bg-red-500"
												onClick={() => processAcceptance(user as User, false)}
											>
												Reject
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];

	if (userType === "client" || userType === "client-volunteer")
		return [
			{
				accessorKey: "name",
				header: "Name",
				cell: (info) => {
					const r = asClient(info.row.original);
					return `${r.user.firstName} ${r.user.lastName}`;
				},
			},
			{
				accessorKey: "client.isReentryClient",
				header: () => <div className="text-center">Re-entry</div>,
				cell: (info) => <div className="text-center">{info.getValue<boolean>() ? "Yes" : "No"}</div>,
			},
			{
				accessorKey: "coachName",
				header: "Coach",
				cell: (info) => {
					const r = asClient(info.row.original);
					return `${r.coach?.firstName} ${r.coach?.lastName.charAt(0)}` || "N/A";
				},
			},
			{
				accessorKey: "openRequestsCount",
				header: () => <div className="text-center">Open Requests</div>,
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "serviceCount",
				header: () => <div className="text-center">Services</div>,
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "user.email",
				header: "Email",
			},
			{
				accessorKey: "user.phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const phone = formatPhoneNumber(info.getValue<string>() || "");
					return <div className="text-center">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "birthday",
				header: () => <div className="text-center">Birthday</div>,
				cell: (info) => {
					const r = asClient(info.row.original);
					if (r.user.birthMonth && r.user.birthDay) {
						return <div className="text-center">{`${r.user.birthMonth}/${r.user.birthDay}`}</div>;
					}
					return <div className="text-center">N/A</div>;
				},
			},
			{
				accessorKey: "updatedAt",
				header: "Updated",
				cell: (info) => {
					const r = asClient(info.row.original);
					if (r.requestsUpdatedAt) {
						return new Date(r.requestsUpdatedAt).toLocaleDateString("en-US", dateOptions);
					}
					if (r.client) return new Date(r.client?.updatedAt).toLocaleDateString("en-US", dateOptions);
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const clientRow = asClient(row.original); // now TypeScript knows it's ClientWithUser
					const user = clientRow.user;

					return (
						<div className="text-right">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="h-8 w-8 p-0">
										<span className="sr-only">Open menu</span>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem asChild>
										<a href={`mailto:${user.email}`}>Send Email</a>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<a href={`/admin/clients/${user.id}/edit`}>View Client</a>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];

	if (userType === "volunteer" || userType === "client-volunteer")
		return [
			{
				accessorKey: "name",
				header: "Name",
				cell: (info) => {
					const r = asUserRow(info.row.original);
					return `${r.firstName} ${r.lastName}`;
				},
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
				cell: (info) => {
					const r = asUserRow(info.row.original);
					return `${r.firstName} ${r.lastName}`;
				},
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
				cell: (info) => {
					const r = asUserRow(info.row.original);
					return `${r.firstName} ${r.lastName}`;
				},
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
