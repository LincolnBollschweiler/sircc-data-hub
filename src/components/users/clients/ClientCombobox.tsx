"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, CircleHelp } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createPortal } from "react-dom";

type ClientComboboxProps<T extends { id: string; name: string; description?: string | null }> = {
	label: string;
	items: T[];
	value: string | null;
	onChange: (v: string | null) => void;
};

export function ClientCombobox<T extends { id: string; name: string; description?: string | null }>(
	props: ClientComboboxProps<T>
) {
	const [open, setOpen] = useState(false);
	const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
	const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

	const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	const selected = props.items.find((i) => i.id === props.value);

	const handleMouseEnter = (id: string) => {
		const itemEl = itemRefs.current.get(id);
		if (itemEl) {
			const rect = itemEl.getBoundingClientRect();
			setHoverPos({ x: rect.right + 8, y: rect.top });
			setHoveredItemId(id);
		}
	};

	const handleMouseLeave = () => setHoveredItemId(null);

	return (
		<div className="w-[60%]">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
						{selected ? selected.name : props.label}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-[200px] p-0 relative">
					<Command>
						<CommandInput placeholder={`Search ${props.label.toLowerCase()}...`} />
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup>
							{props.items.map((item) => (
								<div
									key={item.id}
									ref={(el) => {
										if (el) {
											itemRefs.current.set(item.id, el);
										}
									}}
									className="relative flex items-center w-full group"
								>
									{/* CommandItem */}
									<CommandItem
										value={item.id}
										onSelect={(v) => {
											props.onChange(v === props.value ? null : v);
											setOpen(false);
										}}
										className="flex items-center w-full pl-6 text-sm"
									>
										<span className="flex-1">{item.name}</span>
										{props.value === item.id && <Check className="ml-auto h-4 w-4" />}
									</CommandItem>

									{/* Hover Icon (inline with flex, inside the row) */}
									{item.description && (
										<div
											className="absolute left-1 top-1/2 -translate-y-1/2 z-50 cursor-pointer"
											onMouseEnter={() => handleMouseEnter(item.id)}
											onMouseLeave={handleMouseLeave}
										>
											<CircleHelp className="h-4 w-4 text-muted-foreground" />
										</div>
									)}
								</div>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>

			{/* Free-floating hover description */}
			{hoveredItemId &&
				createPortal(
					<div
						className="z-50 max-w-xs p-2 bg-background border rounded shadow text-sm pointer-events-none"
						style={{
							position: "fixed",
							top: hoverPos.y,
							left: hoverPos.x,
						}}
					>
						{props.items.find((i) => i.id === hoveredItemId)?.description}
					</div>,
					document.body
				)}

			{/* {hoveredItemId && (
				<div
					className="fixed z-50 max-w-xs p-2 bg-background border rounded shadow text-sm pointer-events-none"
					style={{
						top: hoverPos.y,
						left: hoverPos.x,
					}}
				>
					{props.items.find((i) => i.id === hoveredItemId)?.description}
				</div>
			)} */}
		</div>
	);
}
