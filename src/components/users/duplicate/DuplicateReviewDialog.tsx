"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export function DuplicateReviewDialog({
	open,
	duplicates,
	pendingValues,
	onMerge,
	onCreateNew,
	onCancel,
}: {
	open: boolean;
	duplicates: User[];
	pendingValues: User;
	onMerge: (dup: User, newUser: User) => void;
	onCreateNew: (user: User) => void;
	onCancel: () => void;
}) {
	const [chosenDuplicate, setChosenDuplicate] = useState<User | null>(null);

	// Ensure the selected duplicate syncs to the first item when dialog opens
	useEffect(() => {
		if (open && duplicates.length > 0) {
			setChosenDuplicate(duplicates[0] ?? null);
		}
	}, [open, duplicates]);

	if (!duplicates || !pendingValues) return null;

	return (
		<Dialog open={open} onOpenChange={onCancel}>
			<DialogContent className="max-w-3xl dialog-mobile-safe">
				<DialogHeader>
					<DialogTitle>Possible Duplicate User(s) Found</DialogTitle>
				</DialogHeader>
				<Carousel
					className="relative w-[90%] mt-4 mx-auto"
					setApi={(api) => {
						if (!api) return;
						api.on("select", () => {
							const index = api.selectedScrollSnap();
							setChosenDuplicate(duplicates[index] ?? null);
						});
					}}
				>
					<CarouselContent>
						{duplicates.map((dup) => (
							<CarouselItem key={dup.id} className="basis-full">
								<Card
									className={`cursor-pointer border-2 transition-all ${
										chosenDuplicate?.id === dup.id
											? "border-blue-500 shadow-lg"
											: "border-transparent opacity-80"
									}`}
								>
									<CardContent className="p-4">
										<h3 className="font-semibold mb-3">Existing User vs Your New User</h3>

										<div className="grid grid-cols-[1fr_2fr_2fr] text-xs font-medium mb-2 gap-2">
											<div></div>
											<div className="text-center pb-2 border-b">Existing</div>
											<div className="text-center pb-2 border-b">New</div>
										</div>

										<FieldRow
											label="First Name"
											existing={dup.firstName}
											pending={pendingValues.firstName}
										/>
										<FieldRow
											label="Last Name"
											existing={dup.lastName}
											pending={pendingValues.lastName}
										/>
										<FieldRow label="Email" existing={dup.email} pending={pendingValues.email} />
										<FieldRow label="Phone" existing={dup.phone} pending={pendingValues.phone} />
										<FieldRow label="City" existing={dup.city} pending={pendingValues.city} />
										<FieldRow label="State" existing={dup.state} pending={pendingValues.state} />
										<FieldRow label="Zip" existing={dup.zip} pending={pendingValues.zip} />
										<FieldRow label="Role" existing={dup.role} pending={pendingValues.role} />
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
				<div className="flex gap-3 mt-6 justify-end">
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>

					<Button onClick={() => onCreateNew(pendingValues)}>Create New User</Button>

					<Button
						disabled={!chosenDuplicate}
						onClick={() => chosenDuplicate && onMerge(chosenDuplicate, pendingValues)}
					>
						Merge Selected
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function FieldRow({ label, existing, pending }: { label: string; existing?: string | null; pending?: string | null }) {
	const different = (existing ?? "") !== (pending ?? "");

	return (
		<div className="grid grid-cols-[1fr_2fr_2fr] gap-2 py-1 text-sm ">
			<div className="font-medium text-muted-foreground">{label}</div>

			<div className={different ? "text-red-600 font-semibold truncate" : "truncate"}>
				{existing || <span className="opacity-50">—</span>}
			</div>

			<div className={different ? "text-green-600 font-semibold truncate" : "truncate"}>
				{pending || <span className="opacity-50">—</span>}
			</div>
		</div>
	);
}
