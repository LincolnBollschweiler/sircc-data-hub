import Navbar from "@/components/users/signed-in/Navbar";
import { ReactNode } from "react";

export default function CoachLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<>
			<Navbar userType="Volunteer" />
			{children}
		</>
	);
}
