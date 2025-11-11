"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export function ApplyUserTheme({ userTheme }: { userTheme?: string | undefined }) {
	const { theme, setTheme } = useTheme();
	const hasRun = useRef(false);

	useEffect(() => {
		// Only set the initial theme once on first mount
		if (!hasRun.current && userTheme && userTheme !== theme) {
			setTheme(userTheme);
			hasRun.current = true;
		}
	}, [userTheme, theme, setTheme]);

	return null;
}
