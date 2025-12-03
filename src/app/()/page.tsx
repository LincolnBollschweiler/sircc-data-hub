import PageHeader from "@/components/PageHeader";
import { getCurrentClerkUser } from "@/services/clerk";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { clerkUserSchema } from "@/userInteractions/schema";
import ProfileForm from "@/components/users/profile/ProfileForm";
import { z } from "zod";
import LandingPage from "@/components/LandingPage";
import ApplicantReview from "@/components/ApplicantReview";
import ApplicantAccepted from "@/components/ApplicantAccepted";

export default async function Home() {
	const currentUser = await getCurrentClerkUser({ allData: true });
	const profile = currentUser?.data as z.infer<typeof clerkUserSchema> & { id: string };
	const intakeComplete = (profile?.birthDay && profile?.birthMonth) || profile?.phone;
	const accepted = profile?.accepted;
	return (
		<>
			<SignedIn>
				{!intakeComplete && (
					<div className="container w-fit m-auto">
						<div className="mt-4 py-4 px-6 bg-background-light rounded-md shadow-md">
							<PageHeader title="Please Complete Your Intake Form" />
							<ProfileForm profile={profile} isIntake={true} />
						</div>
					</div>
				)}
				{intakeComplete && !accepted && <ApplicantReview />}
				{intakeComplete && accepted && <ApplicantAccepted />}
			</SignedIn>
			<SignedOut>
				<LandingPage />
			</SignedOut>
		</>
	);
}
