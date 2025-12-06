"use client";

import DashboardCard from "./DashboardCard";
import { TotalsMiniTableRow } from "./TotalsMiniTable";
import { useEffect, useState } from "react";
import { useDateRange } from "../providers/DateRangeProvider"; // ✅ global provider
import DashboardCardContent from "./DashboardCardContent";
import { getLocalDateRange, useAggregateQuery } from "@/lib/utils";
import { DateRangePreset } from "@/types";
import { ReferredOutResponse } from "@/lib/db/queries";

export default function ReferredOutCard() {
	const { selectedPreset: globalPreset } = useDateRange();
	const [selectedRange, setSelectedRange] = useState<DateRangePreset>("lastMonth");
	const [effectiveRange, setEffectiveRange] = useState(() => getLocalDateRange(selectedRange));

	// Sync with global preset when global changes
	useEffect(() => setSelectedRange(globalPreset), [globalPreset]);
	useEffect(() => setEffectiveRange(getLocalDateRange(selectedRange)), [selectedRange]);

	const query = useAggregateQuery<ReferredOutResponse>("referredOut", effectiveRange);
	const rows = query.data?.rows ?? [];
	const total = query.data?.total ?? 0;

	const pieData: TotalsMiniTableRow[] = rows.map((r) => ({
		label: r.name ?? "Unknown",
		value: r.cnt,
	}));

	return (
		<DashboardCard loading={query.isLoading}>
			<DashboardCardContent
				title="Referred Out"
				total={total}
				tableHeaders={["To", "Count"]}
				effectiveRange={effectiveRange}
				selectedRange={selectedRange}
				setSelectedRange={setSelectedRange}
				pieData={pieData}
				isLoading={query.isLoading}
			/>
		</DashboardCard>
	);
}
