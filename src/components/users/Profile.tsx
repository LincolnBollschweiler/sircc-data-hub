import { getCurrentUser } from "@/services/clerk";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default async function Profile() {
	const user = await getCurrentUser({ allData: true });

	const role = user.role ? user.role?.charAt(0).toUpperCase() + user.role?.slice(1) : "";
	const dateOptions: Intl.DateTimeFormatOptions = {
		month: "2-digit",
		day: "2-digit",
	};
	return (
		<>
			<div className="container mt-4 py-4 px-6 max-w-xl bg-background-light rounded-md shadow-md">
				<PageHeader title="Profile" role={role}>
					<Dialog>
						<form>
							<DialogTrigger asChild>
								<Button>Edit Profile</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit profile</DialogTitle>
									<DialogDescription>
										Make changes to your profile here. Click save when you&apos;re done.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label htmlFor="name-1">Name</Label>
										<Input id="name-1" name="name" defaultValue="Pedro Duarte" />
									</div>
									<div className="grid gap-3">
										<Label htmlFor="username-1">Username</Label>
										<Input id="username-1" name="username" defaultValue="@peduarte" />
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button type="submit">Save changes</Button>
								</DialogFooter>
							</DialogContent>
						</form>
					</Dialog>
					{/* <Button asChild>
						<Link href="/edit-profile">Edit</Link>
					</Button> */}
				</PageHeader>
				<Table>
					<TableBody>
						<TableRow key={"name"} className="my-0 hover:bg-0 text-lg font-semibold">
							<TableCell colSpan={2} className="text-center p-0">
								{user.data?.firstName} {user.data?.lastName}
							</TableCell>
						</TableRow>
						<TableRow key={"email"} className="border-none my-0 hover:bg-0 text-lg">
							<TableCell className="text-right py-0">Email</TableCell>
							<TableCell className="p-0">{user.data?.email ?? "Unknown"}</TableCell>
						</TableRow>
						<TableRow key={"phone"} className="border-none my-0 hover:bg-0 text-lg">
							<TableCell className="text-right py-0">Phone</TableCell>
							<TableCell className="p-0">{user.data?.phone ?? "Unknown"}</TableCell>
						</TableRow>
						<TableRow key={"address"} className="border-none my-0 hover:bg-0 text-lg">
							<TableCell className="text-right py-0">Address</TableCell>
							<TableCell className="p-0">{user.data?.address ?? "Unknown"}</TableCell>
						</TableRow>
						<TableRow key={"dob"} className="border-none my-0 hover:bg-0 text-lg">
							<TableCell className="text-right py-0">Date of Birth</TableCell>
							<TableCell className="p-0">
								{user.data?.dateOfBirth
									? new Date(user.data.dateOfBirth).toLocaleDateString("en-US", dateOptions)
									: "Unknown MM/DD"}
							</TableCell>
						</TableRow>
						{user.role === "coach" && (
							<TableRow key={"coachAuthorized"} className="border-none my-0 hover:bg-0 text-lg">
								<TableCell className="text-right py-0">Coach Authorized</TableCell>
								<TableCell className="p-0">{user.data?.coachAuthorized ? "Yes" : "No"}</TableCell>
							</TableRow>
						)}
						{(user.role === "client" || user.role === "volunteer" || user.role === "client-volunteer") && (
							<TableRow key={"reentryClient"} className="border-none my-0 hover:bg-0 text-lg">
								<TableCell className="text-right py-0">Re-entry Client</TableCell>
								<TableCell className="p-0">{user.data?.isReentryClient ? "Yes" : "No"}</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
