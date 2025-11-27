import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const adminRoutes = createRouteMatcher(["/admin", "/admin/(.*)"]);
const coachRoutes = createRouteMatcher(["/admin/clients/(.*)/edit"]);
const authRoutes = createRouteMatcher([
	"/sign-in",
	"/sign-up",
	"/sign-out",
	// add any other public/unauthenticated routes
]);

export default clerkMiddleware(async (auth, req) => {
	// Skip public/auth routes
	if (authRoutes(req)) return NextResponse.next();

	const { sessionClaims } = await auth();
	const role = sessionClaims?.role ?? "no-user";

	// --- COACH ROUTES ---
	if (coachRoutes(req) && role === "coach") {
		return NextResponse.next();
	}

	// --- ADMIN ROUTES ---
	if (adminRoutes(req)) {
		// admins & developers only
		if (role !== "admin" && role !== "developer") {
			return NextResponse.redirect(new URL("/", req.url));
			console.warn("Access denied to admin route for role:", role);
		}
		return NextResponse.next();
	}

	// Allow everything else (including "/")
	return NextResponse.next();
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
