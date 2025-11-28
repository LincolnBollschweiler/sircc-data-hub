import { UserButton } from "@clerk/nextjs";
import HeaderLinks from "./HeaderLinks";

export default function SignedInNavbar() {
	return (
		<>
			<HeaderLinks />
			<div className="size-8 self-center ml-[0.5rem]">
				<UserButton
					appearance={{
						elements: {
							userButtonAvatarBox: { width: "100%", height: "100%" },
						},
					}}
				/>
			</div>
		</>
	);
}
