"use client";
import { User } from "@/types";
import { Coach } from "@/userInteractions/db";
import { formatPhoneNumber } from "react-phone-number-input";

export default function CoachDetails({ coach, coachDetails }: { coach: User; coachDetails: Coach | null }) {
	if (!coach) {
		return <div>No coach assigned</div>;
	}
	return (
		<div className="flex flex-wrap gap-x-2 gap-y-0 items-center container mx-auto mb-6 border border-[border-muted/50] p-2.5 rounded-lg shadow-md  bg-background-light">
			<div className="font-semibold text-xl mb-1">Assigned Coach:</div>
			<div>{`${coach.firstName} ${coach.lastName}`}</div>
			{coach.phone && <div>Ph: {formatPhoneNumber(coach.phone)}</div>}
			{coach.email && (
				<div>
					Email:{" "}
					{
						<a href={`mailto:${coach.email}`} className="text-blue-500 hover:underline">
							{coach.email}
						</a>
					}
				</div>
			)}
			{coachDetails && coachDetails.llc && <div>Company: {coachDetails.llc}</div>}
			{coachDetails && coachDetails.website && (
				<div>
					Website:{" "}
					<a
						href={coachDetails.website}
						className="text-blue-500 hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						{coachDetails.website}
					</a>
				</div>
			)}
		</div>
	);
}
