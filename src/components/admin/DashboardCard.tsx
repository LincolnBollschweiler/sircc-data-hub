"use client";
import React from "react";

export default function DashboardCard({
	loading,
	children,
	minHeight = "h-64",
}: {
	loading?: boolean;
	children?: React.ReactNode;
	minHeight?: string;
}) {
	return (
		<div className="bg-card rounded-lg shadow-sm border p-4 flex flex-col">
			<div className={`flex-1 ${minHeight} min-h-[12rem]`}>
				{loading ? <div className="animate-pulse w-full h-full rounded bg-background" /> : children}
			</div>
		</div>
	);
}
