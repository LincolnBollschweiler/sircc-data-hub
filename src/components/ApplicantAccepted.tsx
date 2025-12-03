export default function ApplicantAccepted() {
	return (
		<div className="min-h-[70vh] flex items-center">
			<div className="container max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold text-primary mb-2">Welcome to the Community</h1>
				<p className="text-muted-foreground mb-8">
					Your application has been accepted. We&apos;re glad you&apos;re here.
				</p>

				<div className="grid gap-6 sm:grid-cols-2">
					{/* Profile */}
					<a
						href="/profile"
						className="block bg-card border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-6"
					>
						<h2 className="text-xl font-semibold mb-2">Your Profile</h2>
						<p className="text-sm text-muted-foreground">
							Update your personal information or contact details.
						</p>
					</a>

					{/* Events */}
					<a
						href="/events"
						className="block bg-card border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-6"
					>
						<h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
						<p className="text-sm text-muted-foreground">See what’s happening and get involved.</p>
					</a>

					{/* Resources */}
					<a
						href="/resources"
						className="block bg-card border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-6"
					>
						<h2 className="text-xl font-semibold mb-2">Resources</h2>
						<p className="text-sm text-muted-foreground">Browse helpful materials and support tools.</p>
					</a>

					{/* Contact */}
					<a
						href="/contact-us"
						className="block bg-card border border-border-muted rounded-lg shadow hover:shadow-md transition-shadow p-6"
					>
						<h2 className="text-xl font-semibold mb-2">Contact Us</h2>
						<p className="text-sm text-muted-foreground">
							Get in touch with our team if you need assistance.
						</p>
					</a>
				</div>
			</div>
		</div>
	);
}
