import PageHeader from "@/components/PageHeader";
import { getCurrentClerkUser } from "@/services/clerk";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { clerkUserSchema } from "@/userInteractions/schema";
import ProfileForm from "@/components/users/profile/ProfileForm";
import { z } from "zod";

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
				{intakeComplete && !accepted && (
					<div className="p-20 text-center">
						We have received your application and will review it soon. We will reach out to you via
						telephone (if provided) or email.
					</div>
				)}
				{intakeComplete && accepted && (
					<div className="p-20 text-center">
						Welcome to the community! Your application has been accepted.
					</div>
				)}
			</SignedIn>
			<SignedOut>
				<div className="container flex gap-3">Signed out stuff</div>
			</SignedOut>
		</>
	);
}
