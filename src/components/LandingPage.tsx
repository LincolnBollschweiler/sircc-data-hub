export default function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground">
			{/* HERO / Above-the-fold */}
			<header className="relative w-full bg-primary text-primary-foreground">
				<div className="container mx-auto py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-8">
					<div className="flex-1 space-y-6">
						<h1 className="text-4xl md:text-5xl font-bold leading-tight">
							{/* Short, impactful mission statement */}
							Helping People Rebuild Their Lives — One Step at a Time
						</h1>
						<p className="text-lg md:text-xl max-w-prose">
							We partner with communities across Idaho to offer housing support, recovery resources,
							mentoring, and hope. Join us — whether you need help, want to volunteer, or wish to support
							our mission.
						</p>
						<div className="flex flex-wrap gap-4">
							<a href="/signup" className="btn-primary px-6 py-3 text-lg">
								Get Started
							</a>
							<a href="/about" className="btn-secondary px-6 py-3 text-lg">
								Learn More
							</a>
						</div>
					</div>
					<div className="flex-1">
						{/* Hero image: real people/community, not stock if possible */}
						<img
							src="/images/community-hero.jpg"
							alt="Community support and volunteers"
							className="w-full rounded-lg shadow-lg object-cover max-h-[400px] md:max-h-[500px]"
						/>
					</div>
				</div>
			</header>

			{/* WHY / What We Do — quick value props */}
			<section className="container mx-auto py-16 space-y-12">
				<div className="grid gap-8 md:grid-cols-3">
					<div className="text-center">
						<h3 className="text-2xl font-semibold mb-2">Recovery & Support</h3>
						<p className="text-muted-foreground">
							Safe-housing referrals, sober living support, and community health services.
						</p>
					</div>
					<div className="text-center">
						<h3 className="text-2xl font-semibold mb-2">Mentorship & Coaching</h3>
						<p className="text-muted-foreground">
							Staff, volunteers, and coaches provide guidance toward stability and new beginnings.
						</p>
					</div>
					<div className="text-center">
						<h3 className="text-2xl font-semibold mb-2">Community Partnerships</h3>
						<p className="text-muted-foreground">
							We collaborate with local partners to connect people to jobs, housing, and life-changing
							resources.
						</p>
					</div>
				</div>
			</section>

			{/* IMPACT / Social Proof */}
			<section className="bg-background-light py-16">
				<div className="container mx-auto text-center space-y-8">
					<h2 className="text-3xl font-semibold">Real people. Real impact.</h2>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="space-y-2">
							<p className="text-4xl font-bold text-primary">500+</p>
							<p>Clients served last year</p>
						</div>
						<div className="space-y-2">
							<p className="text-4xl font-bold text-primary">120+</p>
							<p>Community partners statewide</p>
						</div>
						<div className="space-y-2">
							<p className="text-4xl font-bold text-primary">50+</p>
							<p>Active volunteers & coaches</p>
						</div>
					</div>
					<a href="/donate" className="btn-primary px-6 py-3 text-lg mt-6">
						Support Our Work
					</a>
				</div>
			</section>

			{/* STORIES / Testimonials */}
			<section className="container mx-auto py-16 space-y-12">
				<h2 className="text-3xl font-semibold text-center">Stories of Hope</h2>
				<div className="grid gap-8 md:grid-cols-2">
					{/* Example testimonial cards */}
					<blockquote className="p-6 bg-background-dark rounded-lg shadow">
						<p className="italic">
							“SIRCC helped me find housing when I had nowhere else to go. Now I have stability and hope.”
						</p>
						<footer className="mt-4 text-sm">— Former Client</footer>
					</blockquote>
					<blockquote className="p-6 bg-background-dark rounded-lg shadow">
						<p className="italic">
							“Volunteering with SIRCC changed my life. I found purpose and community.”
						</p>
						<footer className="mt-4 text-sm">— Volunteer</footer>
					</blockquote>
				</div>
			</section>

			{/* CALL TO ACTION / Join Us */}
			<section className="bg-secondary text-secondary-foreground py-16">
				<div className="container mx-auto text-center space-y-6">
					<h2 className="text-3xl md:text-4xl font-semibold">Ready to make a difference?</h2>
					<p className="text-lg max-w-prose mx-auto">
						Whether you need help or want to help others — we’re here for you. Submission only takes a few
						minutes.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a href="/signup" className="btn-primary px-6 py-3 text-lg">
							Get Started
						</a>
						<a href="/donate" className="btn-outline px-6 py-3 text-lg">
							Donate Now
						</a>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="bg-background-dark text-background-light py-8">
				<div className="container mx-auto space-y-4 text-sm">
					<p>© {new Date().getFullYear()} SIRCC — Hope & Support for Families & Individuals</p>
					<p>
						501(c)(3) Non-Profit | <a href="/privacy">Privacy & Terms</a>
					</p>
				</div>
			</footer>
		</div>
	);
}
