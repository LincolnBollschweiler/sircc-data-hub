"use client";

import { Contact, User } from "@/types";
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
import {
	deleteCoachMiles,
	deleteCoachHours,
	updateClerkUser,
	updateUserRole,
	undeleteUserById,
} from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";
import { DialogTrigger } from "../ui/dialog";
import AssignRoleFormDialog from "./assignRole/AssignRoleFormDialog";
import ClientServicesDialog from "./clients/ClientServicesDialog";
import { CSTables, VolunteerType } from "@/tableInteractions/db";
import HoursDialog from "./coaches/HoursDialog";
import MilesDialog from "./coaches/MilesDialog";
import {
	ClientList,
	ClientServiceFull,
	CoachHours,
	CoachList,
	CoachMiles,
	VolunteerHours,
	VolunteerList,
} from "@/userInteractions/db";
import Image from "next/image";
import VolunteerHoursDialog from "./volunteers/VolunteerHoursDialog";
import { removeRole } from "./duplicate/mergeRoles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { createRoot } from "react-dom/client";
import StaffUpdateDialog from "./staff/StaffUpdateDialog";
import AdminUpdateDialog from "./admins/AdminUpdateDialog";
import { dateOptions } from "@/utils/constants";
import ContactUpdateDialog from "../contacts/ContactUpdateDialog";
import { deleteContact } from "@/contactInteractions/actions";
// import { Contact } from "@/contactInteractions/db";

// Helper casts
const asUserRow = (row: unknown): User => row as User;
const asClientRow = (row: unknown): ClientList => row as ClientList;
const asVolunteerRow = (row: unknown): VolunteerList => row as VolunteerList;
const asSingleClientRow = (row: unknown): ClientServiceFull => row as ClientServiceFull;
const asCoachRow = (row: unknown): CoachList => row as CoachList;
const asCoachHoursRow = (row: unknown): CoachHours => row as CoachHours;
const asMilesRow = (row: unknown): CoachMiles => row as CoachMiles;
const asVolunteerHoursRow = (row: unknown): VolunteerHours => row as VolunteerHours;
const asContactRow = (row: unknown): Contact => row as Contact;

const processAcceptance = async (user: Partial<User>, accepted: boolean | null) => {
	const action = user.id ? updateClerkUser.bind(null, user.id) : undefined;
	if (!action) return;
	const actionData = await action({ ...user, accepted });
	if (actionData) actionToast({ actionData });
};

const undeleteUser = async (user: Partial<User>) => {
	const action = user.id ? undeleteUserById.bind(null, user.id) : undefined;
	if (!action) return;
	const actionData = await action();
	if (actionData) actionToast({ actionData });
};

const removeContact = async (id: string) => {
	const action = deleteContact.bind(null, id);
	const actionData = await action();
	if (actionData) actionToast({ actionData });
};

const removeCoachHours = async (id: string) => {
	const action = deleteCoachHours.bind(null, id);
	const actionData = await action();
	if (actionData) actionToast({ actionData });
};

const removeCoachMiles = async (id: string) => {
	const action = deleteCoachMiles.bind(null, id);
	const actionData = await action();
	if (actionData) actionToast({ actionData });
};

const removeUserRole = async (user: User, role: string) => {
	const updatedRole = removeRole(user.role, role) as User["role"];
	const action = user.clerkUserId ? updateClerkUser.bind(null, user.id) : updateUserRole.bind(null, user.id);
	const actionData = await action({ ...user, role: updatedRole });
	if (actionData) actionToast({ actionData });
};

const confirmRemoveRole = async (user: User, role: string) => {
	let confirmed = false;

	await new Promise<void>((resolve) => {
		const handleConfirm = () => {
			root.render(null);
			document.body.removeChild(container);
			confirmed = true;
			resolve();
		};
		const handleCancel = () => {
			root.render(null);
			document.body.removeChild(container);
			resolve();
		};

		const DialogComponent = () => (
			<Dialog open={true} onOpenChange={handleCancel}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove Role</DialogTitle>
					</DialogHeader>
					<div className="py-2">
						Are you sure you want to remove the <strong>{role}</strong> role from{" "}
						<strong>
							{user.firstName} {user.lastName}
						</strong>
						?
					</div>
					<DialogFooter className="flex justify-end gap-2">
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleConfirm}>
							Remove Role
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);

		// render the dialog temporarily
		const container = document.createElement("div");
		document.body.appendChild(container);

		const root = createRoot(container);
		root.render(<DialogComponent />);
	});

	if (confirmed) {
		await removeUserRole(user, role);
	}
};

