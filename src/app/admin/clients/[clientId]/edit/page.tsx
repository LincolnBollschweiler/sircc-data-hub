import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ReentryCheckListWrapper from "@/components/users/clients/ReentryCheckListWrapper";
import DataTable from "@/components/users/DataTable";
import { ClientDetails } from "@/components/users/clients/ClientDetails";
import { getAllClientServiceTables } from "@/tableInteractions/db";
import { getClientById, getAllCoachUsers, ClientServiceFull } from "@/userInteractions/db";
import Link from "next/link";
import { getCurrentClerkUser } from "@/services/clerk";

export default async function ViewClientPage({ params }: { params: Promise<{ clientId: string }> }) {
	const [{ clientId }, { role }] = await Promise.all([params, getCurrentClerkUser()]);
	console.log("Current role:", role); // used to allow build ... might want if we
	// need to conditionlly disallow staff actions later
	const [fullClient, allCoaches, csTables] = await Promise.all([
		getClientById(clientId),
		getAllCoachUsers(),
		getAllClientServiceTables(),
	]);

	if (!fullClient) return <div className="text-center py-10 text-xl font-semibold">Client not found</div>;

	const followUpNeeded = fullClient.client.followUpNeeded;
	const today = new Date();
	let followUpLabel = "Follow-Up Needed on ";
	let followUpClass = "my-4 p-4 border-l-4 border-warning bg-warning/10";
	const followUpDate = fullClient.client.followUpDate;
	let followUpDateObject;
	if (followUpNeeded && followUpDate != null) {
		followUpDateObject = new Date(followUpDate);
		if (followUpDateObject < today) {
			followUpLabel = "Follow-Up Overdue as of ";
			followUpClass = "my-4 p-4 border-l-4 border-danger bg-danger/10";
		}
	}

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={`View Client`}>
				<Button asChild>
					<Link href="/admin/clients">Back to Clients</Link>
				</Button>
			</PageHeader>
			{fullClient && (
				<>
					{fullClient.client.followUpNeeded && (
						<div className={followUpClass}>
							<h3 className="font-semibold text-lg mb-2">
								<span>{followUpLabel}</span>
								<span>
									{followUpDateObject?.toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</h3>
							<p>{fullClient.client.followUpNotes}</p>
						</div>
					)}
					<ClientDetails user={fullClient.user} client={fullClient.client} allCoaches={allCoaches} />
					{fullClient.client.isReentryClient && (
						<ReentryCheckListWrapper clientId={clientId} clientCheckListItems={fullClient.checkListItems} />
					)}
					<DataTable
						title="Services"
						data={fullClient.clientServices as ClientServiceFull[]}
						userType="single-client"
						csTables={csTables}
						userId={clientId}
					/>
				</>
			)}
		</div>
	);
}
