"use client";

import DashboardCard from "./DashboardCard";
import { TotalsMiniTableRow } from "./TotalsMiniTable";
import { useEffect, useState } from "react";
import { useDateRange } from "./DateRangeProvider"; // ✅ global provider
import DashboardCardContent from "./DashboardCardContent";
import { getLocalDateRange, useAggregateQuery } from "@/lib/utils";
import { DateRangePreset } from "@/types";
import { CoachResponse } from "@/lib/db/queries";

export default function CoachCard() {
	const { selectedPreset: globalPreset } = useDateRange();
	const [selectedRange, setSelectedRange] = useState<DateRangePreset>("lastMonth");
	const [effectiveRange, setEffectiveRange] = useState(() => getLocalDateRange(selectedRange));

	// Sync with global preset when global changes
	useEffect(() => setSelectedRange(globalPreset), [globalPreset]);
	useEffect(() => setEffectiveRange(getLocalDateRange(selectedRange)), [selectedRange]);

	const query = useAggregateQuery<CoachResponse>("coach", effectiveRange);
	const rows = query.data?.rows ?? [];
	const total = query.data?.total ?? 0;

	const pieData: TotalsMiniTableRow[] = rows.map((r) => ({
		label: r.name ?? "Unknown",
		value: r.cnt ? Number(r.cnt) : 0,
	}));

	return (
		<DashboardCard loading={query.isLoading} minHeight="h-[300px]">
			<DashboardCardContent
				title="Coach Total Hours"
				total={total}
				tableHeaders={["Type", "Total"]}
				selectedRange={selectedRange}
				setSelectedRange={setSelectedRange}
				pieData={pieData}
				isLoading={query.isLoading}
				omitColumns={["Mileage"]}
			/>
		</DashboardCard>
	);
}
