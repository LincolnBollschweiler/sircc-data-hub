import { NextResponse } from "next/server";
import {
	coachAggregate,
	locationAggregate,
	providedServicesAggregate,
	referralSourcesAggregate,
	referredOutAggregate,
	requestedServicesAggregate,
	visitAggregate,
	volunteerAggregate,
} from "@/lib/db/queries";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const metric = url.searchParams.get("metric");
	const start = url.searchParams.get("start");
	const end = url.searchParams.get("end");

	if (!metric || !start || !end) return NextResponse.json({ error: "missing" }, { status: 400 });

	try {
		switch (metric) {
			case "providedServices":
				return NextResponse.json(await providedServicesAggregate(start, end));
			case "requestedServices":
				return NextResponse.json(await requestedServicesAggregate(start, end));
			case "referralSources":
				return NextResponse.json(await referralSourcesAggregate(start, end));
			case "referredOut":
				return NextResponse.json(await referredOutAggregate(start, end));
			case "location":
				return NextResponse.json(await locationAggregate(start, end));
			case "visit":
				return NextResponse.json(await visitAggregate(start, end));
			case "volunteer":
				return NextResponse.json(await volunteerAggregate(start, end));
			case "coach":
				return NextResponse.json(await coachAggregate(start, end));
			default:
				return NextResponse.json({ error: "unknown metric" }, { status: 400 });
		}
	} catch (err) {
		console.error("Error in aggregates API:", err);
		return NextResponse.json({ error: "server error", details: String(err) }, { status: 500 });
	}
}
