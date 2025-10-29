import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const adminRoutes = createRouteMatcher(["/admin", "/admin/(.*)"]);
const coachRoutes = createRouteMatcher(["/coach", "/coach/(.*)"]);
const authRoutes = createRouteMatcher([
	"/sign-in",
	"/sign-up",
	"/sign-out",
	// add any other public/unauthenticated routes
]);

// export default clerkMiddleware();
export default clerkMiddleware(async (auth, req) => {
	// If this is a public/auth route, skip role checks
	if (authRoutes(req)) {
		return NextResponse.next();
	}
	const { sessionClaims } = await auth();
	const role = sessionClaims?.role ?? "no-user";
	// Protect admin routes
	if (adminRoutes(req) && role !== "admin") {
		console.warn("Access denied to admin route for role:", role);
		return NextResponse.redirect(new URL("/", req.url));
	}
	// Protect coach routes
	if (coachRoutes(req) && role !== "coach" && role !== "admin") {
		console.warn("Access denied to coach route for role:", role);
		return NextResponse.redirect(new URL("/", req.url));
	}
	// Allow all else
	return NextResponse.next();
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
