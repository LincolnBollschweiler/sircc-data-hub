import PageHeader from "@/components/PageHeader";
import ReferralSourcesForm from "@/components/referralSources/ReferralSourcesForm";
import { getReferralSourceIdTag } from "@/tableInteractions/cache";
import { getReferralSourceById } from "@/tableInteractions/db";
import { unstable_cache } from "next/cache";

export default async function EditReferralSourcesPage({ params }: { params: Promise<{ referralSourceId: string }> }) {
	const { referralSourceId } = await params;
	const referralSource = await getCachedReferralSource(referralSourceId);
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="Edit Referral Source" />
			<ReferralSourcesForm referralSource={referralSource} />
		</div>
	);
}

const getCachedReferralSource = (referralSourceId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getReferralSourceById(referralSourceId);
		},
		["getReferralSourceById", referralSourceId],
		{ tags: [getReferralSourceIdTag(referralSourceId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
