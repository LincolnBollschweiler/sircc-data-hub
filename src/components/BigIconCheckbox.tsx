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
	size = 30,
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
				"flex items-center justify-center rounded-md transition-colors select-none border border-transparent hover:border-[#888]",
				noHover ? "cursor-default" : "cursor-pointer"
			)}
			style={{ width: size + 4, height: size + 4 }} // ← reduced padding distance
		>
			{checked ? (
				<Check style={{ width: size, height: size }} className="text-success" />
			) : (
				<X style={{ width: size, height: size }} className="text-danger" />
			)}

			<input type="checkbox" checked={checked} onChange={() => {}} className="hidden" />
		</button>
	);
}
