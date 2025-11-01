import PageHeader from "@/components/PageHeader";
import ReferralSourcesForm from "@/components/referralSources/ReferralSourcesForm";

export default function NewReferralSourcePage() {
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="New Referral Source" />
			<ReferralSourcesForm />
		</div>
	);
}
