import DashboardCard from "./DashboardCard";
import { TotalsMiniTableRow } from "./TotalsMiniTable";
import { useEffect, useState } from "react";
import { useDateRange } from "./DateRangeProvider";
import { getLocalDateRange, useAggregateQuery } from "@/lib/utils";
import DashboardCardContent from "./DashboardCardContent";
import { DateRangePreset } from "@/types";
import { ProvidedServiceResponse } from "@/lib/db/queries";

export default function ProvidedServicesCard() {
	const { selectedPreset: globalPreset } = useDateRange();
	const [selectedRange, setSelectedRange] = useState<DateRangePreset>("lastMonth");
	const [effectiveRange, setEffectiveRange] = useState(() => getLocalDateRange(selectedRange));

	// Sync with global preset when global changes
	useEffect(() => setSelectedRange(globalPreset), [globalPreset]);
	useEffect(() => setEffectiveRange(getLocalDateRange(selectedRange)), [selectedRange]);

	const query = useAggregateQuery<ProvidedServiceResponse>("providedServices", effectiveRange);
	const rows = query.data?.rows ?? [];
	const total = query.data?.total ?? 0;

	const pieData: TotalsMiniTableRow[] = rows.map((r) => ({
		label: r.name ?? "Unknown",
		value: r.cnt,
	}));

	return (
		<DashboardCard loading={query.isLoading}>
			<DashboardCardContent
				title="Provided Services"
				total={total}
				tableHeaders={["Service", "Count"]}
				effectiveRange={effectiveRange}
				isLoading={query.isLoading}
				pieData={pieData}
				selectedRange={selectedRange}
				setSelectedRange={setSelectedRange}
			/>
		</DashboardCard>
	);
}
