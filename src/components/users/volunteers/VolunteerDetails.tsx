"use client";

import { VolunteerFull } from "@/userInteractions/db";
import { formatPhoneNumber } from "react-phone-number-input";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import VolunteerUpdateDialog from "./VolunteerUpdateDialog";

export const VolunteerDetails = ({ user }: { user: VolunteerFull["user"] }) => {
	return (
		<div className="flex flex-wrap gap-x-2 gap-y-0 items-center container mx-auto mb-6 border border-[border-muted/50] p-2.5 rounded-lg shadow-md  bg-background-light">
			<div className="flex w-full justify-between items-center">
				<div className="font-semibold text-xl mb-1">General Info</div>
				<VolunteerUpdateDialog user={user}>
					<DialogTrigger asChild>
						<Button className="mr-1">Edit Volunteer</Button>
					</DialogTrigger>
				</VolunteerUpdateDialog>
			</div>
			<div>
				{user?.firstName} {user?.lastName}
			</div>
			{user?.email && (
				<div>
					<a className="text-blue-600 hover:underline" href={`mailto:${user.email}`}>
						{user.email}
					</a>
				</div>
			)}
			{user?.phone && <div>{formatPhoneNumber(user.phone)}</div>}
			{user?.address1 && (
				<div>
					{user?.address1 && <span>{user.address1} </span>}
					{user?.address2 && <span>{user.address2} </span>}
					{user?.city && (
						<span>
							{user.city}
							{user?.state && `, ${user.state}`} {user?.zip ?? ""}
						</span>
					)}
				</div>
			)}
			{user.notes && (
				<div>
					<span className="font-semibold">Notes: </span>
					{user.notes}
				</div>
			)}
		</div>
	);
};
