"use client";
import { ClientFull } from "@/userInteractions/db";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { updateClientsCoach } from "@/userInteractions/actions";
import { actionToast } from "@/hooks/use-toast";

export const ClientCoach = ({
	client,
	allCoaches,
}: {
	client: ClientFull["client"];
	allCoaches: ClientFull["coach"][];
}) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string | null>(client ? client.coachId : null);

	const updateCoach = async (newCoachId: string | null) => {
		const action = updateClientsCoach.bind(null, client?.id ?? null);
		const actionData = await action(newCoachId);
		if (actionData) {
			setValue(newCoachId);
			actionToast({ actionData });
		}
	};

	return (
		<div className="mt-4">
			<h2 className="text-xl font-semibold mb-2">Assigned Coach</h2>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between"
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
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search coach..." />
						<CommandEmpty>No coach found.</CommandEmpty>
						<CommandGroup>
							{allCoaches.map((coach) => (
								<CommandItem
									key={coach?.id}
									onSelect={(currentValue) => {
										updateCoach(currentValue === value ? null : currentValue);
										setOpen(false);
									}}
									className="text-sm"
									value={coach?.id}
								>
									{coach?.firstName} {coach?.lastName}
									{value === coach?.id && <Check className="ml-auto h-4 w-4" />}
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};
