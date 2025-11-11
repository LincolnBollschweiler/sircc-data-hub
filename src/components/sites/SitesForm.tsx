"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import { siteSchema } from "../../tableInteractions/schemas";
import { createSite, updateSite } from "@/tableInteractions/actions";
import PhoneInput from "react-phone-number-input/input";
import { useState } from "react";

export default function SitesForm({
	site,
	onSuccess,
}: {
	site?: z.infer<typeof siteSchema> & { id: string };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof siteSchema>>({
		resolver: zodResolver(siteSchema),
		defaultValues: site ?? {
			name: "",
			address: "",
			phone: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof siteSchema>) => {
		const action = site == null ? createSite : updateSite.bind(null, site.id);

		const actionData = await action(values);

		if (actionData) {
			actionToast({ actionData });
		}

		if (!actionData?.error) onSuccess?.();
	};

	const [phone, setPhone] = useState(site?.phone || "");
	const updatePhone = (value: string) => {
		setPhone(value);
		form.setValue("phone", value);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 flex-col">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<RequiredLabelIcon />
								Name
							</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<RequiredLabelIcon />
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={() => (
						<FormItem>
							<FormLabel>
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
							<FormMessage />
						</FormItem>
					)}
				/>
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
