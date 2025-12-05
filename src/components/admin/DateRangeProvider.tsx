// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import {
// 	startOfMonth,
// 	endOfMonth,
// 	startOfQuarter,
// 	endOfQuarter,
// 	startOfYear,
// 	endOfYear,
// 	subMonths,
// 	subQuarters,
// 	subYears,
// } from "date-fns";

// type DateRange = { start: string | null; end: string | null; preset?: DateRangePreset };
// export type DateRangePreset =
// 	| "all"
// 	| "thisMonth"
// 	| "lastMonth"
// 	| "thisQuarter"
// 	| "lastQuarter"
// 	| "thisYear"
// 	| "lastYear";

// type DateRangeContextType = {
// 	dateRange: DateRange;
// 	selectedPreset: DateRangePreset;
// 	setPreset: (preset: DateRangePreset) => void;
// };

// const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

// export function useDateRange() {
// 	const context = useContext(DateRangeContext);
// 	if (!context) {
// 		throw new Error("useDateRange must be used within a DateRangeProvider");
// 	}
// 	return context;
// }

// export function DateRangeProvider({ children }: { children: ReactNode }) {
// 	const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>("thisMonth");
// 	const [dateRange, setDateRange] = useState<DateRange>(() => {
// 		const today = new Date();
// 		const start = startOfMonth(today).toISOString();
// 		const end = endOfMonth(today).toISOString();
// 		return { start, end };
// 	});

// 	const setPreset = (preset: DateRangePreset) => {
// 		const today = new Date();
// 		let start: Date | null = null;
// 		let end: Date | null = null;

// 		switch (preset) {
// 			case "thisMonth":
// 				start = startOfMonth(today);
// 				end = endOfMonth(today);
// 				break;
// 			case "lastMonth":
// 				start = startOfMonth(subMonths(today, 1));
// 				end = endOfMonth(subMonths(today, 1));
// 				break;
// 			case "thisQuarter":
// 				start = startOfQuarter(today);
// 				end = endOfQuarter(today);
// 				break;
// 			case "lastQuarter":
// 				start = startOfQuarter(subQuarters(today, 1));
// 				end = endOfQuarter(subQuarters(today, 1));
// 				break;
// 			case "thisYear":
// 				start = startOfYear(today);
// 				end = endOfYear(today);
// 				break;
// 			case "lastYear":
// 				start = startOfYear(subYears(today, 1));
// 				end = endOfYear(subYears(today, 1));
// 				break;
// 			default:
// 				start = null;
// 				end = null;
// 				break;
// 		}

// 		setSelectedPreset(preset);
// 		setDateRange({
// 			start: start ? start.toISOString() : null,
// 			end: end ? end.toISOString() : null,
// 			preset,
// 		});
// 	};

// 	return (
// 		<DateRangeContext.Provider value={{ dateRange, selectedPreset, setPreset }}>
// 			{children}
// 		</DateRangeContext.Provider>
// 	);
// }

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type DateRangePreset =
	| "all"
	| "thisMonth"
	| "lastMonth"
	| "thisQuarter"
	| "lastQuarter"
	| "thisYear"
	| "lastYear";

type DateRangeContextType = {
	selectedPreset: DateRangePreset;
	setPreset: (preset: DateRangePreset) => void;
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function useDateRange() {
	const ctx = useContext(DateRangeContext);
	if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
	return ctx;
}

export function DateRangeProvider({ children }: { children: ReactNode }) {
	const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>("lastMonth");

	return (
		<DateRangeContext.Provider
			value={{
				selectedPreset,
				setPreset: setSelectedPreset,
			}}
		>
			{children}
		</DateRangeContext.Provider>
	);
}
