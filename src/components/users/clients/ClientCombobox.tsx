"use client";

import { useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, CircleHelp } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
	const [search, setSearch] = useState("");
	const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
	const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [highlightIndex, setHighlightIndex] = useState(-1);

	const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	const selected = props.items.find((i) => i.id === props.value);

	// Filter items by search (case-insensitive)
	const filteredItems = useMemo(
		() => props.items.filter((i) => i.name.toLowerCase().includes(search.trim().toLowerCase())),
		[props.items, search]
	);

	const handleMouseEnter = (id: string) => {
		const itemEl = itemRefs.current.get(id);
		if (itemEl) {
			const rect = itemEl.getBoundingClientRect();
			setHoverPos({ x: rect.right + 8, y: rect.top });
			setHoveredItemId(id);
		}
	};
	const handleMouseLeave = () => setHoveredItemId(null);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!filteredItems.length) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlightIndex((prev) => (prev + 1) % filteredItems.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
		} else if (e.key === "Enter" && highlightIndex >= 0) {
			e.preventDefault();
			const item = filteredItems[highlightIndex];
			props.onChange(item?.id === props.value ? null : item?.id || null);
			setOpen(false);
		}
	};

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
					<Command onKeyDown={handleKeyDown}>
						<CommandInput
							placeholder={`Search ${props.label.toLowerCase()}...`}
							value={search}
							onValueChange={(v) => {
								setSearch(v);
								setHighlightIndex(v ? 0 : -1); // reset highlight on search change
							}}
							className="h-9"
						/>
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup>
							{filteredItems.map((item, index) => (
								<div
									key={item.id}
									ref={(el) => {
										if (el) itemRefs.current.set(item.id, el);
									}}
									className="relative flex items-center w-full group"
								>
									<CommandItem
										value={item.name}
										onSelect={() => {
											const itemId = filteredItems[index]?.id;
											if (!itemId) return;
											props.onChange(itemId === props.value ? null : itemId);
											setOpen(false);
										}}
										className={cn(
											"flex items-center w-full pl-6 text-sm",
											index === highlightIndex &&
												highlightIndex >= 0 &&
												"bg-muted text-muted-foreground",
											props.value === item.id && "bg-primary text-primary-foreground"
										)}
									>
										<span className="flex-1">{item.name}</span>
										{props.value === item.id && <Check className="ml-auto h-4 w-4" />}
									</CommandItem>

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
		</div>
	);
}
