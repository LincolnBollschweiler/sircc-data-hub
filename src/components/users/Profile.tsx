import { getCurrentUser } from "@/services/clerk";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

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
					<Button asChild>
						<Link href="/edit-profile">Edit</Link>
					</Button>
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
