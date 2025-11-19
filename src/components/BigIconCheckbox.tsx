"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BigIconCheckbox({
	// add an opitonal noHover prop to disable hover effects
	checked: controlled,
	defaultChecked,
	onChange,
	noHover = false,
	size = 28,
}: {
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	noHover?: boolean;
	size?: number;
}) {
	const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);
	const checked = controlled ?? uncontrolled;

	const toggle = () => {
		const next = !checked;
		setUncontrolled(next);
		onChange?.(next);
	};

	return (
		<button
			onClick={toggle}
			type="button"
			aria-pressed={checked}
			className={cn(
				"flex items-center justify-center rounded-md p-1 transition-colors select-none",
				noHover ? "cursor-default" : "cursor-pointer"
			)}
			style={{ width: size + 8, height: size + 8 }}
		>
			{checked ? (
				<Check style={{ width: size, height: size }} className="text-success" />
			) : (
				<X style={{ width: size, height: size }} className="text-danger" />
			)}

			{/* Hidden real checkbox for accessibility */}
			<input type="checkbox" checked={checked} onChange={() => {}} className="hidden" />
		</button>
	);
}
