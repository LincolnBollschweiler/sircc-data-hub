"use client";

export type TotalsMiniTableRow = {
	label: string;
	value: number;
};

type TotalsMiniTableProps = {
	rows: TotalsMiniTableRow[];
	maxVisibleRows?: number; // number of rows before scrolling
	loading?: boolean;
	tableHeaders: string[];
};

export default function TotalsMiniTable({
	rows,
	tableHeaders = ["Label", "Value"],
	maxVisibleRows = 15,
	loading = false,
}: TotalsMiniTableProps) {
	if (loading) {
		return (
			<div className="space-y-1 animate-pulse">
				{Array.from({ length: maxVisibleRows }).map((_, i) => (
					<div key={i} className="h-5 bg-muted rounded w-full" />
				))}
			</div>
		);
	}

	if (rows.length === 0) {
		return <div className="text-sm text-muted">No data</div>;
	}

	// Sort descending by value
	const sortedRows = [...rows].sort((a, b) => b.value - a.value);

	// Calculate height: one row ~2rem, plus a small buffer
	const rowHeight = 32; // px
	const visibleRows = Math.min(sortedRows.length, maxVisibleRows);
	const tableHeight = visibleRows * rowHeight;

	return (
		<div style={{ maxHeight: `${tableHeight}px` }}>
			<table className="w-full text-left text-sm">
				<thead>
					<tr>
						<th className="pb-1 font-semibold">{tableHeaders[0]}</th>
						<th className="pb-1 font-semibold text-right">{tableHeaders[1]}</th>
					</tr>
				</thead>
				<tbody>
					{sortedRows.map((r, idx) => (
						<tr key={idx} className="border-t border-border">
							<td className="py-1">{r.label}</td>
							<td className="py-1 text-right font-semibold">{r.value}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
