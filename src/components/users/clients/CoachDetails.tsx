"use client";
import { formatPhoneNumber } from "react-phone-number-input";

export default function CoachDetails({
	coach,
}: {
	coach: {
		firstName: string;
		lastName: string;
		email?: string | null;
		phone?: string | null;
	} | null;
}) {
	if (!coach) {
		return <div>No coach assigned</div>;
	}
	return (
		<div className="flex flex-wrap gap-x-2 gap-y-0 items-center container mx-auto mb-6 border border-[border-muted/50] py-2 px-4 rounded-lg shadow-md  bg-background-light">
			<div className="font-semibold m-0">Your Assigned Coach:</div>
			<div>{`${coach.firstName} ${coach.lastName}`}</div>
			{coach.phone && <div>Ph: {formatPhoneNumber(coach.phone)}</div>}
			{coach.email && (
				<div>
					Email:{" "}
					{
						<a href={`mailto:${coach.email}`} className="text-blue-600 hover:underline">
							{coach.email}
						</a>
					}
				</div>
			)}
		</div>
	);
}
