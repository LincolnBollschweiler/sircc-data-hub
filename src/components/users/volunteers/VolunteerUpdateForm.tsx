"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { volunteerSchema } from "@/userInteractions/schema";
import { createVolunteer, updateVolunteer } from "@/userInteractions/actions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DuplicateReviewDialog } from "../duplicate/DuplicateReviewDialog";
import { User } from "@/types";
import { findDuplicates } from "../duplicate/duplicates";
import { mergeRoles } from "../duplicate/mergeRoles";

export default function VolunteerUpdateForm({
	user,
	onSuccess,
}: {
	user?: z.infer<typeof volunteerSchema> & { id: string } & { isClerkUser?: boolean };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof volunteerSchema>>({
		resolver: zodResolver(volunteerSchema),
		defaultValues: user || {
			firstName: "",
			lastName: "",
			role: "volunteer",
			email: null,
			phone: "",
			address1: null,
			address2: null,
			city: null,
			state: null,
			zip: null,
			birthMonth: null,
			birthDay: null,
			notes: "",
		},
	});

	const [pendingValues, setPendingValues] = useState<
		(z.infer<typeof volunteerSchema> & { previousRole?: string }) | null
	>(null);
	const [duplicateUsers, setDuplicateUsers] = useState<User[] | null>([]);

	const dialogOpen = duplicateUsers !== null;

	const runCreateOrUpdate = async (values: z.infer<typeof volunteerSchema> & { previousRole?: string }) => {
		const action = user?.firstName == null ? createVolunteer : updateVolunteer.bind(null, user.id);
		if (user?.isClerkUser) values = { ...values, previousRole: user.role };
		const actionData = await action(values);
		if (actionData) actionToast({ actionData });
		onSuccess?.();
	};

	const cleanup = () => {
		setDuplicateUsers(null);
		setPendingValues(null);
	};

	const mergeUsers = async (
		duplicateUser: User,
		newUserValues: z.infer<typeof volunteerSchema> & { previousRole?: string }
	) => {
		if (duplicateUser.role.includes("developer")) {
			actionToast({
				actionData: {
					error: true,
					message: `Not allowed: trying to merge with an existing developer.`,
				},
			});
			return;
		}

		const newUser: z.infer<typeof volunteerSchema> & { previousRole?: string } = { ...newUserValues };
		if (duplicateUser.clerkUserId) {
			// revert because this is a clerk user and we can't change their name/email here
			newUser.firstName = duplicateUser.firstName;
			newUser.lastName = duplicateUser.lastName;
			newUser.email = duplicateUser.email;
		}

		if (!newUser.phone && duplicateUser.phone) newUser.phone = duplicateUser.phone;
		if (!newUser.address1 && duplicateUser.address1) newUser.address1 = duplicateUser.address1;
		if (!newUser.address2 && duplicateUser.address2) newUser.address2 = duplicateUser.address2;
		if (!newUser.city && duplicateUser.city) newUser.city = duplicateUser.city;
		if (!newUser.state && duplicateUser.state) newUser.state = duplicateUser.state;
		if (!newUser.zip && duplicateUser.zip) newUser.zip = duplicateUser.zip;
		if (!newUser.birthMonth && duplicateUser.birthMonth) newUser.birthMonth = duplicateUser.birthMonth;
		if (!newUser.birthDay && duplicateUser.birthDay) newUser.birthDay = duplicateUser.birthDay;

		// special merge for notes (append)
		newUser.notes = [newUserValues.notes, duplicateUser.notes].filter(Boolean).join("\n");
		newUser.role = mergeRoles(duplicateUser.role, newUserValues.role!) as z.infer<typeof volunteerSchema>["role"];

		const action = updateVolunteer.bind(null, duplicateUser.id);
		const actionData = await action({ ...newUser, previousRole: duplicateUser.role });

		if (actionData) actionToast({ actionData });
		if (!actionData.error) onSuccess?.();
	};

	const onSubmit = async (values: z.infer<typeof volunteerSchema> & { previousRole?: string }) => {
		values = {
			...values,
			firstName: values.firstName?.trim(),
			lastName: values.lastName?.trim(),
			email: values.email?.trim(),
			address1: values.address1?.trim(),
			address2: values.address2?.trim(),
			city: values.city?.trim(),
			state: values.state?.trim(),
			zip: values.zip?.trim(),
			notes: values.notes?.trim(),
			role: "volunteer",
		};
		if (!user?.firstName) {
			const isDuplicateUserAction = findDuplicates.bind(null, values as User);
			const duplicateUsers: User[] = await isDuplicateUserAction();
			if (duplicateUsers.length) {
				setPendingValues(values);
				setDuplicateUsers(duplicateUsers);
				return; // stop original submit
			}
		}

		await runCreateOrUpdate(values);
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
											readOnly={user?.isClerkUser}
											tabIndex={user?.isClerkUser ? -1 : 0}
											onFocus={() => setFocusedField(user?.isClerkUser ? "firstName" : null)}
											onBlur={() => setFocusedField(null)}
										/>
									</FormControl>
								</div>
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
											readOnly={user?.isClerkUser}
											tabIndex={user?.isClerkUser ? -1 : 0}
											onFocus={() => setFocusedField(user?.isClerkUser ? "lastName" : null)}
											onBlur={() => setFocusedField(null)}
										/>
									</FormControl>
								</div>
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
											placeholder="(optional)"
											readOnly={user?.isClerkUser}
											tabIndex={user?.isClerkUser ? -1 : 0}
											onFocus={() => setFocusedField(user?.isClerkUser ? "email" : null)}
											onBlur={() => setFocusedField(null)}
										/>
									</FormControl>
								</div>
								{focusedField === "email" && (
									<FormDescription>
										User has a site login and must update their email through their profile
										settings.
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
						name="notes"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Notes</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										value={field.value ?? ""}
										onChange={(e) => field.onChange(e.target.value)}
										placeholder="notes... (1000 character max)"
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
						newUser as z.infer<typeof volunteerSchema> & { id: string } & { isClerkUser?: boolean }
					);
					cleanup();
				}}
				onCreateNew={async (newUser) => {
					await runCreateOrUpdate(
						newUser as z.infer<typeof volunteerSchema> & { id: string } & { isClerkUser?: boolean }
					);
					cleanup();
				}}
			/>
		</>
	);
}
