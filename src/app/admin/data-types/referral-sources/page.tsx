import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getReferralSources } from "@/tableInteractions/db";
import ReferralSources from "@/components/referralSources/ReferralSources";
import ReferralSourcesFormDialog from "@/components/referralSources/ReferralSourcesFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default async function ReferralSourcesPage() {
	const referralSources = await getReferralSources();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Referral Sources">
				<ReferralSourcesFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Referral Source</Button>
					</DialogTrigger>
				</ReferralSourcesFormDialog>
			</PageHeader>
			<ReferralSources items={referralSources} />
		</div>
	);
}
