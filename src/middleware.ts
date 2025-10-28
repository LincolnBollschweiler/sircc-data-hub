import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const adminRoutes = createRouteMatcher(["/admin", "/admin/(.*)"]);
const coachRoutes = createRouteMatcher(["/coach", "/coach/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const { userId, sessionClaims } = await auth();

	// Allow unauthenticated users only to non-protected pages
	if (!userId) {
		return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	// Assuming you store roles in Clerk publicMetadata or sessionClaims
	const role = sessionClaims?.metadata?.role || sessionClaims?.role || "client";

	console.log("User role in middleware:", role);

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

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const adminRoutes = createRouteMatcher(["/admin", "/admin/(.*)"]);
// const coachRoutes = createRouteMatcher(["/coach", "/coach/(.*)"]);

// export default clerkMiddleware(async (auth, request) => {
// 	try {
// 		if (adminRoutes(request)) {
// 			await auth.protect({ role: "admin" });
// 		} else if (coachRoutes(request)) {
// 			await auth.protect({ role: "coach" });
// 		}
// 	} catch (err) {
// 		console.warn("Unauthorized access detected. Redirecting to homepage.", err.message);
// 		return NextResponse.redirect(new URL("/", request.url));
// 	}
// });

// export const config = {
// 	matcher: [
// 		// Skip Next.js internals and all static files, unless found in search params
// 		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// 		// Always run for API routes
// 		"/(api|trpc)(.*)",
// 	],
// };
