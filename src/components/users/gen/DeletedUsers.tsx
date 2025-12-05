import { getAllDeletedUsers } from "@/userInteractions/db";
import DataTable from "../DataTable";
import { User } from "@/types";
import PageHeader from "../../PageHeader";
import { Button } from "../../ui/button";
import Link from "next/link";

export default async function DeletedUsers() {
	const users = await getAllDeletedUsers();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Deleted Users">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={users as Partial<User>[]} userType="deletedUser" />
		</div>
	);
}
