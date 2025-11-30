"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { coachSchema } from "@/userInteractions/schema";
import { updateCoachDetails } from "@/userInteractions/actions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CoachUpdate } from "@/userInteractions/db";
import { trimStrings } from "@/utils/trim";

export default function ClientUserForm({
	user,
	onSuccess,
}: {
	user: z.infer<typeof coachSchema> & { id: string };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof coachSchema>>({
		resolver: zodResolver(coachSchema),
		defaultValues: user,
	});

	const onSubmit = async (values: z.infer<typeof coachSchema>) => {
		values = trimStrings(values);
		const coachUpdate = {
			user: {
				phone: values.phone,
				address1: values.address1,
				address2: values.address2,
				city: values.city,
				state: values.state,
				zip: values.zip,
				role: values.role,
			},
			coach: {
				website: values.website,
				llc: values.llc,
				notes: values.notes,
			},
		} as CoachUpdate;

		const action = updateCoachDetails.bind(null, user.id);
		const actionData = await action(coachUpdate, user.role);
		if (actionData) actionToast({ actionData });

		if (!actionData?.error) onSuccess?.();
	};

	const roles = [
		{ id: "coach", name: "Coach" },
		{ id: "coach-staff", name: "Coach & Staff" },
		{ id: "coach-volunteer", name: "Coach & Volunteer" },
		{ id: "coach-staff-volunteer", name: "Coach & Staff & Volunteer" },
	];

	const [phone, setPhone] = useState(user?.phone || "");
	const updatePhone = (value: string) => {
		setPhone(value);
		form.setValue("phone", value);
	};

	const [mounted, setMounted] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null; // prevents hydration mismatch

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 flex-col">
				<FormField
					name="firstName"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<div className="flex items-center">
									<RequiredLabelIcon />
									<FormLabel className="w-[70px] text-nowrap">First Name</FormLabel>
								</div>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ""}
										readOnly={true}
										tabIndex={-1}
										onFocus={() => setFocusedField("firstName")}
										onBlur={() => setFocusedField(null)}
									/>
								</FormControl>
							</div>
							<FormMessage />
							{focusedField === "firstName" && (
								<FormDescription>
									User has a site login and must update their name through their profile settings.
								</FormDescription>
							)}
						</FormItem>
					)}
				/>
				<FormField
					name="lastName"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<div className="flex items-center">
									<RequiredLabelIcon />
									<FormLabel className="w-[70px] text-nowrap">Last Name</FormLabel>
								</div>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ""}
										readOnly={true}
										tabIndex={-1}
										onFocus={() => setFocusedField("lastName")}
										onBlur={() => setFocusedField(null)}
									/>
								</FormControl>
							</div>
							<FormMessage />
							{focusedField === "lastName" && (
								<FormDescription>
									User has a site login and must update their name through their profile settings.
								</FormDescription>
							)}
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ""}
										readOnly={true}
										tabIndex={-1}
										onFocus={() => setFocusedField("email")}
										onBlur={() => setFocusedField(null)}
									/>
								</FormControl>
							</div>
							<FormMessage />
							{focusedField === "email" && (
								<FormDescription>
									User has a site login and must update their email through their profile settings.
								</FormDescription>
							)}
						</FormItem>
					)}
				/>
				<div className="flex flex-col gap-1.5">
					<FormField
						control={form.control}
						name="address1"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Address</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ""}
										placeholder="Address Line 1 (optional)"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="address2"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ""}
										placeholder="Address Line 2 (optional)"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} value={field.value ?? ""} placeholder="City" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ""}
										placeholder="State (optional) e.g. ID"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="zip"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} value={field.value ?? ""} placeholder="Zip Code (optional)" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="phone"
					render={() => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="flex gap-0.5">
									<RequiredLabelIcon />
									Phone
								</FormLabel>
								<FormControl>
									<PhoneInput
										country="US"
										value={phone}
										onChange={(value) => updatePhone(value ?? "")}
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
									/>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-0.5">
									<RequiredLabelIcon />
									<FormLabel tabIndex={-1}>Assign Roles</FormLabel>
								</div>
								<FormControl>
									<RadioGroup
										tabIndex={-1}
										onValueChange={(value) => field.onChange(value)}
										value={field.value}
										className="grid grid-cols-1 sm:grid-cols-2 gap-2"
									>
										{roles.map((role) => (
											<label
												tabIndex={0}
												key={role.id}
												className={cn(
													"cursor-pointer select-none rounded-md border p-1 text-center text-sm font-medium shadow-sm transition-colors",
													field.value === role.id
														? "bg-primary text-primary-foreground border-primary"
														: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
												)}
												onKeyDown={(e) => {
													if (e.key === " " || e.key === "Enter") {
														e.preventDefault();
														const value = role.id;
														field.onChange(value);
													}
												}}
											>
												<RadioGroupItem value={role.id} className="hidden" />
												{role.name}
											</label>
										))}
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ""}
									onChange={(e) => field.onChange(e.target.value)}
									placeholder="Follow up notes... (1000 character max)"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="self-end gap-2 flex mt-1">
					<Button type="button" variant="destructiveOutline" onClick={() => onSuccess?.()}>
						Cancel
					</Button>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
}
