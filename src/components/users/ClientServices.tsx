"use client";

import { ClientFull } from "@/userInteractions/db";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClientServiceList } from "@/tableInteractions/db";
import { set } from "zod";
import { Client } from "@clerk/nextjs/server";

export default function ClientServices({
	client,
	clientServices,
	services,
}: {
	client: ClientFull["client"];
	clientServices: ClientFull["clientService"][];
	services: ClientServiceList[];
}) {
	const [open, setOpen] = useState(false);
	const [serviceValue, setServiceValue] = useState<string | null>(null);
	const [newServiceVisible, setNewServiceVisible] = useState(false);

	const handleAddService = () => {
		setNewServiceVisible(!newServiceVisible);
	};

	return (
		<div className="mt-6">
			{client && <h2 className="text-2xl font-semibold mb-4">Services for Client ID: {client.id}</h2>}
			<Button onClick={handleAddService}>Add Service</Button>
			{newServiceVisible && (
				<div>
					<p>Service addition form goes here.</p>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={open}
								className="w-[200px] justify-between"
							>
								{serviceValue
									? services.find((s) => s?.id === serviceValue)
										? `${services.find((s) => s?.id === serviceValue)?.name}`
										: "Select Service"
									: "Select Service"}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search service..." />
								<CommandEmpty>No service found.</CommandEmpty>
								<CommandGroup>
									{services.map((service) => (
										<CommandItem
											key={service?.id}
											onSelect={(currentValue) => {
												setServiceValue(currentValue === serviceValue ? null : currentValue);
												setOpen(false);
											}}
											className="text-sm"
											value={service?.id}
										>
											{service?.name}
											{serviceValue === service?.id && <Check className="ml-auto h-4 w-4" />}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
			)}
			{/* <h2 className="text-2xl font-semibold mb-4">Client Services</h2>
			{clientServices.length === 0 ? (
				<p>This client has no services assigned.</p>
			) : (
				<ul className="list-disc list-inside">
					{clientServices.map((clientService) => {
						const service = services.find((s) => s.id === clientService.serviceId);
						return (
							<li key={clientService.id} className="mb-2">
								<strong>{service ? service.name : "Unknown Service"}</strong>
								{clientService.startDate && (
									<span> - Started on: {new Date(clientService.startDate).toLocaleDateString()}</span>
								)}
								{clientService.endDate && (
									<span> - Ended on: {new Date(clientService.endDate).toLocaleDateString()}</span>
								)}
							</li>
						);
					})}
				</ul>
			)} */}
		</div>
	);
}
