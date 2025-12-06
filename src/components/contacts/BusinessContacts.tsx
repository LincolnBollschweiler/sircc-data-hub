import { getAllContacts } from "@/contactInteractions/db";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DataTable from "../users/DataTable";
import { Contact } from "@/types";

export default async function BusinessContacts() {
	const contacts = await getAllContacts();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Business Contacts">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={contacts as Contact[]} userType="contact" />
		</div>
	);
}
