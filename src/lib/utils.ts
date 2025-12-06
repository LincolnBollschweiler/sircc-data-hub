import { DateRangePreset } from "@/components/providers/DateRangeProvider";
import { useQuery } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import {
	endOfMonth,
	endOfQuarter,
	endOfYear,
	startOfMonth,
	startOfQuarter,
	startOfYear,
	subMonths,
	subQuarters,
	subYears,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getLocalDateRange = (selectedRange: DateRangePreset) => {
	const today = new Date();
	let start: Date | null = null;
	let end: Date | null = null;

	switch (selectedRange) {
		case "thisMonth":
			start = startOfMonth(today);
			end = endOfMonth(today);
			break;
		case "lastMonth":
			start = startOfMonth(subMonths(today, 1));
			end = endOfMonth(subMonths(today, 1));
			break;
		case "thisQuarter":
			start = startOfQuarter(today);
			end = endOfQuarter(today);
			break;
		case "lastQuarter":
			start = startOfQuarter(subQuarters(today, 1));
			end = endOfQuarter(subQuarters(today, 1));
			break;
		case "thisYear":
			start = startOfYear(today);
			end = endOfYear(today);
			break;
		case "lastYear":
			start = startOfYear(subYears(today, 1));
			end = endOfYear(subYears(today, 1));
			break;
		case "all":
			start = new Date("01-01-2000"); // Min Date
			end = new Date("01-01-2200"); // Max Date
			break;
		default:
			start = null;
			end = null;
			break;
	}

	return { start: start ? start.toISOString() : null, end: end ? end.toISOString() : null };
};

export function useAggregateQuery<Response extends { rows: unknown[]; total: number }>(
	metric: string,
	effectiveRange: { start?: string | null; end?: string | null }
) {
	return useQuery<Response>({
		queryKey: [metric, effectiveRange.start, effectiveRange.end],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (effectiveRange.start) params.set("start", effectiveRange.start);
			if (effectiveRange.end) params.set("end", effectiveRange.end);
			params.set("metric", metric);

			const res = await fetch(`/api/admin/aggregates?${params.toString()}`);
			if (!res.ok) throw new Error("Network error");

			return (await res.json()) as Response;
		},
	});
}
