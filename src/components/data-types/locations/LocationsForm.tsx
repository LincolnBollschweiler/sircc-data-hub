"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import { generalSchema } from "../../../tableInteractions/schemas";
import { createLocation, updateLocation } from "@/tableInteractions/actions";

export default function LocationsForm({
	location,
	onSuccess,
}: {
	location?: z.infer<typeof generalSchema> & { id: string };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof generalSchema>>({
		resolver: zodResolver(generalSchema),
		defaultValues: location ?? {
			name: "",
			description: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof generalSchema>) => {
		const action = location == null ? createLocation : updateLocation.bind(null, location.id);

		const actionData = await action(values);

		if (actionData) {
			actionToast({ actionData });
		}

		if (!actionData?.error) onSuccess?.();
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea className="min-h-20 resize-none" {...field} value={field.value ?? ""} />
							</FormControl>
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
