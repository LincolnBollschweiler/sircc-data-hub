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
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "../ui/input";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const PAGE_SIZE_KEY = "datatable_page_size";
const USER_SITE_ID = "global_user_site_id";

export default function DataTable<TData, TValue>({
	columns,
	data,
	sites,
}: DataTableProps<TData, TValue> & { sites: { id: string; name: string }[] }) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageSize, setPageSize] = useState<number>(() => {
		// Load from localStorage on first render (client only)
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem(PAGE_SIZE_KEY);
			return saved ? Number(saved) : 10;
		}
		return 10;
	});

	const [siteId, setSiteId] = useState("all");
	const [loadinOrNone, setLoadingOrNone] = useState((<div></div>) as React.ReactNode);

	useEffect(() => {
		const saved = localStorage.getItem(USER_SITE_ID);
		handleSiteChange(saved || "all");
	}, []);

	const handleSiteChange = async (value: string) => {
		console.log("Site changed to:", value);
		setSiteId(value);
		localStorage.setItem(USER_SITE_ID, value);
		const filteredData =
			value === "all"
				? data
				: value === "none"
				? data.filter((item: any) => !item.siteId)
				: data.filter((item: any) => item.siteId === value);
		setSiteFilteredData(filteredData);
		if (filteredData.length === 0) {
			setLoadingOrNone(<div className="w-full text-center p-20">No matching applicants</div>);
		} else {
			setLoadingOrNone(null);
		}
	};

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [siteFilteredData, setSiteFilteredData] = useState<TData[]>([]);
	const table = useReactTable({
		data: siteFilteredData,
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
		localStorage.setItem(PAGE_SIZE_KEY, value);
		table.setPageSize(newSize);
	};

	// Sync table state if user has a cached size
	useEffect(() => {
		table.setPageSize(pageSize);
	}, [pageSize, table]);

	return (
		<>
			<div className="flex flex-wrap gap-1 items-center justify-between my-1">
				<Select onValueChange={handleSiteChange} value={siteId}>
					<SelectTrigger className="w-[140px] text-primary-foreground bg-primary">
						<SelectValue placeholder="Select a site" />
					</SelectTrigger>
					<SelectContent>
						{[
							<SelectItem key="all" value={"all"}>
								All Sites
							</SelectItem>,
							<SelectItem key="none" value={"none"}>
								No Site
							</SelectItem>,
							...sites.map((site) => (
								<SelectItem key={site.id} value={site.id ?? ""}>
									{site.name}
								</SelectItem>
							)),
						]}
					</SelectContent>
				</Select>
				<div className="flex flex-wrap sm:flex-nowrap gap-1 items-center">
					<Input
						className="max-w-sm text-primary-foreground bg-primary"
						placeholder={`Search by Name...`}
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
					/>
					<Input
						className="max-w-sm text-primary-foreground bg-primary"
						placeholder="Search all columns..."
						value={globalFilter ?? ""}
						onChange={(e) => setGlobalFilter(e.target.value)}
					/>
				</div>
			</div>
			{siteFilteredData.length > 0 ? (
				<div className="container mx-auto [&_table_tr:hover]:bg-background-light [&_table_th:hover]:bg-background-light border border-[border-muted/50] p-1 rounded-lg shadow-md">
					<Table className="bg-background-light rounded-t-md overflow-hidden">
						<TableHeader className="bg-background-dark">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id} className="text-bold">
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
										<TableCell key={cell.id}>
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
									{[5, 10, 20, 30, 40, 50].map((size) => (
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
			) : (
				loadinOrNone
			)}
		</>
	);
}
