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

export const useDateRange = () => {
	const ctx = useContext(DateRangeContext);
	if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
	return ctx;
};

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
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
};
