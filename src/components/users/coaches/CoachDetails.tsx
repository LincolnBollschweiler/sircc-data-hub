"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { Coach } from "@/userInteractions/db";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { formatPhoneNumber } from "react-phone-number-input";
import EditCoachDialog from "./EditCoachDialog";

export default function CoachDetails({ user, coach }: { user: User; coach: Coach }) {
	if (!coach) return <div className="text-center py-10 text-xl font-semibold">No coach assigned</div>;

	return (
		<div className="flex flex-wrap gap-x-2 gap-y-0 items-center container mx-auto mb-6 border border-[border-muted/50] py-2 px-4 rounded-lg shadow-md  bg-background-light">
			<div className="flex w-full justify-between items-center">
				<div className="font-semibold text-xl mb-1">General Info</div>
				<EditCoachDialog user={user} coach={coach}>
					<DialogTrigger asChild>
						<Button>Edit Coach</Button>
					</DialogTrigger>
				</EditCoachDialog>
			</div>
			<div>{`${user.firstName} ${user.lastName}`}</div>
			{user.phone && <div>Ph: {formatPhoneNumber(user.phone)}</div>}
			{user.email && (
				<div>
					Email:{" "}
					{
						<a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
							{user.email}
						</a>
					}
				</div>
			)}
			{coach.llc && <div>Company: {coach.llc}</div>}
			{coach.website && (
				<div>
					Website:{" "}
					<a
						href={coach.website}
						className="text-blue-600 hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						{coach.website}
					</a>
				</div>
			)}
		</div>
	);
}
