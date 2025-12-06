"use client";

import { useDateRange, DateRangePreset } from "../providers/DateRangeProvider";

export default function GlobalDateRangeSelector() {
	const { selectedPreset, setPreset } = useDateRange();

	return (
		<div className="flex items-center gap-2 mb-4">
			<label className="font-semibold">Date Range:</label>
			<select
				value={selectedPreset}
				onChange={(e) => setPreset(e.target.value as DateRangePreset)}
				className="border rounded-md px-3 py-1 text-sm"
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
	);
}
