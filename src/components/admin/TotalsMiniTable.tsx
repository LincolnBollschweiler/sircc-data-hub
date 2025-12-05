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
		return <div className="text-sm text-muted m-1">No data</div>;
	}

	// Sort descending by value
	const sortedRows = [...rows].sort((a, b) => b.value - a.value);

	return (
		<table className="w-full text-left text-sm relative">
			<thead className="sticky top-0 bg-background-light text-[1.05em] border-b-2 border-border">
				<tr>
					<th className="py-1 font-semibold">{tableHeaders[0]}</th>
					<th className="py-1 font-semibold text-right">{tableHeaders[1]}</th>
				</tr>
			</thead>
			<tbody>
				{sortedRows.map((r, idx) => (
					<tr key={idx} className="border-t border-border">
						<td className="py-1">{r.label}</td>
						<td className="py-1 text-right">{r.value}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
