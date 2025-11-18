"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";

export default function BigIconCheckbox({
	checked: controlled,
	defaultChecked,
	onChange,
	size = 28,
}: {
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
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
			className="flex items-center justify-center rounded-md p-1 transition-colors cursor-pointer select-none"
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
