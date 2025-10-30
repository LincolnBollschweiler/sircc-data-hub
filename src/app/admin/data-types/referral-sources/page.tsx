import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { getReferralSources } from "@/tableInteractions/db";
import ReferralSources from "@/components/referralSources/ReferralSources";

export default async function ReferralSourcesPage() {
	const referralSources = await getReferralSources();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Referral Sources">
				<Button asChild>
					<Link href="/admin/data-types/referral-sources/new">Add New Referral Source</Link>
				</Button>
			</PageHeader>
			<ReferralSources items={referralSources} />
		</div>
	);
}
