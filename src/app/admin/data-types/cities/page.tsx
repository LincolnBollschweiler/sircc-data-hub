import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getCities } from "@/tableInteractions/db";
import { DialogTrigger } from "@/components/ui/dialog";
import Cities from "@/components/data-types/cities/Cities";
import CitiesFormDialog from "@/components/data-types/cities/CitiesFormDialog";
import Link from "next/link";

export default async function CitiesPage() {
	const cities = await getCities();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Cities">
				<CitiesFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New City</Button>
					</DialogTrigger>
				</CitiesFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<Cities items={cities} />
		</div>
	);
}
