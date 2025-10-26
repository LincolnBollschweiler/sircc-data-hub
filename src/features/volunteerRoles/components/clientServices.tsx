"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientServiceSchema } from "../schemas/clientServices";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createClientService } from "../actions/clientServices";
import { actionToast } from "@/hooks/use-toast";

export default function ClientServiceForm() {
	const form = useForm<z.infer<typeof clientServiceSchema>>({
		resolver: zodResolver(clientServiceSchema),
		defaultValues: {
			name: "",
			description: "",
			dispersesFunds: false,
		},
	});

	const onSubmit = async (data: z.infer<typeof clientServiceSchema>) => {
		const actionData = await createClientService(data);
		if (actionData.error) {
			actionToast({ actionData });
			return;
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={() => onSubmit(form.getValues())} className="flex gap-6 flex-col">
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
								<Textarea className="min-h-20 resize-none" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="dispersesFunds"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Disperses Funds?</FormLabel>
							<FormControl>
								{/* TODO FIX */}
								<Checkbox {...field} onChange={() => (field.value = !field.value)} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="self-end">
					<Button type="submit" disabled={form.formState.isSubmitting && !form.formState.isValid}>
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
}
