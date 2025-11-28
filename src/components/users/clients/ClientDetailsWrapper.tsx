import PageHeader from "@/components/PageHeader";
import CoachDetails from "./CoachDetails";
import ReentryCheckListWrapper from "./ReentryCheckListWrapper";
import DataTable from "../DataTable";
import { ClientServiceFull, getClientById } from "@/userInteractions/db";
import { getServices } from "@/tableInteractions/db";

export default async function ClientDetailsWrapper({ clientId }: { clientId: string }) {
	const [fullClient, services] = await Promise.all([getClientById(clientId), getServices()]);

	return (
		<>
			{fullClient && (
				<div className="container py-4 mx-auto">
					<PageHeader title="Client Details" />
					{fullClient.coach && (
						<CoachDetails coach={fullClient.coach} coachDetails={fullClient.coachDetails} />
					)}
					<ReentryCheckListWrapper
						clientId={clientId}
						clientCheckListItems={fullClient.checkListItems}
						isClientView={true}
					/>
					<DataTable
						title="Services"
						data={fullClient.clientServices as ClientServiceFull[]}
						userType="single-client-view"
						userId={clientId}
						services={services}
					/>
				</div>
			)}
		</>
	);
}
