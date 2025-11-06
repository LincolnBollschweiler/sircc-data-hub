import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserSites } from "@/userInteractions/db";
import { userSchema } from "@/userInteractions/schema";
import ProfileForm from "@/components/users/ProfileForm";
import { z } from "zod";

export default async function Home() {
	const currentUser = await getCurrentUser({ allData: true });
	const profile = currentUser?.data as z.infer<typeof userSchema> & { id: string };
	const intakeNotes = profile?.notes;
	const hasCompletedIntake = intakeNotes && intakeNotes.length > 2;
	const sites = await getUserSites();

	return (
		<>
			<SignedIn>
				{/* TODO - fix up the css below, depending on if more info is added */}
				{hasCompletedIntake && (
					<div className="container flex gap-3">
						<div className="flex-grow flex-shrink container mt-4 py-4 px-6 bg-background-light rounded-md shadow-md">
							<PageHeader title="Your Client Services">
								<Button asChild>
									<Link href="/request-client-services">Request</Link>
								</Button>
							</PageHeader>
							<p>Welcome to your client services page!</p>
						</div>
					</div>
				)}
				{!hasCompletedIntake && (
					<div className="container w-fit m-auto">
						<div className="mt-4 py-4 px-6 bg-background-light rounded-md shadow-md">
							<PageHeader title="Please Complete Your Intake Form" />
							<ProfileForm profile={profile} sites={sites} intakeNotes={true} />
						</div>
					</div>
				)}
			</SignedIn>
			<SignedOut>
				<div className="container flex gap-3">Stuff</div>
			</SignedOut>
		</>
	);
}
