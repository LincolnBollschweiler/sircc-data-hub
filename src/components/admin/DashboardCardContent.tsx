import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DateRangePreset } from "../providers/DateRangeProvider";
import TotalsMiniTable, { TotalsMiniTableRow } from "./TotalsMiniTable";
import { useEffect, useState } from "react";
import { dateOptions } from "@/utils/constants";

const COLORS = ["#0EA5E9", "#06B6D4", "#7C3AED", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899"];

export default function DashboardCardContent({
	title,
	total,
	isLoading,
	tableHeaders,
	effectiveRange,
	pieData,
	selectedRange,
	setSelectedRange,
	omitColumns = [],
}: {
	title: string;
	total: number;
	isLoading: boolean;
	tableHeaders: string[];
	effectiveRange: { start: string | null; end: string | null };
	pieData: TotalsMiniTableRow[];
	selectedRange: DateRangePreset;
	setSelectedRange: React.Dispatch<React.SetStateAction<DateRangePreset>>;
	omitColumns?: string[];
}) {
	const [dateRange, setDateRange] = useState("");

	useEffect(() => {
		if (effectiveRange?.start && effectiveRange?.end) {
			if (
				effectiveRange.start === "2000-01-01T07:00:00.000Z" &&
				effectiveRange.end === "2200-01-01T07:00:00.000Z"
			) {
				setDateRange("All Time");
				return;
			}
			setDateRange(
				`${new Date(effectiveRange.start).toLocaleDateString("en-US", dateOptions)} thru ${new Date(
					effectiveRange.end
				).toLocaleDateString("en-US", dateOptions)}`
			);
		}
	}, [effectiveRange]);

	// Calculate height: one row ~2rem, plus a small buffer
	const maxVisibleRows = 15;
	// const rowHeight = 30; // px
	// const visibleRows = Math.min(pieData.length, maxVisibleRows);
	// const maxHeight = (1 + visibleRows) * rowHeight + 6;

	const HEADER_HEIGHT = 34;
	const ROW_HEIGHT = 30;
	const visibleRows = Math.min(pieData.length, maxVisibleRows);
	const maxHeight = HEADER_HEIGHT + visibleRows * ROW_HEIGHT;

	return (
		<>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">
					{title}
					{typeof total !== "undefined" && <span> &mdash; {total}</span>}
				</h2>

				<select
					value={selectedRange}
					onChange={(e) => setSelectedRange(e.target.value as DateRangePreset)}
					className={"border rounded-md px-3 py-1 text-sm"}
				>
					<option value="all">All Time</option>
					<option value="thisMonth">This Month</option>
					<option value="lastMonth">Last Month</option>
					<option value="thisQuarter">This Quarter</option>
					<option value="lastQuarter">Last Quarter</option>
					<option value="thisYear">This Year</option>
					<option value="lastYear">Last Year</option>
				</select>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{/* Table */}
				{/* <div className="overflow-auto border rounded p-1 pt-0" style={{ maxHeight: `${maxHeight}px` }}> */}
				<div className="overflow-auto border rounded p-1 pt-0" style={{ maxHeight }}>
					{isLoading ? (
						<div className="animate-pulse space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="h-6 bg-gray-300 rounded w-full" />
							))}
						</div>
					) : (
						<TotalsMiniTable rows={pieData} tableHeaders={tableHeaders} />
					)}
				</div>

				{/* Pie chart */}
				<div className="flex items-center justify-center">
					{isLoading && <div className="text-sm text-muted">Loading</div>}
					{!isLoading && pieData.length === 0 ? (
						<div className="h-full w-full flex flex-col items-center justify-center">
							<div className="mb-2 text-center text-sm">{dateRange}</div>
							<div className="text-sm text-muted">No data</div>
						</div>
					) : (
						<div className="h-full w-full flex flex-col items-center justify-center">
							<div className="mb-1 text-center text-sm">{dateRange}</div>
							<ResponsiveContainer width="100%" minHeight={220}>
								<PieChart>
									<Pie
										data={pieData.filter((row) => !omitColumns.includes(row.label))}
										dataKey="value"
										nameKey="label"
										outerRadius={80}
										label
									>
										{pieData.map((_, i) => (
											<Cell key={i} fill={COLORS[i % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
