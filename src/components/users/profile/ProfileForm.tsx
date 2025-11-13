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
import { userSchema } from "@/userInteractions/schema";
import { updateUser } from "../actions";
import { redirect } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Site } from "@/drizzle/types";
import { useTheme } from "next-themes";

export default function ProfileForm({
	profile,
	sites,
	onSuccess,
	isIntake,
}: {
	profile: z.infer<typeof userSchema> & { id: string };
	sites: Partial<Site>[];
	onSuccess?: () => void;
	isIntake?: boolean;
}) {
	// if (!profile) redirect("/");
	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			...profile,
			phone: profile?.phone || "",
			address: profile?.address || "",
		},
	});

	const onSubmit = async (values: z.infer<typeof userSchema>) => {
		const action = updateUser.bind(null, profile.id);

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
		{ id: "coach", name: "Coach" },
		{ id: "volunteer", name: "Volunteer" },
		{ id: "client-volunteer", name: "Client-Volunteer" },
	];

	const themePreferences = [
		{ id: "light", name: "Light" },
		{ id: "dark", name: "Dark" },
		{ id: "system", name: "System" },
	];

	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null; // prevents hydration mismatch

	if (!profile) {
		setTimeout(() => window.location.reload(), 1);
		return <></>;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 flex-col">
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
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input {...field} value={field.value ?? ""} placeholder="Optional" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="siteId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex gap-2 items-center">
								<FormLabel className="w-[100px]">Preferred Site</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value ?? ""}>
										<SelectTrigger className="max-w-[150px]">
											<SelectValue placeholder="Select a site" />
										</SelectTrigger>
										<SelectContent>
											{[
												<SelectItem key="none" value={"none"}>
													No Preferred Site
												</SelectItem>,
												...sites.map((site) => (
													<SelectItem key={site.id} value={site.id ?? ""}>
														{site.name}
													</SelectItem>
												)),
											]}
										</SelectContent>
									</Select>
								</FormControl>
							</div>
							<FormMessage />
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
											setTheme(value);
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
									<FormLabel className="mb-2">Select Your Desired Role at SIRCC</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											value={field.value}
											className="flex flex-wrap gap-2"
										>
											{roles.map((role) => (
												<label
													key={role.id}
													className={cn(
														"cursor-pointer select-none rounded-md border px-4 py-0.5 text-sm font-medium transition-colors",
														field.value === role.id
															? "bg-primary text-primary-foreground border-primary"
															: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
													)}
												>
													<RadioGroupItem value={role.id} className="hidden" />
													{role.name}
												</label>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-0.5 items-center">
										<RequiredLabelIcon />
										<FormLabel>Provide A Few Notes About Yourself</FormLabel>
									</div>
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
