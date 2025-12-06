"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { trimStrings } from "@/utils/trim";
import { contactSchema } from "@/contactInteractions/schema";
import { insertContact, updateContact } from "@/contactInteractions/actions";

export default function ContactUpdateForm({
	contact,
	onSuccess,
}: {
	contact?: z.infer<typeof contactSchema> & { id: string };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof contactSchema>>({
		resolver: zodResolver(contactSchema),
		defaultValues: contact || {
			name: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof contactSchema>) => {
		values = trimStrings(values);
		const action = contact ? updateContact.bind(null, contact.id) : insertContact;
		const actionData = await action(values);
		if (actionData) actionToast({ actionData });
		if (!actionData?.error) onSuccess?.();
	};

	const [phone, setPhone] = useState(contact?.phone || "");
	const [contactPhone, setContactPhone] = useState(contact?.contactPhone || "");
	const [secondContactPhone, setSecondContactPhone] = useState(contact?.secondContactPhone || "");

	const updatePhone = (value: string) => {
		setPhone(value);
		form.setValue("phone", value);
	};

	const updateContactPhone = (value: string) => {
		setContactPhone(value);
		form.setValue("contactPhone", value);
	};

	const updateSecondContactPhone = (value: string) => {
		setSecondContactPhone(value);
		form.setValue("secondContactPhone", value);
	};

	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null; // prevents hydration mismatch

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 flex-col">
				<FormField
					name="name"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<div className="flex items-center w-[168px] justify-end">
									<RequiredLabelIcon />
									<FormLabel>Name</FormLabel>
								</div>
								<FormControl>
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="typeOfService"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-right">Type</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ""}
										placeholder="Business or Service Type"
									/>
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-right">Email</FormLabel>
								<FormControl>
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={() => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-right">Phone</FormLabel>
								<FormControl>
									<PhoneInput
										country="US"
										value={phone}
										onChange={(value) => updatePhone(value ?? "")}
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
									/>
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contactName"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-nowrap text-right">Contact Name</FormLabel>
								<FormControl>
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
							<FormMessage className="ml-[168px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contactEmail"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-nowrap text-right">Contact Email</FormLabel>
								<FormControl>
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contactPhone"
					render={() => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-nowrap text-right">Contact Phone</FormLabel>
								<FormControl>
									<PhoneInput
										country="US"
										value={contactPhone}
										onChange={(value) => updateContactPhone(value ?? "")}
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
									/>
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="secondContactName"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-nowrap text-right">2nd Contact Name</FormLabel>
								<FormControl>
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
							<FormMessage className="ml-[168px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="secondContactEmail"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-nowrap text-right">2nd Contact Email</FormLabel>
								<FormControl>
									<Input {...field} value={field.value ?? ""} />
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="secondContactPhone"
					render={() => (
						<FormItem className="flex flex-col">
							<div className="flex items-center gap-2">
								<FormLabel className="w-[168px] text-nowrap text-right">2nd Contact Phone</FormLabel>
								<FormControl>
									<PhoneInput
										country="US"
										value={secondContactPhone}
										onChange={(value) => updateSecondContactPhone(value ?? "")}
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
									/>
								</FormControl>
							</div>
							<FormMessage className="ml-[130px]" />
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
									<Input {...field} value={field.value ?? ""} placeholder="Address Line 1" />
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
									<Input {...field} value={field.value ?? ""} placeholder="Address Line 2" />
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
										onChange={(e) => field.onChange(e.target.value.toUpperCase())}
										value={field.value ?? ""}
										placeholder="State"
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
									<Input {...field} value={field.value ?? ""} placeholder="ZIP Code" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
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
	);
}
