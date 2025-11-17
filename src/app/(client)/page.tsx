import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { getUserSites } from "@/userInteractions/db";
import { userSchema } from "@/userInteractions/schema";
import ProfileForm from "@/components/users/profile/ProfileForm";
import { z } from "zod";

export default async function Home() {
	const currentUser = await getCurrentUser({ allData: true });
	const profile = currentUser?.data as z.infer<typeof userSchema> & { id: string };
	const intakeComplete = (profile?.birthDay && profile?.birthMonth) || profile?.phone;
	const sites = await getUserSites();

	return (
		<>
			<SignedIn>
				{/* TODO - fix up the css below, depending on if more info is added */}
				{intakeComplete && (
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
				{!intakeComplete && (
					<div className="container w-fit m-auto">
						<div className="mt-4 py-4 px-6 bg-background-light rounded-md shadow-md">
							<PageHeader title="Please Complete Your Intake Form" />
							<ProfileForm profile={profile} sites={sites} isIntake={true} />
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
