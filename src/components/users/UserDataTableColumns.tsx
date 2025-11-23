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
import { deleteCoachMiles, deleteCoachHours, updateClerkUser } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { DialogTrigger } from "../ui/dialog";
import AssignRoleFormDialog from "./assignRole/AssignRoleFormDialog";
import ClientServicesDialog from "./clients/ClientServicesDialog";
import { CSTables } from "@/tableInteractions/db";
import HoursDialog from "./coaches/HoursDialog";
import MilesDialog from "./coaches/MilesDialog";
import { ClientList, ClientServiceFull, CoachHours, CoachList, CoachMiles } from "@/userInteractions/db";
import Image from "next/image";

const dateOptions: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };

// Helper casts
const asUser = (row: unknown): User => row as User;
const asUserRow = (row: unknown): User => row as User;
const asClient = (row: unknown): ClientList => row as ClientList;
const asClientRow = (row: unknown): ClientList => row as ClientList;
const asSingleClient = (row: unknown): ClientServiceFull => row as ClientServiceFull;
const asCoach = (row: unknown): CoachList => row as CoachList;
const asHours = (row: unknown): CoachHours => row as CoachHours;
const asMiles = (row: unknown): CoachMiles => row as CoachMiles;

const processAcceptance = async (user: Partial<User>, accepted: boolean | null) => {
	const action = user.id ? updateClerkUser.bind(null, user.id) : undefined;
	if (!action) return;
	const actionData = await action({ ...user, accepted });
	if (actionData) actionToast({ actionData });
};

const removeCoachHours = async (id: string) => {
	const action = deleteCoachHours.bind(null, id);
	const actionData = await action();
	if (actionData) {
		actionToast({ actionData });
	}
};

const removeCoachMiles = async (id: string) => {
	const action = deleteCoachMiles.bind(null, id);
	const actionData = await action();
	if (actionData) {
		actionToast({ actionData });
	}
};

