"use client";
import { ClientFull } from "@/userInteractions/db";
import { useState, useRef, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { updateClientsCoach } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";

export const ClientCoach = ({
	client,
	allCoaches,
	coachIsViewing,
}: {
	client: ClientFull["client"];
	allCoaches: ClientFull["coach"][];
	coachIsViewing?: boolean;
}) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string | null>(client ? client.coachId : null);
	const [search, setSearch] = useState("");
	const [highlightIndex, setHighlightIndex] = useState(-1);

	const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	const filteredCoaches = useMemo(
		() =>
			allCoaches.filter((c) =>
				`${c?.firstName} ${c?.lastName}`.toLowerCase().includes(search.trim().toLowerCase())
			),
		[allCoaches, search]
	);

	const updateCoach = async (newCoachId: string | null) => {
		const action = updateClientsCoach.bind(null, client?.id ?? null);
		const actionData = await action(newCoachId);
		if (actionData) {
			setValue(newCoachId);
			actionToast({ actionData });
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!filteredCoaches.length) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlightIndex((prev) => (prev + 1) % filteredCoaches.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightIndex((prev) => (prev - 1 + filteredCoaches.length) % filteredCoaches.length);
		} else if (e.key === "Enter" && highlightIndex >= 0) {
			e.preventDefault();
			const coach = filteredCoaches[highlightIndex];
			updateCoach(coach?.id === value ? null : coach?.id || null);
			setOpen(false);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<h2 className="font-semibold m-0 underline">Assigned Coach</h2>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between"
						disabled={coachIsViewing}
					>
						{value
							? allCoaches.find((c) => c?.id === value)
								? `${allCoaches.find((c) => c?.id === value)?.firstName} ${
										allCoaches.find((c) => c?.id === value)?.lastName
								  }`
								: "Not Assigned"
							: "Not Assigned"}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0 m-0">
					<Command onKeyDown={handleKeyDown}>
						<CommandInput
							placeholder="Search coach..."
							value={search}
							onValueChange={(v) => setSearch(v)}
							className="h-9"
						/>
						<CommandEmpty>No coach found.</CommandEmpty>
						<CommandGroup>
							{filteredCoaches.map((coach, index) => (
								<div
									key={coach?.id}
									ref={(el) => {
										if (el) itemRefs.current.set(coach?.id || "", el);
									}}
									className="relative flex items-center w-full group"
								>
									<CommandItem
										value={`${coach?.firstName} ${coach?.lastName}`}
										onSelect={() => {
											const coachId = coach?.id;
											if (!coachId) return;
											updateCoach(coachId === value ? null : coachId);
											setOpen(false);
										}}
										className={`flex items-center w-full pl-2 text-sm ${
											index === highlightIndex ? "bg-muted text-muted-foreground" : ""
										} ${value === coach?.id ? "bg-primary text-primary-foreground" : ""}`}
									>
										{coach?.firstName} {coach?.lastName}
										{value === coach?.id && <Check className="ml-auto h-4 w-4" />}
									</CommandItem>
								</div>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};
