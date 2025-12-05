"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input/input";
import { useEffect, useState } from "react";
import { clerkUserSchema } from "@/userInteractions/schema";
import { updateClerkUser } from "@/userInteractions/actions";
import { redirect } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { trimStrings } from "@/utils/trim";

export default function ProfileForm({
	profile,
	onSuccess,
	isIntake,
}: {
	profile: z.infer<typeof clerkUserSchema> & { id: string };
	onSuccess?: () => void;
	isIntake?: boolean;
}) {
	// if (!profile) redirect("/");
	const form = useForm<z.infer<typeof clerkUserSchema>>({
		resolver: zodResolver(clerkUserSchema),
		defaultValues: {
			...profile,
			phone: profile?.phone || "",
			address1: profile?.address1 || "",
			address2: profile?.address2 || "",
			city: profile?.city || "",
			state: profile?.state || "",
			zip: profile?.zip || "",
		},
	});

	const onSubmit = async (values: z.infer<typeof clerkUserSchema>) => {
		values = trimStrings(values);
		const action = updateClerkUser.bind(null, profile.id);

		const actionData = await action(values);

		if (actionData) {
			actionToast({ actionData });
		}

		if (!actionData?.error) {
			if (!isIntake) onSuccess?.();
			else redirect("/");
		}
	};

	const [phone, setPhone] = useState(profile?.phone || "");
	const updatePhone = (value: string) => {
		setPhone(value);
		form.setValue("phone", value);
	};

	const { setTheme, theme } = useTheme();

	const [focusedField, setFocusedField] = useState<string | null>(null);
	const roles = [
		{ id: "client", name: "Client" },
		{ id: "volunteer", name: "Volunteer" },
		{ id: "coach", name: "Coach" },
		{ id: "staff", name: "Staff" },
		{ id: "admin", name: "Admin" },
	];

	const themePreferences = [
		{ id: "light", name: "Light" },
		{ id: "dark", name: "Dark" },
		{ id: "system", name: "System" },
	];

	const [mounted, setMounted] = useState(false);

	const [localTheme, setLocalTheme] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (localTheme) {
			setTheme(localTheme);
		}
	}, [localTheme, setTheme]);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null; // prevents hydration mismatch

	if (!profile) {
		setTimeout(() => window.location.reload(), 4000);
		return (
			<div className="flex justify-center items-center p-7 flex-col gap-4">
				<div className="text-center text-sm opacity-80">Syncing your profile…</div>
				<Loader2 className="w-8 h-8 text-foreground/80 animate-spin" />
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 flex-col">
				<FormField
					name="firstName"
					render={() => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										value={`${profile.firstName} ${profile.lastName}`}
										readOnly
										tabIndex={-1}
										onFocus={() => setFocusedField("name")}
										onBlur={() => setFocusedField(null)}
									/>
								</FormControl>
							</div>
							{focusedField === "name" && (
								<FormDescription>
									Use the icon at the very top right of the page to update your name.
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
										readOnly
										tabIndex={-1}
										onFocus={() => setFocusedField("email")}
										onBlur={() => setFocusedField(null)}
									/>
								</FormControl>
							</div>
							{focusedField === "email" && (
								<FormDescription>
									Use the icon at the very top right of the page to update your email.
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
									<Input {...field} value={field.value ?? ""} placeholder="City (optional)" />
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
										onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
					name="themePreference"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex gap-2 items-center">
								<FormLabel className="w-[100px]">Color Theme</FormLabel>
								<FormControl>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											setLocalTheme(value);
										}}
										value={mounted ? field.value ?? theme ?? "system" : "system"} // ✅ safe fallback
									>
										<SelectTrigger className="max-w-[150px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{themePreferences.map((theme) => (
												<SelectItem key={theme.id} value={theme.id}>
													{theme.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
							</div>
						</FormItem>
					)}
				/>
				{isIntake && (
					<>
						<FormField
							control={form.control}
							name="desiredRole"
							render={({ field }) => (
								<FormItem>
									<div className="flex flex-col gap-3">
										<div className="flex items-center gap-0.5">
											<RequiredLabelIcon />
											<FormLabel tabIndex={-1}>Select Your Desired Role at SIRCC</FormLabel>
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
									<FormLabel>Provide A Few Notes About Yourself</FormLabel>
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
					</>
				)}

				<div className="self-end gap-2 flex">
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
