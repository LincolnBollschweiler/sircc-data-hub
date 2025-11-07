"use client";

import { ReactNode } from "react";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { formatPhoneNumber } from "react-phone-number-input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Site, User } from "@/drizzle/types";
import ProfileFormDialog from "./ProfileFormDialog";

export default function ProfileDialog({ user, sites, children }: { user: User; sites: Site[]; children?: ReactNode }) {
	const role = user?.role
		? user.role
				.split("-")
				.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
				.join(" ")
		: "";

	return (
		<>
			<Dialog>
				{children}
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							<PageHeader
								title="Profile"
								role={role}
								accepted={user?.accepted}
								coachAuthorized={user?.coachAuthorized}
								className="mb-2"
							/>
						</DialogTitle>
					</DialogHeader>
					<div className="">
						<Table>
							<TableBody>
								<TableRow key={"name"} className="hover:bg-0 text-lg font-semibold">
									<TableCell colSpan={2} className="text-center px-3 text-xl">
										{user?.firstName} {user?.lastName}
									</TableCell>
								</TableRow>
								<TableRow key={"email"} className="border-none hover:bg-0 text-lg">
									<TableCell className="py-0 pt-3">Email</TableCell>
									<TableCell className="p-0 pt-3">{user?.email ?? "Not Provide"}</TableCell>
								</TableRow>
								<TableRow key={"address"} className="border-none my-0 hover:bg-0 text-lg">
									<TableCell className="py-0">Address</TableCell>
									<TableCell className="p-0">{user?.address ?? "Not Provided"}</TableCell>
								</TableRow>
								<TableRow key={"phone"} className="border-none hover:bg-0 text-lg">
									<TableCell className="py-0">Phone</TableCell>
									<TableCell className="p-0">
										{user?.phone ? formatPhoneNumber(user.phone) : "Not Provided"}
									</TableCell>
								</TableRow>
								<TableRow key={"dob"} className="border-none my-0 hover:bg-0 text-lg">
									<TableCell className="py-0">Birthday</TableCell>
									<TableCell className="p-0">
										{user?.birthMonth ?? "__"}/{user?.birthDay ?? "__"}
									</TableCell>
								</TableRow>
								<TableRow key={"site"} className="border-none hover:bg-0 text-lg">
									<TableCell className="py-0">Preferred Site</TableCell>
									<TableCell className="p-0">
										{user?.siteId
											? sites.find((site) => site.id === user.siteId)?.name ??
											  "Selected Site Closed"
											: "No Preferrence"}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="destructiveOutline">Close</Button>
						</DialogClose>
						<ProfileFormDialog profile={user} sites={sites}>
							<DialogTrigger asChild>
								<Button className="mr-[1rem]">Edit</Button>
							</DialogTrigger>
						</ProfileFormDialog>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
