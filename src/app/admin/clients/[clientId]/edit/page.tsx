import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ReentryCheckListWrapper from "@/components/users/clients/ReentryCheckListWrapper";
import DataTable from "@/components/users/DataTable";
import { ClientDetails } from "@/components/users/clients/ClientDetails";
import { getAllClientServiceTables } from "@/tableInteractions/db";
import { getClientById, getAllCoachUsers, ClientServiceFull } from "@/userInteractions/db";
import Link from "next/link";

export default async function ViewClientPage({
	params,
	searchParams,
}: {
	params: Promise<{ clientId: string }>;
	searchParams: Promise<{ coachId?: string | undefined }>;
}) {
	const { clientId } = await params;
	const { coachId } = await searchParams;
	const fullClient = await getClientById(clientId);
	if (!fullClient) {
		return <div className="text-center py-10 text-xl font-semibold">Client not found</div>;
	}

	const allCoaches = await getAllCoachUsers();
	const csTables = await getAllClientServiceTables();

	const backToLink = coachId ? `/admin/coaches/${coachId}/edit` : `/admin/clients`;
	const backToText = coachId ? `Back to Coach` : `Back to Clients`;

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={`View Client`}>
				<Button asChild>
					<Link href={backToLink}>{backToText}</Link>
				</Button>
			</PageHeader>
			{fullClient && (
				<>
					<ClientDetails user={fullClient.user} client={fullClient.client} allCoaches={allCoaches} />
					{fullClient.client.isReentryClient && <ReentryCheckListWrapper clientId={clientId} />}
					{fullClient.client.followUpNeeded && (
						<div className="my-4 p-4 border-l-4 border-warning bg-warning/10">
							<h3 className="font-semibold text-lg mb-2">Follow-Up Needed</h3>
							<p>{fullClient.client.followUpNotes}</p>
							{fullClient.client.followUpDate && (
								<p className="mt-2">
									{new Date(fullClient.client.followUpDate).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							)}
						</div>
					)}
					<DataTable
						title="Services"
						data={fullClient.clientServices as ClientServiceFull[]}
						userType="single-client"
						csTables={csTables}
						clientId={clientId}
					/>
				</>
			)}
		</div>
	);
}
