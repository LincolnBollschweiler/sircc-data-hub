"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import { generalSchema } from "../../../tableInteractions/schemas";
import { createCity, updateCity } from "@/tableInteractions/actions";

export default function CitiesForm({
	city,
	onSuccess,
}: {
	city?: z.infer<typeof generalSchema> & { id: string };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof generalSchema>>({
		resolver: zodResolver(generalSchema),
		defaultValues: city ?? {
			name: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof generalSchema>) => {
		console.log("Submitting city form with values:", values);
		const action = city == null ? createCity : updateCity.bind(null, city.id);

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
