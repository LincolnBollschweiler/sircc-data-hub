"use client";

import { ClientFull } from "@/userInteractions/db";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClientService, Location, ReferralSource, Site } from "@/tableInteractions/db";

export default function ClientServices({
	client,
	// clientServices,
	services,
	locations,
	referralSources,
	sites,
}: {
	client: ClientFull["client"];
	// clientServices: ClientFull["clientService"][];
	services: ClientService[];
	locations: Location[];
	referralSources: ReferralSource[];
	sites: Site[];
}) {
	const [serviceOpen, setServiceOpen] = useState(false);
	const [serviceValue, setServiceValue] = useState<string | null>(null);

	const [locationOpen, setLocationOpen] = useState(false);
	const [locationValue, setLocationValue] = useState<string | null>(null);

	const [referralSourceOpen, setReferralSourceOpen] = useState(false);
	const [referralSourceValue, setReferralSourceValue] = useState<string | null>(null);

	const [siteOpen, setSiteOpen] = useState(false);
	const [siteValue, setSiteValue] = useState<string | null>(null);

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
					<Popover open={serviceOpen} onOpenChange={setServiceOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={serviceOpen}
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
												setServiceOpen(false);
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
					<Popover open={locationOpen} onOpenChange={setLocationOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={locationOpen}
								className="w-[200px] justify-between mt-4"
							>
								{locationValue
									? locations.find((l) => l?.id === locationValue)
										? `${locations.find((l) => l?.id === locationValue)?.name}`
										: "Select Location"
									: "Select Location"}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search location..." />
								<CommandEmpty>No location found.</CommandEmpty>
								<CommandGroup>
									{locations.map((location) => (
										<CommandItem
											key={location?.id}
											onSelect={(currentValue) => {
												setLocationValue(currentValue === locationValue ? null : currentValue);
												setLocationOpen(false);
											}}
											className="text-sm"
											value={location?.id}
										>
											{location?.name}
											{locationValue === location?.id && <Check className="ml-auto h-4 w-4" />}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
					<Popover open={referralSourceOpen} onOpenChange={setReferralSourceOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={referralSourceOpen}
								className="w-[200px] justify-between mt-4"
							>
								{referralSourceValue
									? referralSources.find((r) => r?.id === referralSourceValue)
										? `${referralSources.find((r) => r?.id === referralSourceValue)?.name}`
										: "Select Referral Source"
									: "Select Referral Source"}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search referral source..." />
								<CommandEmpty>No referral source found.</CommandEmpty>
								<CommandGroup>
									{referralSources.map((referralSource) => (
										<CommandItem
											key={referralSource?.id}
											onSelect={(currentValue) => {
												setReferralSourceValue(
													currentValue === referralSourceValue ? null : currentValue
												);
												setReferralSourceOpen(false);
											}}
											className="text-sm"
											value={referralSource?.id}
										>
											{referralSource?.name}
											{referralSourceValue === referralSource?.id && (
												<Check className="ml-auto h-4 w-4" />
											)}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
					<Popover open={siteOpen} onOpenChange={setSiteOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={siteOpen}
								className="w-[200px] justify-between mt-4"
							>
								{siteValue
									? sites.find((s) => s?.id === siteValue)
										? `${sites.find((s) => s?.id === siteValue)?.name}`
										: "Select Site"
									: "Select Site"}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandInput placeholder="Search site..." />
								<CommandEmpty>No site found.</CommandEmpty>
								<CommandGroup>
									{sites.map((site) => (
										<CommandItem
											key={site?.id}
											onSelect={(currentValue) => {
												setSiteValue(currentValue === siteValue ? null : currentValue);
												setSiteOpen(false);
											}}
											className="text-sm"
											value={site?.id}
										>
											{site?.name}
											{siteValue === site?.id && <Check className="ml-auto h-4 w-4" />}
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
