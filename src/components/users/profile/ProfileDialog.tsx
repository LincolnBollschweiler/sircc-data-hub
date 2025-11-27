"use client";

import { ReactNode } from "react";
import PageHeader from "../../PageHeader";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { formatPhoneNumber } from "react-phone-number-input";
import { DialogClose } from "@radix-ui/react-dialog";
import { User } from "@/types";
import ProfileFormDialog from "./ProfileFormDialog";

export default function ProfileDialog({ user, children }: { user: User; children?: ReactNode }) {
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
				<DialogContent className="dialog-mobile-safe">
					<DialogHeader>
						<DialogTitle>
							<PageHeader title="Profile" role={role} accepted={user?.accepted} className="mb-0" />
						</DialogTitle>
					</DialogHeader>
					<div className="">
						<Table>
							<TableBody className="text-xs sm:text-sm md:text-base [&_td]:align-top">
								<TableRow key={"name"} className="hover:bg-0 text-lg sm:text-xl font-semibold">
									<TableCell colSpan={2} className="text-center px-3">
										{user?.firstName} {user?.lastName}
									</TableCell>
								</TableRow>
								<TableRow key={"email"} className="border-none hover:bg-0">
									<TableCell className="py-0 pt-3">Email</TableCell>
									<TableCell className="p-0 pt-3">{user?.email ?? "Not Provide"}</TableCell>
								</TableRow>
								<TableRow key={"address"} className="border-none my-0 hover:bg-0">
									<TableCell className="py-0">Address</TableCell>
									{/* put each address line on its own line if it exists */}
									{/* and format city, state zip on one line only adding the comma */}
									{/* between city and state if state exists */}
									<TableCell className="p-0">
										{user?.address1 && <div>{user.address1}</div>}
										{user?.address2 && <div>{user.address2}</div>}
										{user?.city && (
											<div>
												{user.city}
												{user?.state && `, ${user.state}`} {user?.zip ?? ""}
											</div>
										)}
									</TableCell>
								</TableRow>
								<TableRow key={"phone"} className="border-none hover:bg-0">
									<TableCell className="py-0">Phone</TableCell>
									<TableCell className="p-0">
										{user?.phone ? formatPhoneNumber(user.phone) : "Not Provided"}
									</TableCell>
								</TableRow>
								<TableRow key={"dob"} className="border-none my-0 hover:bg-0">
									<TableCell className="py-0">Birthday</TableCell>
									<TableCell className="p-0">
										{user?.birthMonth ?? "__"}/{user?.birthDay ?? "__"}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
					<DialogFooter className="flex flex-row space-x-2 justify-end">
						<DialogClose asChild>
							<Button variant="destructiveOutline">Close</Button>
						</DialogClose>
						<ProfileFormDialog profile={user}>
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
