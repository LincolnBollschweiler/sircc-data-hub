import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const adminRoutes = createRouteMatcher(["/admin", "/admin/(.*)"]);
const coachRoutes = createRouteMatcher(["/coach", "/coach/(.*)"]);
const developerRoutes = createRouteMatcher(["/admin/dev/(.*)"]);
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

	// --- ADMIN ROUTES ---
	if (adminRoutes(req)) {
		// admins & developers only
		if (role !== "admin" && role !== "developer") {
			return NextResponse.redirect(new URL("/", req.url));
			console.warn("Access denied to admin route for role:", role);
		}
		return NextResponse.next();
	}

	if (coachRoutes(req)) {
		// coaches, admins & developers only
		if (role !== "coach") {
			return NextResponse.redirect(new URL("/", req.url));
			console.warn("Access denied to coach route for role:", role);
		}
	}

	// --- DEVELOPER ROUTES ---
	if (developerRoutes(req)) {
		// developers only
		if (role !== "developer") {
			return NextResponse.redirect(new URL("/", req.url));
			console.warn("Access denied to developer route for role:", role);
		}
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
