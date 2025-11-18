"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import RequiredLabelIcon from "@/components/RequiredLabelIcon";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import { assignRoleSchema } from "@/userInteractions/schema";
import { updateUserRoleAndAccept } from "../../../userInteractions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function ProfileForm({
	profile,
	onSuccess,
}: {
	profile: z.infer<typeof assignRoleSchema> & { id: string };
	onSuccess?: () => void;
}) {
	const form = useForm<z.infer<typeof assignRoleSchema>>({
		resolver: zodResolver(assignRoleSchema),
		defaultValues: profile,
	});

	const onSubmit = async (values: z.infer<typeof assignRoleSchema>) => {
		const action = updateUserRoleAndAccept.bind(null, profile.id);
		const actionData = await action(values);
		if (actionData) {
			actionToast({ actionData });
			requestAnimationFrame(() => window.location.reload());
		}
	};

	const roles = [
		{ id: "client", name: "Client" },
		{ id: "coach", name: "Coach" },
		{ id: "volunteer", name: "Volunteer" },
		{ id: "client-volunteer", name: "Client-Volunteer" },
		{ id: "admin", name: "Admin" },
	];

	const [showReentryClientOption, setShowReentryClientOption] = useState(
		profile.role === "client" || profile.role === "client-volunteer"
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 flex-col">
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<RequiredLabelIcon />
							<FormLabel className="mb-2">
								Assign Role for {profile.firstName} {profile.lastName}.{" "}
								{profile.desiredRole && `Desired role: ${profile.desiredRole}`}
							</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={(value) => {
										setShowReentryClientOption(value === "client" || value === "client-volunteer");
										return field.onChange(value);
									}}
									value={field.value}
									className="flex flex-wrap gap-2 justify-between"
								>
									{roles.map((role) => (
										<label
											key={role.id}
											className={cn(
												"cursor-pointer select-none rounded-md border px-3 py-0.5 text-sm font-medium transition-colors",
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
				{showReentryClientOption && (
					<FormField
						control={form.control}
						name="isReentryClient"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center gap-3">
									<FormLabel className="m-0 leading-none">Is Re-entry Client?</FormLabel>
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
