import { ReactNode } from "react";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export default async function ProfileDialog({
	user,
	children,
}: {
	user: {
		address: string | null;
		id: string;
		role: "developer" | "admin" | "coach" | "client" | "volunteer" | "client-volunteer";
		email: string | null;
		coachAuthorized: boolean | null;
		phone: string | null;
		// clerkUserId: string;
		firstName: string;
		lastName: string;
		// photoUrl: string | null;
		// createdAt: Date;
		// updatedAt: Date;
		// deletedAt: Date | null;
		siteId: string | null;
		birthMonth: number | null;
		birthDay: number | null;
		// isReentryClient: boolean | null;
		// followUpNeeded: boolean | null;
		// followUpDate: Date | null;
		// notes: string | null;
		accepted: boolean | null;
		roleAssigned: boolean | null;
	};

	children?: ReactNode;
}) {
	const role = user?.role.charAt(0).toUpperCase() + user?.role.slice(1);
	// const dateOptions: Intl.DateTimeFormatOptions = {
	// 	month: "2-digit",
	// 	day: "2-digit",
	// };
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
								<TableRow key={"name"} className="my-0 hover:bg-0 text-lg font-semibold">
									<TableCell colSpan={2} className="px-3 text-xl">
										{user?.firstName} {user?.lastName}
									</TableCell>
								</TableRow>
								<TableRow key={"email"} className="border-none my-0 hover:bg-0 text-lg">
									<TableCell className="text-right py-0">Email</TableCell>
									<TableCell className="p-0">{user?.email ?? "Not Provide"}</TableCell>
								</TableRow>
								<TableRow key={"phone"} className="border-none my-0 hover:bg-0 text-lg">
									<TableCell className="text-right py-0">Phone</TableCell>
									<TableCell className="p-0">{user?.phone ?? "Not Provided"}</TableCell>
								</TableRow>
								<TableRow key={"address"} className="border-none my-0 hover:bg-0 text-lg">
									<TableCell className="text-right py-0">Address</TableCell>
									<TableCell className="p-0">{user?.address ?? "Not Provided"}</TableCell>
								</TableRow>
								<TableRow key={"dob"} className="border-none my-0 hover:bg-0 text-lg">
									<TableCell className="text-right py-0">Birthday</TableCell>
									<TableCell className="p-0">
										{user?.birthMonth ?? "__"} / {user?.birthDay ?? "__"}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="destructiveOutline">Cancel</Button>
						</DialogClose>
						<Button asChild className="mr-[1rem]">
							<Link href="/edit-profile">Edit</Link>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
