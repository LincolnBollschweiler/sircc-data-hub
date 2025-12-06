"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { DateRangeProvider } from "./providers/DateRangeProvider";
import { queryClient } from "@/lib/react-query";
import ProvidedServicesCard from "./admin/ProvidedServicesCard";

export default function ApplicantAccepted({ role }: { role: string }) {
	return (
		<QueryClientProvider client={queryClient}>
			<DateRangeProvider>
				<div className="container py-10">
					{/* grid: 1 col default, 1 col at lg (so Welcome + card stack), 3 cols at 2xl */}
					<div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-3 gap-6 items-start">
						{/* Welcome: spans 2 columns at 2xl */}
						<div className="2xl:col-span-2 bg-card border border-border-muted rounded-lg shadow p-8">
							<h1 className="text-3xl font-bold text-primary mb-2">Welcome to the Community</h1>
							<p className="text-muted-foreground mb-6">
								We&apos;re glad you&apos;re here! Use the links below or in the navigation bar above to
								navigate your dashboard and access resouces.
							</p>
							<div className="grid gap-4 sm:grid-cols-2">
								{role.includes("client") && (
									<a
										href="/client/"
										className="block bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
									>
										<h2 className="text-lg font-semibold mb-1">Your Client Dashboard</h2>
										<p className="text-sm text-muted-foreground">
											Here you can see your past services or request one.
										</p>
									</a>
								)}
								{role.includes("volunteer") && (
									<a
										href="/volunteer/"
										className="block bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
									>
										<h2 className="text-lg font-semibold mb-1">Your Volunteer Dashboard</h2>
										<p className="text-sm text-muted-foreground">
											View your past volunteer activities and hours.
										</p>
									</a>
								)}
								{role.includes("coach") && (
									<a
										href="/coach/"
										className="block bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
									>
										<h2 className="text-lg font-semibold mb-1">Your Coach Dashboard</h2>
										<p className="text-sm text-muted-foreground">
											View your trainings, clients, hours, and mileage.
										</p>
									</a>
								)}
								{(role.includes("staff") || role.includes("admin")) && (
									<a
										href="/admin/"
										className="block bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
									>
										<h2 className="text-lg font-semibold mb-1">Admin Dashboard</h2>
										<p className="text-sm text-muted-foreground">
											Access administrative tools and manage data.
										</p>
									</a>
								)}
								<button
									onClick={() => {
										document.getElementById("profile-dialog-trigger")?.click();
									}}
									className="block text-left bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
								>
									<h2 className="text-lg font-semibold mb-1">Your Profile</h2>
									<p className="text-sm text-muted-foreground">
										Update your personal information or contact details.
									</p>
								</button>
								<a
									href="https://www.sircc-tencsinc.com/events/"
									rel="noopener noreferrer"
									target="_blank"
									className="block bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
								>
									<h2 className="text-lg font-semibold mb-1">Upcoming Events</h2>
									<p className="text-sm text-muted-foreground">
										See what’s happening and get involved.
									</p>
								</a>

								<a
									href="https://www.sircc-tencsinc.com/resources/"
									rel="noopener noreferrer"
									target="_blank"
									className="block bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
								>
									<h2 className="text-lg font-semibold mb-1">Resources</h2>
									<p className="text-sm text-muted-foreground">
										Browse helpful materials and support tools.
									</p>
								</a>

								<a
									href="https://www.sircc-tencsinc.com/contact-us/"
									rel="noopener noreferrer"
									target="_blank"
									className="block bg-background-light border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-5"
								>
									<h2 className="text-lg font-semibold mb-1">Contact Us</h2>
									<p className="text-sm text-muted-foreground">
										Get in touch with our team if you need assistance.
									</p>
								</a>
							</div>
						</div>

						{/* ProvidedServicesCard wrapper:
						    - centers the card when grid is 1-col (lg and below)
						    - normal flow when 2xl (it occupies the 3rd column)
						    The inner div constrains width so the card is nicely centered on lg */}
						<div className="flex justify-center 2xl:justify-start">
							<div className="w-full max-w-3xl 2xl:max-w-none">
								<ProvidedServicesCard />
							</div>
						</div>
					</div>
				</div>
			</DateRangeProvider>
		</QueryClientProvider>
	);
}
