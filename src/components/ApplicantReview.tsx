export default function ApplicantReview() {
	return (
		<div className="min-h-[70vh] flex items-center">
			<div className="container max-w-xl mx-auto text-center">
				<h1 className="text-3xl font-bold text-primary mb-4">Thank You for Completing Your Intake</h1>
				<p className="text-lg text-muted-foreground mb-6">
					Your information has been received and is currently under review by our team.
				</p>

				<div className="bg-card rounded-lg shadow p-6 border border-border-muted">
					<p className="text-base">
						We will reach out by <span className="font-semibold">phone</span> or{" "}
						<span className="font-semibold">email</span> once we&apos;ve completed the review.
					</p>
				</div>

				<p className="text-sm text-muted-foreground mt-6">
					If you need to update your intake details, you may do so from your profile.
				</p>
			</div>
		</div>
	);
}
