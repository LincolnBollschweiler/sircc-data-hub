"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import { createClientService, updateClientService } from "../../tableInteractions/actions";
import { clientServiceSchema } from "../../tableInteractions/schemas";
import { redirect } from "next/navigation";

export default function ClientServiceForm({
	clientService,
}: {
	clientService?: { id: string; name: string; description: string | null; dispersesFunds: boolean | null };
}) {
	const form = useForm<z.infer<typeof clientServiceSchema>>({
		resolver: zodResolver(clientServiceSchema),
		defaultValues: clientService ?? {
			name: "",
			description: "",
			dispersesFunds: false,
		},
	});

	const onSubmit = async (values: z.infer<typeof clientServiceSchema>) => {
		const action = clientService == null ? createClientService : updateClientService.bind(null, clientService.id);

		const actionData = await action(values);

		if (actionData) {
			actionToast({ actionData });
		}

		redirect("/admin/data-types/client-services");
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
				<FormField
					control={form.control}
					name="dispersesFunds"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center gap-3">
								<FormLabel className="m-0 leading-none">
									Requires a funds dispersal dollar amount?
								</FormLabel>
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
				<div className="self-end gap-2 flex">
					<Button
						type="button"
						variant="destructiveOutline"
						onClick={() => redirect("/admin/data-types/client-services")}
					>
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
