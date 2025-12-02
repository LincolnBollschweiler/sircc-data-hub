"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminSchema } from "@/userInteractions/schema";
import { updateStaffDetails } from "@/userInteractions/actions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { trimStrings } from "@/utils/trim";
import { User } from "@/types";
import { mergeRoles } from "../duplicate/mergeRoles";
import { findDuplicates } from "../duplicate/duplicates";
import { DuplicateReviewDialog } from "../duplicate/DuplicateReviewDialog";
import { cn } from "@/lib/utils";

export default function AdminForm({
	user,
	onSuccess,
}: {
	user?: z.infer<typeof adminSchema> & { id: string };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: user || {
			firstName: "..",
			lastName: "..",
			phone: "",
			address1: "",
			address2: "",
			city: "",
			state: "",
			zip: "",
			role: "admin",
			notes: "",
		},
	});

	const [pendingValues, setPendingValues] = useState<z.infer<typeof adminSchema> | null>(null);
	const [duplicateUsers, setDuplicateUsers] = useState<User[] | null>([]);

	const dialogOpen = duplicateUsers !== null;

	const runUpdate = async (values: z.infer<typeof adminSchema>) => {
		if (!user) return;

		const action = updateStaffDetails.bind(null, user.id);
		const actionData = await action(values);
		if (actionData) actionToast({ actionData });
		if (!actionData?.error) onSuccess?.();
	};

	const cleanup = () => {
		setDuplicateUsers(null);
		setPendingValues(null);
	};

	const mergeUsers = async (duplicateUser: User, newUserValues: z.infer<typeof adminSchema>) => {
		if (duplicateUser.role.includes("developer") || duplicateUser.role.includes("staff")) {
			let role = "Developer";
			if (duplicateUser.role.includes("staff")) role = "Staff";
			actionToast({
				actionData: {
					error: true,
					message: `Not allowed: Trying to merge with an existing ${role}.`,
				},
			});
			return;
		}

		if (!duplicateUser.clerkUserId) {
			actionToast({
				actionData: {
					error: true,
					message: `Not allowed: Selected User does not have an account.`,
				},
			});
			return;
		}

		const newUser: z.infer<typeof adminSchema> = { ...newUserValues };
		newUser.firstName = duplicateUser.firstName;
		newUser.lastName = duplicateUser.lastName;
		newUser.email = duplicateUser.email;

		if (!newUser.phone && duplicateUser.phone) newUser.phone = duplicateUser.phone;
		if (!newUser.address1 && duplicateUser.address1) newUser.address1 = duplicateUser.address1;
		if (!newUser.address2 && duplicateUser.address2) newUser.address2 = duplicateUser.address2;
		if (!newUser.city && duplicateUser.city) newUser.city = duplicateUser.city;
		if (!newUser.state && duplicateUser.state) newUser.state = duplicateUser.state;
		if (!newUser.zip && duplicateUser.zip) newUser.zip = duplicateUser.zip;

		// special merge for notes (append)
		newUser.notes = [newUserValues.notes, duplicateUser.notes].filter(Boolean).join("\n");
		newUser.role = mergeRoles(duplicateUser.role, newUserValues.role!) as z.infer<typeof adminSchema>["role"];

		const action = updateStaffDetails.bind(null, duplicateUser.id);
		const actionData = await action(newUser as z.infer<typeof adminSchema> & { id: string });
		if (actionData) actionToast({ actionData });
		if (!actionData?.error) onSuccess?.();
	};

	const onSubmit = async (values: z.infer<typeof adminSchema>) => {
		values = trimStrings(values);
		if (!user?.firstName) {
			const isDuplicateUserAction = findDuplicates.bind(null, values as User);
			const duplicateUsers: User[] = await isDuplicateUserAction();
			if (duplicateUsers.length) {
				values.role = "admin";
				setPendingValues(values);
				setDuplicateUsers(duplicateUsers);
			} else {
				actionToast({
					actionData: {
						error: true,
						message: `No duplicates found. You can only add Admin Role to a user with a login account.`,
					},
				});
				onSuccess?.();
			}
			return; // stop original submit
		}

		await runUpdate(values);
	};

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
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 flex-col">
					{!user && (
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
					)}
					<div className={cn(!user && "hidden")}>
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
											User has a site login and must update their name through their profile
											settings.
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
											User has a site login and must update their name through their profile
											settings.
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
											User has a site login and must update their email through their profile
											settings.
										</FormDescription>
									)}
								</FormItem>
							)}
						/>
					</div>
					<div className={cn(!user && "hidden")}>
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
												onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
											<Input
												{...field}
												value={field.value ?? ""}
												placeholder="Zip Code (optional)"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{user && (
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
											placeholder="Follow up notes... (1000 character max)"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
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
			<DuplicateReviewDialog
				open={dialogOpen}
				duplicates={duplicateUsers as User[]}
				pendingValues={pendingValues as User}
				onCancel={() => {
					setDuplicateUsers(null);
					setPendingValues(null);
				}}
				onMerge={async (dup, newUser) => {
					await mergeUsers(
						dup,
						newUser as z.infer<typeof adminSchema> & { id: string } & { isClerkUser?: boolean }
					);
					cleanup();
				}}
				onCreateNew={async (newUser) => {
					await runUpdate(
						newUser as z.infer<typeof adminSchema> & { id: string } & { isClerkUser?: boolean }
					);
					cleanup();
				}}
				cannotAddNew={true}
			/>
		</>
	);
}
