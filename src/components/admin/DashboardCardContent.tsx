import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DateRangePreset } from "./DateRangeProvider";
import TotalsMiniTable, { TotalsMiniTableRow } from "./TotalsMiniTable";

const COLORS = ["#0EA5E9", "#06B6D4", "#7C3AED", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899"];
export default function DashboardCardContent({
	title,
	total,
	isLoading,
	tableHeaders,
	pieData,
	selectedRange,
	setSelectedRange,
	omitColumns = [],
}: {
	title: string;
	total: number;
	isLoading: boolean;
	tableHeaders: string[];
	pieData: TotalsMiniTableRow[];
	selectedRange: DateRangePreset;
	setSelectedRange: React.Dispatch<React.SetStateAction<DateRangePreset>>;
	omitColumns?: string[];
}) {
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

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[240px]">
				{/* Table */}
				<div className="overflow-auto border rounded p-1">
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
					{isLoading || pieData.length === 0 ? (
						<div className="text-sm text-muted">Loading or no data</div>
					) : (
						<ResponsiveContainer width="100%">
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
					)}
				</div>
			</div>
		</>
	);
}
