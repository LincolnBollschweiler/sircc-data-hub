"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userSchema } from "@/userInteractions/schema";
import { createUser } from "@/userInteractions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function UserForm({ onSuccess }: { onSuccess?: () => void }) {
	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
	});

	const onSubmit = async (values: z.infer<typeof userSchema>) => {
		const action = createUser;
		const actionData = await action(values);
		if (actionData) {
			actionToast({ actionData });
			requestAnimationFrame(() => window.location.reload());
		}
	};

	const roles = [
		{ id: "client", name: "Client" },
		{ id: "volunteer", name: "Volunteer" },
		{ id: "client-volunteer", name: "Client-Volunteer" },
	];

	const [showReentryClientOption, setShowReentryClientOption] = useState(false);

	const [phone, setPhone] = useState("");
	const updatePhone = (value: string) => {
		setPhone(value);
		form.setValue("phone", value);
	};

	const [mounted, setMounted] = useState(false);

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
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
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
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
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
									<Input {...field} value={field.value ?? ""} placeholder="(optional)" />
								</FormControl>
							</div>
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
					name="birthMonth" // or any valid name just to get context
					render={() => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<div className="flex gap-0.5">
									<RequiredLabelIcon />
									<FormLabel>Birth Date</FormLabel>
								</div>
								<FormField
									control={form.control}
									name="birthMonth"
									render={({ field }) => (
										<FormItem className="flex-shrink-0">
											<FormControl>
												<Input
													type="number"
													min={1}
													max={12}
													placeholder="MM"
													{...field}
													value={field.value ?? ""}
													onChange={(e) =>
														field.onChange(
															e.target.value === "" ? null : Number(e.target.value)
														)
													}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<span>/</span>
								<FormField
									control={form.control}
									name="birthDay"
									render={({ field }) => (
										<FormItem className="flex-shrink-0">
											<FormControl>
												<Input
													type="number"
													min={1}
													max={31}
													placeholder="DD"
													{...field}
													value={field.value ?? ""}
													onChange={(e) =>
														field.onChange(
															e.target.value === "" ? null : Number(e.target.value)
														)
													}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2">
									<RequiredLabelIcon />
									<FormLabel tabIndex={-1}>Assign Role</FormLabel>
								</div>
								<FormControl>
									<RadioGroup
										tabIndex={-1}
										onValueChange={(value) => {
											setShowReentryClientOption(
												value === "client" || value === "client-volunteer"
											);
											return field.onChange(value);
										}}
										value={field.value}
										className="flex gap-2 justify-center"
									>
										{roles.map((role) => (
											<label
												tabIndex={0}
												key={role.id}
												className={cn(
													"cursor-pointer select-none rounded-md border px-3 py-0.5 text-sm font-medium transition-colors",
													field.value === role.id
														? "bg-primary text-primary-foreground border-primary"
														: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
												)}
												onKeyDown={(e) => {
													if (e.key === " " || e.key === "Enter") {
														e.preventDefault();
														const value = role.id;
														setShowReentryClientOption(
															value === "client" || value === "client-volunteer"
														);
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
				{showReentryClientOption && (
					<FormField
						control={form.control}
						name="isReentryClient"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center gap-3">
									<FormLabel className="m-0 leading-none">Is Re-entry Client?</FormLabel>
									<FormControl>
										<Checkbox
											className="mt-0 align-middle size-5"
											checked={!!field.value}
											onCheckedChange={(checked) => field.onChange(checked)}
											ref={field.ref}
											name={field.name}
										/>
									</FormControl>
								</div>
							</FormItem>
						)}
					/>
				)}
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
									placeholder="Enter comments here... (1000 character max)"
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
