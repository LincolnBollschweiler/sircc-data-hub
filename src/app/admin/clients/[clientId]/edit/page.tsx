import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ReentryCheckListWrapper from "@/components/users/clients/ReentryCheckListWrapper";
import DataTable from "@/components/users/DataTable";
import { ClientDetails } from "@/components/users/clients/ClientDetails";
import { getAllClientServiceTables } from "@/tableInteractions/db";
import { getClientById, getAllCoachUsers, ClientServiceFull } from "@/userInteractions/db";
import Link from "next/link";
import { getCurrentUser } from "@/services/clerk";

export default async function ViewClientPage({
	params,
	searchParams,
}: {
	params: Promise<{ clientId: string }>;
	searchParams: Promise<{ coachId?: string | undefined }>;
}) {
	const [{ clientId }, { coachId }, currentUser] = await Promise.all([
		params,
		searchParams,
		getCurrentUser({ allData: true }),
	]);

	const coachIsViewing = currentUser?.role === "coach";

	if (!currentUser || (coachIsViewing && currentUser.data?.id !== coachId)) {
		return (
			<div className="text-center py-10 text-xl font-semibold flex flex-col items-center">
				Access Denied
				<Button className="mt-4" asChild>
					<Link href="/">Back to Home</Link>
				</Button>
			</div>
		);
	}

	const [fullClient, allCoaches, csTables] = await Promise.all([
		getClientById(clientId),
		getAllCoachUsers(),
		getAllClientServiceTables(),
	]);

	if (!fullClient) return <div className="text-center py-10 text-xl font-semibold">Client not found</div>;

	// const backToLink = !coachId ? `/admin/clients` : coachIsViewing ? "/" : `/admin/coaches/${coachId}/edit`;
	const backToLink = coachId ? `/admin/coaches/${coachId}/edit` : `/admin/clients`;
	const backToText = coachId ? `Back to Coach` : `Back to Clients`;

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
					<Link href={backToLink}>{backToText}</Link>
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
					<ClientDetails
						user={fullClient.user}
						client={fullClient.client}
						allCoaches={allCoaches}
						coachIsViewing={coachIsViewing}
					/>
					{fullClient.client.isReentryClient && (
						<ReentryCheckListWrapper
							clientId={clientId}
							clientCheckListItems={fullClient.checkListItems}
							coachIsViewing={coachIsViewing}
						/>
					)}
					<DataTable
						title="Services"
						data={fullClient.clientServices as ClientServiceFull[]}
						userType="single-client"
						csTables={csTables}
						clientId={clientId}
						coachIsViewing={coachIsViewing}
					/>
				</>
			)}
		</div>
	);
}
