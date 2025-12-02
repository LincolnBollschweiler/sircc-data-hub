"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";
import { userDataTableColumns } from "./UserDataTableColumns";
import { CSTables, Service, VolunteerType } from "@/tableInteractions/db";
import { useDeleteClientService } from "../DeleteConfirm";
import { ClientServices, NewClientService } from "./clients/ClientServices";
import ClientUpdateDialog from "./clients/ClientUpdateDialog";
import { DialogTrigger } from "../ui/dialog";
import VolunteerHoursDialog from "./volunteers/VolunteerHoursDialog";
import VolunteerUpdateDialog from "./volunteers/VolunteerUpdateDialog";
import CoachUpdateDialog from "./coaches/CoachUpdateDialog";
import StaffUpdateDialog from "./staff/StaffUpdateDialog";
import AdminUpdateDialog from "./admins/AdminUpdateDialog";

interface DataTableProps<TData> {
	data: TData[];
	userType?: string;
}

const PAGE_SIZE_KEY = "datatable_page_size";

export default function DataTable<TData>({
	title,
	data,
	userType,
	coachIsViewing,
	userId,
	csTables,
	services,
	volunteerTypes,
	trainingsCount,
	checkListCount,
}: DataTableProps<TData> & {
	title?: string;
	userType: string;
	coachIsViewing?: boolean;
	userId?: string;
	csTables?: CSTables;
	services?: Service[] | undefined;
	volunteerTypes?: VolunteerType[] | undefined;
	trainingsCount?: number;
	checkListCount?: number;
}) {
	const typesWithNoNameColumn = [
		"single-client",
		"single-client-view",
		"volunteer-hours",
		"volunteer-hours-view",
		"coach-hours",
		"coach-miles",
	];
	const { startDelete, dialog } = useDeleteClientService();

	const columns = userDataTableColumns(
		userType,
		coachIsViewing,
		trainingsCount,
		checkListCount,
		csTables,
		volunteerTypes,
		userType === "single-client" ? startDelete : undefined
	) as ColumnDef<TData, unknown>[];

	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageSize, setPageSize] = useState<number>(() => {
		// Load from localStorage on first render (client only)
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem(`${PAGE_SIZE_KEY}-${userType}`);
			return saved ? Number(saved) : 10;
		}
		return 10;
	});

	const [loadingOrNone, setLoadingOrNone] = useState<React.ReactNode | null>(
		<div className="flex justify-center items-center p-20">
			<Loader2 className="w-8 h-8 text-foreground/80 animate-spin" />
		</div>
	);

	useEffect(() => {
		if (data.length === 0) {
			setLoadingOrNone(
				<div className={"flex justify-center items-center p-20 text-foreground text-xl font-semibold"}>
					<span className="-translate-y-5">No data to display.</span>
				</div>
			);
		} else {
			setLoadingOrNone(null);
		}
	}, [data, title]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: setGlobalFilter,
		state: { sorting, columnFilters, globalFilter }, // only sorting
		initialState: {
			pagination: { pageSize }, // pageIndex defaults to 0
		},
	});

	const pageCount = table.getPageCount();
	const pageIndex = table.getState().pagination.pageIndex;

	// When the user changes the page size via the Select
	const handlePageSizeChange = (value: string) => {
		const newSize = Number(value);
		setPageSize(newSize);
		localStorage.setItem(`${PAGE_SIZE_KEY}-${userType}`, value);
		table.setPageSize(newSize);
	};

	// Sync table state if user has a cached size
	useEffect(() => {
		table.setPageSize(pageSize);
	}, [pageSize, table]);

	return (
		<div className="container mx-auto border border-[border-muted/50] p-2.5 rounded-lg shadow-md bg-background-light">
			{!data?.length && (
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold mb-1">{title ?? ""}</h2>

					{userType === "single-client" && (
						<ClientServices clientId={userId!} csTables={csTables!} coachIsViewing={coachIsViewing} />
					)}
					{userType === "single-client-view" && <NewClientService clientId={userId!} services={services!} />}
					{userType === "client" && (
						<ClientUpdateDialog>
							<DialogTrigger asChild>
								<button className="btn-primary">Add New Client</button>
							</DialogTrigger>
						</ClientUpdateDialog>
					)}
					{userType === "volunteer-hours" && (
						<VolunteerHoursDialog volunteerId={userId!} volunteerTypes={volunteerTypes}>
							<DialogTrigger asChild>
								<Button className="btn-primary">Add Volunteer Hours</Button>
							</DialogTrigger>
						</VolunteerHoursDialog>
					)}
					{userType === "volunteer" && (
						<VolunteerUpdateDialog>
							<DialogTrigger asChild>
								<Button className="btn-primary">Add Volunteer</Button>
							</DialogTrigger>
						</VolunteerUpdateDialog>
					)}
					{userType === "coach" && (
						<CoachUpdateDialog>
							<DialogTrigger asChild>
								<Button className="btn-primary">Add Coach Role to Existing User</Button>
							</DialogTrigger>
						</CoachUpdateDialog>
					)}
					{userType === "staff" && (
						<StaffUpdateDialog>
							<DialogTrigger asChild>
								<Button className="btn-primary">Add Staff Role to Existing User</Button>
							</DialogTrigger>
						</StaffUpdateDialog>
					)}
					{userType === "admin" && (
						<AdminUpdateDialog>
							<DialogTrigger asChild>
								<Button className="btn-primary">Add Admin Role to Existing User</Button>
							</DialogTrigger>
						</AdminUpdateDialog>
					)}
				</div>
			)}

			{data.length > 0 ? (
				<>
					<div className="flex flex-wrap gap-1 items-center justify-between mb-2">
						<div className="flex flex-wrap sm:flex-nowrap gap-1 items-center">
							{!typesWithNoNameColumn.includes(userType) && (
								<Input
									className="max-w-sm text-primary-foreground bg-primary"
									placeholder={`Search by Name...`}
									value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
									onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
								/>
							)}
							<Input
								className="max-w-sm text-primary-foreground bg-primary"
								placeholder="Search all columns..."
								value={globalFilter ?? ""}
								onChange={(e) => setGlobalFilter(e.target.value)}
							/>
						</div>
						{userType === "single-client" && (
							<ClientServices clientId={userId!} csTables={csTables!} coachIsViewing={coachIsViewing} />
						)}
						{userType === "single-client-view" && (
							<NewClientService clientId={userId!} services={services!} />
						)}
						{userType === "client" && (
							<ClientUpdateDialog>
								<DialogTrigger asChild>
									<Button className="mr-1">Add New Client</Button>
								</DialogTrigger>
							</ClientUpdateDialog>
						)}
						{userType === "volunteer-hours" && (
							<VolunteerHoursDialog volunteerId={userId!} volunteerTypes={volunteerTypes}>
								<DialogTrigger asChild>
									<Button className="btn-primary">Add Volunteer Hours</Button>
								</DialogTrigger>
							</VolunteerHoursDialog>
						)}
						{userType === "volunteer" && (
							<VolunteerUpdateDialog>
								<DialogTrigger asChild>
									<Button className="btn-primary">Add Volunteer</Button>
								</DialogTrigger>
							</VolunteerUpdateDialog>
						)}
						{userType === "coach" && (
							<CoachUpdateDialog>
								<DialogTrigger asChild>
									<Button className="btn-primary">Add Coach Role to Existing User</Button>
								</DialogTrigger>
							</CoachUpdateDialog>
						)}
						{userType === "staff" && (
							<StaffUpdateDialog>
								<DialogTrigger asChild>
									<Button className="btn-primary">Add Staff Role to Existing User</Button>
								</DialogTrigger>
							</StaffUpdateDialog>
						)}
						{userType === "admin" && (
							<AdminUpdateDialog>
								<DialogTrigger asChild>
									<Button className="btn-primary">Add Admin Role to Existing User</Button>
								</DialogTrigger>
							</AdminUpdateDialog>
						)}
					</div>

					<div className="container mx-auto [&_table_tr:hover]:bg-background-light [&_table_th:hover]:bg-background-light border border-[border-muted/50] p-1 rounded-lg shadow-md">
						<Table className="bg-background-light rounded-t-md overflow-hidden">
							<TableHeader className="bg-background-dark">
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead
												key={header.id}
												className="text-bold"
												style={
													// this sets the width for an avatar image column header, keeping the size consistent
													// across all DataTable flavors, browser window widths, and devices.
													header.column.id === "userPhoto"
														? { width: "35px", minWidth: "35px" }
														: {}
												}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className={cell.column.id === "userPhoto" ? "p-0 mx-auto" : ""}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="flex flex-col items-start gap-2 sm:items-center sm:flex-row justify-between p-2 bg-background-dark rounded-b-md">
							{/* LEFT — Rows per page */}
							<div>
								<Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
									<SelectTrigger className="w-[120px] bg-background-light text-sm">
										<SelectValue placeholder={`Show ${pageSize}`} />
									</SelectTrigger>
									<SelectContent position="popper" className="bg-background-light">
										{[5, 10, 15, 20, 50, 100].map((size) => (
											<SelectItem key={size} value={size.toString()}>
												Show {size}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* CENTER — Page info + Go to page */}
							<div className="flex items-center gap-2 text-sm">
								<span>
									Page <strong>{pageIndex + 1}</strong> of {pageCount.toLocaleString()}
								</span>
								<span>| Go to:</span>
								<Input
									type="number"
									min={1}
									max={pageCount}
									defaultValue={pageIndex + 1}
									onChange={(e) => {
										const page = e.target.value ? Number(e.target.value) - 1 : 0;
										table.setPageIndex(page);
									}}
									className="w-16 h-8 text-center border rounded bg-background-light text-sm"
								/>
							</div>

							{/* RIGHT — Navigation */}
							<div className="flex items-center gap-1">
								<Button
									size="sm"
									variant="outline"
									onClick={() => table.firstPage()}
									disabled={!table.getCanPreviousPage()}
									className="border rounded p-1 bg-background-light text-sm"
								>
									<ChevronsLeft className="h-4 w-4" />
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
									className="border rounded py-1 px-2 bg-background-light text-sm"
								>
									Prev
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
									className="border rounded py-1 px-2 bg-background-light text-sm"
								>
									Next
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => table.lastPage()}
									disabled={!table.getCanNextPage()}
									className="border rounded p-1 bg-background-light text-sm"
								>
									<ChevronsRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</>
			) : (
				loadingOrNone
			)}
			{dialog}
		</div>
	);
}
