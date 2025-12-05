"use client";
import React from "react";

export default function DashboardCard({ loading, children }: { loading?: boolean; children?: React.ReactNode }) {
	return (
		<div className="bg-card rounded-lg shadow-sm border p-4 flex flex-col">
			<div className="">
				{loading ? (
					<div className="animate-pulse w-full h-full rounded bg-background min-h-[20rem]" />
				) : (
					children
				)}
			</div>
		</div>
	);
}
