import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getReferredOut } from "@/tableInteractions/db";
import { DialogTrigger } from "@/components/ui/dialog";
import ReferredOutFormDialog from "@/components/data-types/referredOut/ReferredOutFormDialog";
import ReferredOut from "@/components/data-types/referredOut/ReferredOut";
import Link from "next/link";

export default async function ReferredOutPage() {
	const referredOut = await getReferredOut();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Referred Out">
				<ReferredOutFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New Referred Out</Button>
					</DialogTrigger>
				</ReferredOutFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<ReferredOut items={referredOut} />
		</div>
	);
}
