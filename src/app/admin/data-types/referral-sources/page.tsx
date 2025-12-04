import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getReferralSources } from "@/tableInteractions/db";
import ReferralSources from "@/components/data-types/referralSources/ReferralSources";
import ReferralSourcesFormDialog from "@/components/data-types/referralSources/ReferralSourcesFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export default async function ReferralSourcesPage() {
	const referralSources = await getReferralSources();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Referral Sources">
				<ReferralSourcesFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New Referral Source</Button>
					</DialogTrigger>
				</ReferralSourcesFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<ReferralSources items={referralSources} />
		</div>
	);
}
