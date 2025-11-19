import PageHeader from "@/components/PageHeader";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { userSchema } from "@/userInteractions/schema";
import ProfileForm from "@/components/users/profile/ProfileForm";
import { z } from "zod";
import ClientDetailsWrapper from "@/components/users/clients/ClientDetailsWrapper";

export default async function Home() {
	const currentUser = await getCurrentUser({ allData: true });
	const profile = currentUser?.data as z.infer<typeof userSchema> & { id: string };
	const intakeComplete = (profile?.birthDay && profile?.birthMonth) || profile?.phone;
	const clientUser = currentUser?.role === "client" || currentUser?.role === "client-volunteer";
	return (
		<>
			<SignedIn>
				{/* TODO - fix up the css below, depending on if more info is added */}
				{currentUser && clientUser && intakeComplete && <ClientDetailsWrapper clientId={profile.id} />}
				{!intakeComplete && (
					<div className="container w-fit m-auto">
						<div className="mt-4 py-4 px-6 bg-background-light rounded-md shadow-md">
							<PageHeader title="Please Complete Your Intake Form" />
							<ProfileForm profile={profile} isIntake={true} />
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
