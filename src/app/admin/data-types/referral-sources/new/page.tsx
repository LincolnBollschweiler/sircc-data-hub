import PageHeader from "@/components/PageHeader";
import ReferralSourcesForm from "@/components/referralSources/ReferralSourcesForm";

export default function NewReferralSourcePage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Referral Source" />
			<ReferralSourcesForm />
		</div>
	);
}