export const userDataTableColumns = (
	userType: string,
	coachIsViewing?: boolean,
	trainingsCount?: number,
	checkListCount?: number,
	csTables?: CSTables,
	startDelete?: (id: string) => void
): ColumnDef<unknown>[] => {
	// -------------------- REJECTED/APPLICANT --------------------
	if (userType === "rejected" || userType === "applicant") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asUser(info.row.original);
					return (
						<Image
							src={r.photoUrl ?? "/default-avatar.png"}
							alt={`${r.firstName} ${r.lastName}`}
							width={30}
							height={30}
							className="rounded-full object-cover mx-auto"
						/>
					);
				},
			},
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
						<ArrowUpDown className="ml-2 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const rA = asUserRow(rowA.original);
					const rB = asUserRow(rowB.original);
					return `${rA.firstName} ${rA.lastName}`
						.toLowerCase()
						.localeCompare(`${rB.firstName} ${rB.lastName}`.toLowerCase());
				},
				cell: (info) => {
					const r = asUser(info.row.original);
					return <div className="text-nowrap">{`${r.firstName} ${r.lastName}`}</div>;
				},
			},
			{
				accessorKey: "phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const phone = formatPhoneNumber(info.getValue<string>() || "");
					return <div className="text-center text-nowrap">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "email",
				header: "Email",
			},
			{
				accessorKey: "desiredRole",
				header: ({ column }) => (
					<Button
						className="text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Desired Role
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: (info) => <div className="text-center text-nowrap">{info.getValue<string>() || "N/A"}</div>,
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
				accessorFn: (row) => {
					const r = asUserRow(row);
					const date = r.createdAt;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Added
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: (info) => {
					const date = info.getValue<Date>();
					return date ? (
						<div className="text-center">{new Date(date).toLocaleDateString("en-US", dateOptions)}</div>
					) : (
						<div className="text-center">N/A</div>
					);
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const user = row.original as User;
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
											<a className="hover:!bg-background-dark" href={`mailto:${user.email}`}>
												Send Email
											</a>
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
												<AssignRoleFormDialog profile={user}>
													<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
														Assign Role & Accept
													</DialogTrigger>
												</AssignRoleFormDialog>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="hover:!bg-danger"
												onClick={() => processAcceptance(user, false)}
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
	}

	if (userType === "client" || userType === "client-volunteer") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asClientRow(info.row.original);
					return (
						<Image
							src={r.user.photoUrl ?? "/default-avatar.png"}
							alt={`${r.user.firstName} ${r.user.lastName}`}
							width={30}
							height={30}
							className="rounded-full object-cover mx-auto"
						/>
					);
				},
			},
			{
				id: "name",
				accessorFn: (row) => {
					const r = asClientRow(row); // <-- correct cast
					return `${r.user.firstName} ${r.user.lastName}`;
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="ml-2 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
					const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asClient(info.row.original);
					return <div className="text-nowrap">{`${r.user.firstName} ${r.user.lastName}`}</div>;
				},
			},
			{
				accessorKey: "client.followUpNeeded",
				header: () => <div className="text-center">Follow-up</div>,
				cell: (info) => <div className="text-center">{info.getValue<boolean>() ? "Yes" : "No"}</div>,
			},
			{
				accessorKey: "client.followUpDate",
				accessorFn: (row) => {
					const r = asClientRow(row);
					const date = r.client?.followUpDate ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: () => <div className="text-center">Follow-up Date</div>,
				cell: (info) => {
					const date = info.getValue<Date>();
					return date ? (
						<div className="text-center">{new Date(date).toLocaleDateString("en-US", dateOptions)}</div>
					) : (
						<div className="text-center">N/A</div>
					);
				},
			},
			{
				accessorKey: "client.isReentryClient",
				header: () => <div className="text-center">Check List</div>,
				cell: (info) => {
					const r = asClient(info.row.original);
					const isReentry = r.client?.isReentryClient;
					const checkListCountValue = checkListCount || 0;
					const checkListItemCount = r.checkListItemCount || 0;
					const value = !isReentry
						? "N/A"
						: checkListCountValue == checkListItemCount
						? "Completed"
						: `${r.checkListItemCount || 0} of ${checkListCount}`;
					return <div className="text-center">{value}</div>;
				},
			},
			{
				accessorKey: "coachName",
				header: "Coach",
				cell: (info) => {
					const r = asClient(info.row.original);
					return r.coach ? (
						<div className="text-nowrap">{`${r.coach.firstName} ${r.coach.lastName.charAt(0)}`}</div>
					) : (
						"N/A"
					);
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
					return <div className="text-center text-nowrap">{phone || "N/A"}</div>;
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
				accessorFn: (row) => {
					const r = asClientRow(row);
					const date = r.requestsUpdatedAt ?? r.client?.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
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
										<a className="hover:!bg-background-dark" href={`mailto:${user.email}`}>
											Send Email
										</a>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<a
											className="hover:!bg-success hover:!text-success-foreground"
											href={`/admin/clients/${user.id}/edit`}
										>
											View or Edit Client
										</a>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "single-client") {
		return [
			{
				id: "requestedService",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.requestedService?.name ?? "";
				},
				header: "Requested Service",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.requestedService?.name ?? ""}</div>;
				},
			},
			{
				id: "providedService",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.providedService?.name ?? "";
				},
				header: "Provided Service",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.providedService?.name ?? ""}</div>;
				},
			},
			{
				id: "city",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.city?.name ?? "";
				},
				header: "City",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.city?.name ?? ""}</div>;
				},
			},
			{
				id: "location",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.location?.name ?? "";
				},
				header: "Location",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.location?.name ?? ""}</div>;
				},
			},
			{
				id: "referralSource",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.referralSource?.name ?? "";
				},
				header: "Referral Source",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.referralSource?.name ?? ""}</div>;
				},
			},
			{
				id: "referredOut",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.referredOut?.name ?? "";
				},
				header: "Referred Out",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.referredOut?.name ?? ""}</div>;
				},
			},
			{
				id: "visitReason",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.visit?.name ?? "";
				},
				header: "Visit Reason",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.visit?.name ?? ""}</div>;
				},
			},
			{
				id: "funding",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.clientService.funds ?? null;
				},
				header: "Funding",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return r.clientService.funds != null ? `$${r.clientService.funds}` : "";
				},
			},
			{
				id: "notes",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.clientService.notes ?? "";
				},
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
				id: "createdAt",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					const date = r.clientService.createdAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Created",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				id: "updatedAt",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					const date = r.clientService.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Updated",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const clientRow = asSingleClient(row.original);
					const service = clientRow.clientService;

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
										<ClientServicesDialog
											clientId={service.clientId}
											csTables={csTables!}
											values={service}
											coachIsViewing={!!coachIsViewing}
										>
											<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
												Edit Service
											</DialogTrigger>
										</ClientServicesDialog>
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => startDelete && startDelete(service.id)}
									>
										Delete Service
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "single-client-view") {
		return [
			{
				id: "requestedService",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.requestedService?.name ?? "";
				},
				header: "Requested Service",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.requestedService?.name ?? ""}</div>;
				},
			},
			{
				id: "providedService",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.providedService?.name ?? "";
				},
				header: "Provided Service",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.providedService?.name ?? ""}</div>;
				},
			},
			{
				id: "city",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.city?.name ?? "";
				},
				header: "City",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.city?.name ?? ""}</div>;
				},
			},
			{
				id: "location",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.location?.name ?? "";
				},
				header: "Location",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.location?.name ?? ""}</div>;
				},
			},
			{
				id: "referralSource",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.referralSource?.name ?? "";
				},
				header: "Referral Source",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.referralSource?.name ?? ""}</div>;
				},
			},
			{
				id: "referredOut",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.referredOut?.name ?? "";
				},
				header: "Referred Out",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.referredOut?.name ?? ""}</div>;
				},
			},
			{
				id: "visitReason",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.visit?.name ?? "";
				},
				header: "Visit Reason",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return <div className="text-nowrap">{r.visit?.name ?? ""}</div>;
				},
			},
			{
				id: "funding",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.clientService.funds ?? null;
				},
				header: "Funding",
				cell: (info) => {
					const r = asSingleClient(info.row.original);
					return r.clientService.funds != null ? `$${r.clientService.funds}` : "";
				},
			},
			{
				id: "notes",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					return r.clientService.notes ?? "";
				},
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
				id: "createdAt",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					const date = r.clientService.createdAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Created",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				id: "updatedAt",
				accessorFn: (row) => {
					const r = asSingleClient(row);
					const date = r.clientService.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Updated",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
		];
	}

	if (userType === "volunteer" || userType === "client-volunteer") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asUser(info.row.original);
					return (
						<Image
							src={r.photoUrl ?? "/default-avatar.png"}
							alt={`${r.firstName} ${r.lastName}`}
							width={30}
							height={30}
							className="rounded-full object-cover mx-auto"
						/>
					);
				},
			},
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
				accessorFn: (row) => {
					const r = asUserRow(row);
					const date = r.createdAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Added",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
		];
	}

	if (userType === "coach") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asCoach(info.row.original);
					return (
						<Image
							src={r.user.photoUrl ?? "/default-avatar.png"}
							alt={`${r.user.firstName} ${r.user.lastName}`}
							width={30}
							height={30}
							className="rounded-full object-cover mx-auto"
						/>
					);
				},
			},
			{
				id: "name",
				accessorFn: (row) => {
					const r = asCoach(row);
					return `${r.user.firstName} ${r.user.lastName}`;
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="ml-2 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asCoach(rowA.original);
					const b = asCoach(rowB.original);
					const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
					const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asCoach(info.row.original);
					return <div className="text-nowrap">{`${r.user.firstName} ${r.user.lastName}`}</div>;
				},
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
				accessorKey: "coach.llc",
				header: "LLC",
				cell: (info) => <div className="text-nowrap">{info.getValue<string>() ?? "None"}</div>,
			},
			{
				accessorKey: "coach.website",
				header: "Website",
				cell: (info) => <div className="text-nowrap">{info.getValue<string>() ?? "None"}</div>,
			},
			{
				accessorKey: "user.email",
				header: "Email",
			},
			{
				accessorKey: "clientCount",
				header: () => <div className="text-center">Clients</div>,
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "trainingsCompleted",
				header: () => <div className="text-center">Trainings</div>,
				cell: (info) => {
					const completed = info.getValue<number>();
					const total = trainingsCount;
					const cell = completed == total ? "Complete" : `${completed} of ${total}`; // use soft equals
					return <div className="text-center">{cell}</div>;
				},
			},
			{
				accessorKey: "volunteerHours",
				header: () => <div className="text-center">Volunteer Hours</div>,
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "paidHours",
				header: () => <div className="text-center">Paid Hours</div>,
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "coach.updatedAt",
				accessorFn: (row) => {
					const r = asCoach(row);
					const date = r.coach?.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Updated",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const coachRow = asCoach(row.original);
					const user = coachRow.user;

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
										<a className="hover:!bg-background-dark" href={`mailto:${user.email}`}>
											Send Email
										</a>
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem asChild>
										<a
											className="hover:!bg-success hover:!text-success-foreground"
											href={`/admin/coaches/${user.id}/edit`}
										>
											View or Edit Coach
										</a>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "coach-clients") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asClientRow(info.row.original);
					return (
						<Image
							src={r.user.photoUrl ?? "/default-avatar.png"}
							alt={`${r.user.firstName} ${r.user.lastName}`}
							width={30}
							height={30}
							className="rounded-full object-cover mx-auto"
						/>
					);
				},
			},
			{
				id: "name",
				accessorFn: (row) => {
					const r = asClientRow(row);
					return `${r.user.firstName} ${r.user.lastName}`;
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="ml-2 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
					const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
			},
			{
				accessorKey: "client.followUpNeeded",
				header: () => <div className="text-center">Needs Follow-up</div>,
				cell: (info) => <div className="text-center">{info.getValue<boolean>() ? "Yes" : "No"}</div>,
			},
			{
				accessorKey: "client.followUpDate",
				accessorFn: (row) => {
					const r = asClientRow(row);
					const date = r.client?.followUpDate ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: () => <div className="text-center">Follow-up Date</div>,
				cell: (info) => {
					const date = info.getValue<Date>();
					return date ? (
						<div className="text-center">{new Date(date).toLocaleDateString("en-US", dateOptions)}</div>
					) : (
						<div className="text-center">N/A</div>
					);
				},
			},
			{
				accessorKey: "client.isReentryClient",
				header: () => <div className="text-center">Check List</div>,
				cell: (info) => {
					const r = asClient(info.row.original);
					const isReentry = r.client?.isReentryClient;
					const checkListCountValue = checkListCount || 0;
					const checkListItemCount = r.checkListItemCount || 0;
					const value = !isReentry
						? "N/A"
						: checkListCountValue == checkListItemCount
						? "Completed"
						: `${r.checkListItemCount || 0} of ${checkListCount}`;
					return <div className="text-center">{value}</div>;
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
				accessorKey: "user.phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const phone = formatPhoneNumber(info.getValue<string>() || "");
					return <div className="text-center text-nowrap">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "user.email",
				header: "Email",
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const clientRow = asClient(row.original); // now TypeScript knows it's ClientWithUser
					const user = clientRow.user;
					const coachId = clientRow.client?.coachId;

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
										<a className="hover:!bg-background-dark" href={`mailto:${user.email}`}>
											Send Email
										</a>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<a
											className="hover:!bg-success hover:!text-success-foreground"
											href={`/admin/clients/${user.id}/edit?coachId=${coachId}`}
										>
											View or Edit Client
										</a>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "coach-hours") {
		return [
			{
				accessorKey: "date",
				accessorFn: (row) => {
					const r = asHours(row);
					const date = r.date ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="ml-2 h-4 w-4" />
						Date
					</Button>
				),
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				accessorKey: "paidHours",
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Paid Hours
						</div>
					</Button>
				),
				cell: (info) => {
					const texVal = info.getValue<string>();
					const val = texVal ? Number(texVal).toFixed(2) : "";
					return <div className="text-center">{val}</div>;
				},
			},
			{
				accessorKey: "volunteerHours",
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Volunteer Hours
						</div>
					</Button>
				),
				cell: (info) => {
					const texVal = info.getValue<string>();
					const val = texVal ? Number(texVal).toFixed(2) : "";
					return <div className="text-center">{val}</div>;
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
				accessorKey: "updatedAt",
				accessorFn: (row) => {
					const r = asUserRow(row);
					const date = r.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Updated
						</div>
					</Button>
				),
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
					const hoursRow = asHours(row.original); // now TypeScript knows it's CoachHours

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
										<HoursDialog values={hoursRow as CoachHours}>
											<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
												Edit Hours
											</DialogTrigger>
										</HoursDialog>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => removeCoachHours(hoursRow.id)}
									>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "coach-miles") {
		return [
			{
				accessorKey: "date",
				accessorFn: (row) => {
					const r = asMiles(row);
					const date = r.date ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-start"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Date
						</div>
					</Button>
				),
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				accessorKey: "miles",
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Miles
						</div>
					</Button>
				),
				cell: (info) => <div className="text-center">{Number(info.getValue<string>()).toFixed(2)}</div>,
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
				accessorKey: "updatedAt",
				accessorFn: (row) => {
					const r = asUserRow(row);
					const date = r.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Updated
						</div>
					</Button>
				),
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
					const milesRow = asMiles(row.original); // now TypeScript knows it's CoachMiles

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
										<MilesDialog values={milesRow as Partial<CoachMiles>}>
											<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
												Edit Miles
											</DialogTrigger>
										</MilesDialog>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => removeCoachMiles(milesRow.id)}
									>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "admin") {
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
				accessorFn: (row) => {
					const r = asUserRow(row);
					const date = r.createdAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Added",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
		];
	}

	// should never happen but needed for TS
	return [];
};
