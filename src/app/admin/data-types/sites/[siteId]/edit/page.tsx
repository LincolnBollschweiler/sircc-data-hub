import PageHeader from "@/components/PageHeader";
import SitesForm from "@/components/sites/SitesForm";
import { getSiteIdTag } from "@/tableInteractions/cache";
import { getSiteById } from "@/tableInteractions/db";
import { unstable_cache } from "next/cache";

export default async function EditSitesPage({ params }: { params: Promise<{ siteId: string }> }) {
	const { siteId } = await params;
	const site = await getCachedSite(siteId);
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="Edit Site" />
			<SitesForm site={site} />
		</div>
	);
}

const getCachedSite = (siteId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getSiteById(siteId);
		},
		["getSiteById", siteId],
		{ tags: [getSiteIdTag(siteId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