export const userDataTableColumns = (
	userType: string,
	setDuplicatesDialogOpen: (open: boolean) => void,
	setCurrentDuplicateUser: (user: User | null) => void,
	trainingsCount?: number,
	checkListCount?: number,
	csTables?: CSTables,
	volunteerTypes?: VolunteerType[],
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
					const r = asUserRow(info.row.original);
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
						<ArrowUpDown className="-ml-4 h-4 w-4" />
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
					const r = asUserRow(info.row.original);
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
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
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
						<ArrowUpDown className="h-4 w-4" />
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
						<ArrowUpDown className="h-4 w-4" />
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

	if (userType === "deletedUser") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asUserRow(info.row.original);
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
						<ArrowUpDown className="-ml-4 h-4 w-4" />
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
					const r = asUserRow(info.row.original);
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
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				accessorKey: "role",
				header: ({ column }) => (
					<Button
						className="text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Last Role
						<ArrowUpDown className="h-4 w-4" />
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
				accessorKey: "deletedAt",
				accessorFn: (row) => {
					const r = asUserRow(row);
					const date = r.deletedAt;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Deleted
						<ArrowUpDown className="h-4 w-4" />
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
									<DropdownMenuItem onClick={() => undeleteUser(user)}>Add Back</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "client") {
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
						<ArrowUpDown className="-ml-4 h-4 w-4" />
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
					const r = asClientRow(info.row.original);
					return <div className="text-nowrap">{`${r.user.firstName} ${r.user.lastName}`}</div>;
				},
			},
			{
				accessorKey: "client.followUpNeeded",
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Follow-up
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					return Number(b.client?.followUpNeeded ?? false) - Number(a.client?.followUpNeeded ?? false);
				},
				cell: (info) => <div className="text-center">{info.getValue<boolean>() ? "Yes" : "No"}</div>,
			},
			{
				accessorKey: "client.followUpDate",
				accessorFn: (row) => {
					const r = asClientRow(row);
					const date = r.client?.followUpDate ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Follow-up Date
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
				accessorKey: "client.isReentryClient",
				header: () => <div className="text-center">Check List</div>,
				cell: (info) => {
					const r = asClientRow(info.row.original);
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
					const r = asClientRow(info.row.original);
					let coachName = r.coach ? `${r.coach.firstName} ${r.coach.lastName.charAt(0)}` : "N/A";
					if (r.coach?.firstName === "deleted user") coachName = "deleted user";
					return <div className="text-nowrap">{coachName}</div>;
				},
			},
			{
				accessorKey: "openRequestsCount",
				header: ({ column }) => (
					<Button
						className="text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Open Requests
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					return (b.openRequestsCount ?? 0) - (a.openRequestsCount ?? 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "serviceCount",
				header: ({ column }) => (
					<Button
						className="text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Services
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					return (b.serviceCount ?? 0) - (a.serviceCount ?? 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "user.email",
				header: "Email",
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
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
					const r = asClientRow(info.row.original);
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
				header: ({ column }) => (
					<Button
						className="text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Updated
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					return (
						(b.requestsUpdatedAt ?? b.client?.updatedAt
							? new Date(b.requestsUpdatedAt ?? b.client!.updatedAt).getTime()
							: 0) -
						(a.requestsUpdatedAt ?? a.client?.updatedAt
							? new Date(a.requestsUpdatedAt ?? a.client!.updatedAt).getTime()
							: 0)
					);
				},
				cell: (info) => {
					const r = asClientRow(info.row.original);
					if (r.requestsUpdatedAt) {
						return (
							<div className="text-center">
								{new Date(r.requestsUpdatedAt).toLocaleDateString("en-US", dateOptions)}
							</div>
						);
					}
					if (r.client)
						return (
							<div className="text-center">
								{new Date(r.client?.updatedAt).toLocaleDateString("en-US", dateOptions)}
							</div>
						);
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const clientRow = asClientRow(row.original); // now TypeScript knows it's ClientWithUser
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
										<a
											className="hover:!bg-success hover:!text-success-foreground"
											href={`/admin/clients/${user.id}/edit`}
										>
											View or Edit Client
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<button
											className="hover:!bg-success hover:!text-success-foreground"
											onClick={() => {
												setCurrentDuplicateUser(user);
												setDuplicatesDialogOpen(true);
											}}
										>
											Find Duplicate Records
										</button>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => confirmRemoveRole(user, "client")}
									>
										Remove Client Role
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
					const r = asSingleClientRow(row);
					return r.requestedService?.name ?? "";
				},
				header: "Requested Service",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.requestedService?.name ?? ""}</div>;
				},
			},
			{
				id: "providedService",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.providedService?.name ?? "";
				},
				header: "Provided Service",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.providedService?.name ?? ""}</div>;
				},
			},
			{
				id: "city",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.city?.name ?? "";
				},
				header: "City",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.city?.name ?? ""}</div>;
				},
			},
			{
				id: "location",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.location?.name ?? "";
				},
				header: "Location",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.location?.name ?? ""}</div>;
				},
			},
			{
				id: "referralSource",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.referralSource?.name ?? "";
				},
				header: "Referral Source",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.referralSource?.name ?? ""}</div>;
				},
			},
			{
				id: "referredOut",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.referredOut?.name ?? "";
				},
				header: "Referred Out",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.referredOut?.name ?? ""}</div>;
				},
			},
			{
				id: "visitReason",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.visit?.name ?? "";
				},
				header: "Visit Reason",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.visit?.name ?? ""}</div>;
				},
			},
			{
				id: "funding",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.clientService.funds ?? null;
				},
				header: "Funding",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return r.clientService.funds != null ? `$${r.clientService.funds}` : "";
				},
			},
			{
				id: "notes",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
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
					const r = asSingleClientRow(row);
					const date = r.clientService.createdAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Created",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				id: "updatedAt",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
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
					const clientRow = asSingleClientRow(row.original);
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
					const r = asSingleClientRow(row);
					return r.requestedService?.name ?? "";
				},
				header: "Requested Service",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.requestedService?.name ?? ""}</div>;
				},
			},
			{
				id: "providedService",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.providedService?.name ?? "";
				},
				header: "Provided Service",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.providedService?.name ?? ""}</div>;
				},
			},
			{
				id: "city",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.city?.name ?? "";
				},
				header: "City",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.city?.name ?? ""}</div>;
				},
			},
			{
				id: "location",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.location?.name ?? "";
				},
				header: "Location",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.location?.name ?? ""}</div>;
				},
			},
			{
				id: "referralSource",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.referralSource?.name ?? "";
				},
				header: "Referral Source",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.referralSource?.name ?? ""}</div>;
				},
			},
			{
				id: "referredOut",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.referredOut?.name ?? "";
				},
				header: "Referred Out",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.referredOut?.name ?? ""}</div>;
				},
			},
			{
				id: "visitReason",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.visit?.name ?? "";
				},
				header: "Visit Reason",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return <div className="text-nowrap">{r.visit?.name ?? ""}</div>;
				},
			},
			{
				id: "funding",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					return r.clientService.funds ?? null;
				},
				header: "Funding",
				cell: (info) => {
					const r = asSingleClientRow(info.row.original);
					return r.clientService.funds != null ? `$${r.clientService.funds}` : "";
				},
			},
			{
				id: "notes",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
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
					const r = asSingleClientRow(row);
					const date = r.clientService.createdAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Created",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				id: "updatedAt",
				accessorFn: (row) => {
					const r = asSingleClientRow(row);
					const date = r.clientService.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: "Updated",
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
		];
	}

	if (userType === "staff") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asUserRow(info.row.original);
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
						<ArrowUpDown className="-ml-4 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asUserRow(rowA.original);
					const b = asUserRow(rowB.original);
					const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
					const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asUserRow(info.row.original);
					return `${r.firstName} ${r.lastName}`;
				},
			},
			{
				accessorKey: "phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const r = asUserRow(info.row.original);
					const phone = formatPhoneNumber(r.phone || "");
					return <div className="text-center">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "email",
				header: "Email",
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const user = asUserRow(row.original);
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
										<StaffUpdateDialog user={user}>
											<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
												Edit Staff Details
											</DialogTrigger>
										</StaffUpdateDialog>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => confirmRemoveRole(user, "staff")}
									>
										Remove Staff Role
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
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asUserRow(info.row.original);
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
						<ArrowUpDown className="-ml-4 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asUserRow(rowA.original);
					const b = asUserRow(rowB.original);
					const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
					const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asUserRow(info.row.original);
					return `${r.firstName} ${r.lastName}`;
				},
			},
			{
				accessorKey: "phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const r = asUserRow(info.row.original);
					const phone = formatPhoneNumber(r.phone || "");
					return <div className="text-center">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "email",
				header: "Email",
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const user = asUserRow(row.original);
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
										<AdminUpdateDialog user={user}>
											<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
												Edit Admin Details
											</DialogTrigger>
										</AdminUpdateDialog>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => confirmRemoveRole(user, "admin")}
									>
										Remove Admin Role
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "volunteer") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asVolunteerRow(info.row.original);
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
					const r = asVolunteerRow(row);
					return `${r.user.firstName} ${r.user.lastName}`;
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="-ml-4 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asVolunteerRow(rowA.original);
					const b = asVolunteerRow(rowB.original);
					const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
					const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asVolunteerRow(info.row.original);
					return `${r.user.firstName} ${r.user.lastName}`;
				},
			},
			{
				accessorKey: "user.phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const r = asVolunteerRow(info.row.original);
					const phone = formatPhoneNumber(r.user.phone || "");
					return <div className="text-center">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "email",
				header: "Email",
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				accessorKey: "hours",
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center justify-center">
							<ArrowUpDown className="h-4 w-4" />
							Hours
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asVolunteerRow(rowA.original);
					const b = asVolunteerRow(rowB.original);
					return (Number(b.hours) ?? 0) - (Number(a.hours) ?? 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "lastVolunteerType",
				header: "Last Volunteer Type",
				cell: (info) => {
					const r = asVolunteerRow(info.row.original);
					return <div className="text-nowrap">{r.lastVolunteerType ?? "N/A"}</div>;
				},
			},
			{
				accessorKey: "lastVolunteeredAt",
				accessorFn: (row) => {
					const r = asVolunteerRow(row);
					const date = r.lastVolunteeredAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center justify-center">
							<ArrowUpDown className="h-4 w-4" />
							Updated
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asVolunteerRow(rowA.original);
					const b = asVolunteerRow(rowB.original);
					return new Date(b.lastVolunteeredAt ?? 0).getTime() - new Date(a.lastVolunteeredAt ?? 0).getTime();
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
					const volunteerRow = asVolunteerRow(row.original); // now TypeScript knows it's ClientWithUser
					const user = volunteerRow.user;

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
										<a
											className="hover:!bg-success hover:!text-success-foreground"
											href={`/admin/volunteers/${user.id}/edit`}
										>
											View or Edit Volunteer
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<button
											className="hover:!bg-success hover:!text-success-foreground"
											onClick={() => {
												setCurrentDuplicateUser(user);
												setDuplicatesDialogOpen(true);
											}}
										>
											Find Duplicate Records
										</button>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => confirmRemoveRole(user, "volunteer")}
									>
										Remove Volunteer Role
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	if (userType === "volunteer-hours") {
		return [
			{
				accessorKey: "date",
				accessorFn: (row) => {
					const r = asVolunteerHoursRow(row);
					const date = r.date ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Date
					</Button>
				),
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				accessorKey: "hours",
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Hours
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
				accessorKey: "volunteerType",
				header: "Volunteering Type",
				cell: (info) => {
					const r = asVolunteerHoursRow(info.row.original);
					const text =
						r.volunteeringTypeId && volunteerTypes
							? volunteerTypes.find((vt) => vt.id === r.volunteeringTypeId)?.name
							: "N/A";
					return <div className="text-nowrap">{text}</div>;
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
					const r = asVolunteerHoursRow(row);
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
					const hoursRow = asVolunteerHoursRow(row.original); // now TypeScript knows it's CoachHours

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
										<VolunteerHoursDialog
											values={hoursRow as VolunteerHours}
											volunteerTypes={volunteerTypes}
										>
											<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
												Edit Hours
											</DialogTrigger>
										</VolunteerHoursDialog>
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

	if (userType === "volunteer-hours-view") {
		return [
			{
				accessorKey: "date",
				accessorFn: (row) => {
					const r = asVolunteerHoursRow(row);
					const date = r.date ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Date
					</Button>
				),
				cell: (info) => new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions),
			},
			{
				accessorKey: "hours",
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Hours
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
				accessorKey: "volunteerType",
				header: "Volunteering Type",
				cell: (info) => {
					const r = asVolunteerHoursRow(info.row.original);
					const text =
						r.volunteeringTypeId && volunteerTypes
							? volunteerTypes.find((vt) => vt.id === r.volunteeringTypeId)?.name
							: "N/A";
					return <div className="text-nowrap">{text}</div>;
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
					const r = asVolunteerHoursRow(row);
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
		];
	}

	if (userType === "coach") {
		return [
			{
				id: "userPhoto",
				header: "",
				accessorKey: "photoUrl",
				cell: (info) => {
					const r = asCoachRow(info.row.original);
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
					const r = asCoachRow(row);
					return `${r.user.firstName} ${r.user.lastName}`;
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="-ml-4 h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asCoachRow(rowA.original);
					const b = asCoachRow(rowB.original);
					const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
					const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asCoachRow(info.row.original);
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
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				accessorKey: "clientCount",
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center justify-center">
							<ArrowUpDown className="h-4 w-4" />
							Clients
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asCoachRow(rowA.original);
					const b = asCoachRow(rowB.original);
					return (b.clientCount ?? 0) - (a.clientCount ?? 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "trainingsCompleted",
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center justify-center">
							<ArrowUpDown className="h-4 w-4" />
							Trainings
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asCoachRow(rowA.original);
					const b = asCoachRow(rowB.original);
					return (b.trainingsCompleted ?? 0) - (a.trainingsCompleted ?? 0);
				},
				cell: (info) => {
					const completed = info.getValue<number>();
					const total = trainingsCount;
					const cell = completed == total ? "Complete" : `${completed} of ${total}`; // use soft equals
					return <div className="text-center">{cell}</div>;
				},
			},
			{
				accessorKey: "volunteerHours",
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center justify-center">
							<ArrowUpDown className="h-4 w-4" />
							Volunteer Hours
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asCoachRow(rowA.original);
					const b = asCoachRow(rowB.original);
					return (b.volunteerHours ?? 0) - (a.volunteerHours ?? 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "paidHours",
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center justify-center">
							<ArrowUpDown className="h-4 w-4" />
							Paid Hours
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asCoachRow(rowA.original);
					const b = asCoachRow(rowB.original);
					return (b.paidHours ?? 0) - (a.paidHours ?? 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "coach.updatedAt",
				accessorFn: (row) => {
					const r = asCoachRow(row);
					const date = r.coach?.updatedAt ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center justify-center">
							<ArrowUpDown className="h-4 w-4" />
							Updated
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asCoachRow(rowA.original);
					const b = asCoachRow(rowB.original);
					return new Date(b.coach?.updatedAt ?? 0).getTime() - new Date(a.coach?.updatedAt ?? 0).getTime();
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
					const coachRow = asCoachRow(row.original);
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
										<a
											className="hover:!bg-success hover:!text-success-foreground"
											href={`/admin/coaches/${user.id}/edit`}
										>
											View or Edit Coach
										</a>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => confirmRemoveRole(user, "coach")}
									>
										Remove Coach Role
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
						<ArrowUpDown className="-ml-4 h-4 w-4" />
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
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Needs Follow-up
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					return (b.client?.followUpNeeded ? 1 : 0) - (a.client?.followUpNeeded ? 1 : 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<boolean>() ? "Yes" : "No"}</div>,
			},
			{
				accessorKey: "client.followUpDate",
				accessorFn: (row) => {
					const r = asClientRow(row);
					const date = r.client?.followUpDate ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0 text-center w-full"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Follow-up Date
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					const dateA = a.client?.followUpDate ? new Date(a.client.followUpDate).getTime() : 0;
					const dateB = b.client?.followUpDate ? new Date(b.client.followUpDate).getTime() : 0;
					return dateB - dateA;
				},
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
					const r = asClientRow(info.row.original);
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
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Open Requests
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					return (b.openRequestsCount || 0) - (a.openRequestsCount || 0);
				},
				cell: (info) => <div className="text-center">{info.getValue<number>()}</div>,
			},
			{
				accessorKey: "serviceCount",
				header: ({ column }) => (
					<Button
						className="px-0 w-full justify-center"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<div className="flex gap-2 items-center">
							<ArrowUpDown className="h-4 w-4" />
							Services
						</div>
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asClientRow(rowA.original);
					const b = asClientRow(rowB.original);
					return (b.serviceCount || 0) - (a.serviceCount || 0);
				},
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
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const clientRow = asClientRow(row.original); // now TypeScript knows it's ClientWithUser
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
										<a
											className="hover:!bg-success hover:!text-success-foreground"
											href={`/coach/clients/${user.id}/edit?coachId=${coachId}`}
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
					const r = asCoachHoursRow(row);
					const date = r.date ?? null;
					return date ? new Date(date).toLocaleDateString("en-US", dateOptions) : "";
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
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
					const hoursRow = asCoachHoursRow(row.original); // now TypeScript knows it's CoachHours

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
					const r = asMilesRow(row);
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
				sortingFn: (rowA, rowB) => {
					const a = asMilesRow(rowA.original);
					const b = asMilesRow(rowB.original);
					return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
				},
				cell: (info) => <div>{new Date(info.getValue<Date>()).toLocaleDateString("en-US", dateOptions)}</div>,
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
				sortingFn: (rowA, rowB) => {
					const a = asMilesRow(rowA.original);
					const b = asMilesRow(rowB.original);
					return (b.miles ? Number(b.miles) : 0) - (a.miles ? Number(a.miles) : 0);
				},
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
				sortingFn: (rowA, rowB) => {
					const a = asMilesRow(rowA.original);
					const b = asMilesRow(rowB.original);
					return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
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
					const milesRow = asMilesRow(row.original); // now TypeScript knows it's CoachMiles

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
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
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

	if (userType === "contact") {
		return [
			{
				id: "name",
				accessorFn: (row) => {
					const r = asContactRow(row);
					return r.name;
				},
				header: ({ column }) => (
					<Button
						className="px-0"
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						<ArrowUpDown className="h-4 w-4" />
						Name
					</Button>
				),
				sortingFn: (rowA, rowB) => {
					const a = asContactRow(rowA.original);
					const b = asContactRow(rowB.original);
					const nameA = a.name.toLowerCase();
					const nameB = b.name.toLowerCase();
					return nameA.localeCompare(nameB);
				},
				cell: (info) => {
					const r = asContactRow(info.row.original);
					return <div className="text-nowrap">{r.name}</div>;
				},
			},
			{
				accessorKey: "typeOfService",
				header: "Type of Service",
				cell: (info) => {
					const r = asContactRow(info.row.original);
					return <div className="text-nowrap">{r.typeOfService || ""}</div>;
				},
			},
			{
				accessorKey: "phone",
				header: () => <div className="text-center">Phone</div>,
				cell: (info) => {
					const r = asContactRow(info.row.original);
					const phone = formatPhoneNumber(r.phone || "");
					return <div className="text-center text-nowrap">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "email",
				header: "Email",
				cell: ({ getValue }) => {
					const email = getValue<string>() || "";
					if (!email) return "";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				accessorKey: "contactName",
				header: "Contact Name",
				cell: (info) => {
					const r = asContactRow(info.row.original);
					return <div className="text-nowrap">{r.contactName || ""}</div>;
				},
			},
			{
				accessorKey: "contactPhone",
				header: "Contact Phone",
				cell: (info) => {
					const r = asContactRow(info.row.original);
					const phone = formatPhoneNumber(r.contactPhone || "");
					return <div className="text-nowrap">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "contactEmail",
				header: "Contact Email",
				cell: (info) => {
					const r = asContactRow(info.row.original);
					const email = r.contactEmail || "";
					if (!email) return "N/A";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				accessorKey: "secondContactName",
				header: "Second Contact Name",
				cell: (info) => {
					const r = asContactRow(info.row.original);
					return <div className="text-nowrap">{r.secondContactName || ""}</div>;
				},
			},
			{
				accessorKey: "secondContactPhone",
				header: "Second Contact Phone",
				cell: (info) => {
					const r = asContactRow(info.row.original);
					const phone = formatPhoneNumber(r.secondContactPhone || "");
					return <div className="text-nowrap">{phone || "N/A"}</div>;
				},
			},
			{
				accessorKey: "secondContactEmail",
				header: "Second Contact Email",
				cell: (info) => {
					const r = asContactRow(info.row.original);
					const email = r.secondContactEmail || "";
					if (!email) return "N/A";
					return (
						<a href={`mailto:${email}`} className="text-blue-500 hover:underline">
							{email}
						</a>
					);
				},
			},
			{
				accessorKey: "notes",
				header: "Notes",
				cell: ({ getValue }) => {
					const notes = getValue<string>() || "";
					const truncated = notes.length > 30 ? `${notes.slice(0, 30)}…` : notes;
					return <div className="text-nowrap">{truncated}</div>;
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right"></div>,
				cell: ({ row }) => {
					const contact = asContactRow(row.original);

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
										<ContactUpdateDialog contact={contact}>
											<DialogTrigger className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:!bg-success">
												Edit Contact
											</DialogTrigger>
										</ContactUpdateDialog>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="hover:!bg-danger"
										onClick={() => removeContact(contact.id)}
									>
										Delete Contact
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];
	}

	// should never happen but needed for TS
	return [];
};
