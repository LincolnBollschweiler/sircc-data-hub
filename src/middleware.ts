import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const adminRoutes = createRouteMatcher(["/admin", "/admin/(.*)"]);
const coachRoutes = createRouteMatcher(["/coach", "/coach/(.*)"]);
const developerRoutes = createRouteMatcher(["/admin/dev/(.*)"]);
const volunteerRoutes = createRouteMatcher(["/volunteer", "/volunteer/(.*)"]);
const authRoutes = createRouteMatcher([
	"/sign-in",
	"/sign-up",
	"/sign-out",
	// add any other public/unauthenticated routes
]);

export default clerkMiddleware(async (auth, req) => {
	const requestHeaders = new Headers(req.headers);
	requestHeaders.set("x-url", req.url);

	// Skip public/auth routes
	if (authRoutes(req)) return NextResponse.next({ request: { headers: requestHeaders } });

	const { sessionClaims } = await auth();
	const role = sessionClaims?.role ?? "no-user";

	// ADMIN ROUTES
	if (adminRoutes(req)) {
		if (!role.includes("admin") && role !== "developer") {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next({ request: { headers: requestHeaders } });
	}

	// COACH ROUTES
	if (coachRoutes(req)) {
		if (!role.includes("coach")) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next({ request: { headers: requestHeaders } });
	}

	// DEVELOPER ROUTES
	if (developerRoutes(req)) {
		if (role !== "developer") {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next({ request: { headers: requestHeaders } });
	}

	// VOLUNTEER ROUTES
	if (volunteerRoutes(req)) {
		if (!role.includes("volunteer")) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next({ request: { headers: requestHeaders } });
	}

	// EVERYTHING ELSE
	return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
