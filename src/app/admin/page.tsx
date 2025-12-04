"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { DateRangeProvider } from "@/components/admin/DateRangeProvider";
import GlobalDateRangeSelector from "@/components/admin/GlobalDateRangeSelector";
import ProvidedServicesCard from "@/components/admin/ProvidedServicesCard";
import RequestedServicesCard from "@/components/admin/RequestedServicesCard";
import ReferralSourcesCard from "@/components/admin/ReferralSourcesCard";
import ReferredOutCard from "@/components/admin/ReferredOutCard";
import LocationCard from "@/components/admin/LocationCard";
import VisitCard from "@/components/admin/VisitCard";
import VolunteerCard from "@/components/admin/VolunteerCard";
import CoachCard from "@/components/admin/CoachCard";

export default function AdminPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<DateRangeProvider>
				<div className="container py-4">
					<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
					<GlobalDateRangeSelector />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ProvidedServicesCard />
						<RequestedServicesCard />
						<ReferralSourcesCard />
						<ReferredOutCard />
						<LocationCard />
						<VisitCard />
						<VolunteerCard />
						<CoachCard />
					</div>
				</div>
			</DateRangeProvider>
		</QueryClientProvider>
	);
}
