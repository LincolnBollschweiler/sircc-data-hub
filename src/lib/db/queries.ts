import { db } from "@/drizzle/db";
import {
	clientService,
	referralSource,
	referredOut,
	service,
	location,
	visit,
	volunteeringType,
	volunteerHours,
	coachMileage,
	coachHours,
} from "@/drizzle/schema";
import { and, eq, gte, isNotNull, lte, sql } from "drizzle-orm";

//#region Provided Service
type ProvidedServiceRow = {
	providedServiceId: string | null;
	name: string | null;
	cnt: number;
};

export type ProvidedServiceResponse = {
	rows: ProvidedServiceRow[];
	total: number;
};

export async function providedServicesAggregate(startIso: string, endIso: string): Promise<ProvidedServiceResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN AGGREGATE QUERY (FULLY TYPED) ----
	const rows = await db
		.select({
			providedServiceId: clientService.providedServiceId,
			name: service.name,
			cnt: sql<number>`COUNT(${clientService.id})::int`.as("cnt"),
		})
		.from(clientService)
		.leftJoin(service, eq(service.id, clientService.providedServiceId))
		.where(
			and(
				isNotNull(clientService.providedServiceId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		)
		.groupBy(clientService.providedServiceId, service.name)
		.orderBy(sql`cnt DESC`);

	// ---- TOTAL COUNT (STRICTLY TYPED) ----
	const totalResult = await db
		.select({
			total: sql<number>`COUNT(${clientService.id})::int`,
		})
		.from(clientService)
		.where(
			and(
				isNotNull(clientService.providedServiceId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		);

	const total = totalResult[0]?.total ?? 0;

	// ---- NORMALIZED RETURN TYPE ----
	const normalized: ProvidedServiceRow[] = rows.map((r) => ({
		providedServiceId: r.providedServiceId,
		name: r.name,
		cnt: r.cnt,
	}));

	return { rows: normalized, total };
}
//#endregion

//#region Requested Service
type RequestedServiceRow = {
	requestedServiceId: string | null;
	name: string | null;
	cnt: number;
};

export type RequestedServiceResponse = {
	rows: RequestedServiceRow[];
	total: number;
};

export async function requestedServicesAggregate(startIso: string, endIso: string): Promise<RequestedServiceResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN AGGREGATE QUERY (FULLY TYPED) ----
	const rows = await db
		.select({
			requestedServiceId: clientService.requestedServiceId,
			name: service.name,
			cnt: sql<number>`COUNT(${clientService.id})::int`.as("cnt"),
		})
		.from(clientService)
		.leftJoin(service, eq(service.id, clientService.requestedServiceId))
		.where(
			and(
				isNotNull(clientService.requestedServiceId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		)
		.groupBy(clientService.requestedServiceId, service.name)
		.orderBy(sql`cnt DESC`);

	// ---- TOTAL COUNT (STRICTLY TYPED) ----
	const totalResult = await db
		.select({
			total: sql<number>`COUNT(${clientService.id})::int`,
		})
		.from(clientService)
		.where(
			and(
				isNotNull(clientService.requestedServiceId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		);

	const total = totalResult[0]?.total ?? 0;

	// ---- NORMALIZED RETURN TYPE ----
	const normalized: RequestedServiceRow[] = rows.map((r) => ({
		requestedServiceId: r.requestedServiceId,
		name: r.name,
		cnt: r.cnt,
	}));

	return { rows: normalized, total };
}
//#endregion

//#region Referral Source
type ReferralSourceRow = {
	referralSourceId: string | null;
	name: string | null;
	cnt: number;
};

export type ReferralSourceResponse = {
	rows: ReferralSourceRow[];
	total: number;
};

export async function referralSourcesAggregate(startIso: string, endIso: string): Promise<ReferralSourceResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN AGGREGATE QUERY (FULLY TYPED) ----
	const rows = await db
		.select({
			referralSourceId: clientService.referralSourceId,
			name: referralSource.name,
			cnt: sql<number>`COUNT(${clientService.id})::int`.as("cnt"),
		})
		.from(clientService)
		.leftJoin(referralSource, eq(referralSource.id, clientService.referralSourceId))
		.where(
			and(
				isNotNull(clientService.referralSourceId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		)
		.groupBy(clientService.referralSourceId, referralSource.name)
		.orderBy(sql`cnt DESC`);

	// ---- TOTAL COUNT (STRICTLY TYPED) ----
	const totalResult = await db
		.select({
			total: sql<number>`COUNT(${clientService.id})::int`,
		})
		.from(clientService)
		.where(
			and(
				isNotNull(clientService.referralSourceId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		);

	const total = totalResult[0]?.total ?? 0;

	// ---- NORMALIZED RETURN TYPE ----
	const normalized: ReferralSourceRow[] = rows.map((r) => ({
		referralSourceId: r.referralSourceId,
		name: r.name,
		cnt: r.cnt,
	}));

	return { rows: normalized, total };
}
//#endregion

//#region Referred Out
type ReferredOutRow = {
	referredOutId: string | null;
	name: string | null;
	cnt: number;
};

export type ReferredOutResponse = {
	rows: ReferredOutRow[];
	total: number;
};

export async function referredOutAggregate(startIso: string, endIso: string): Promise<ReferredOutResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN AGGREGATE QUERY (FULLY TYPED) ----
	const rows = await db
		.select({
			referredOutId: clientService.referredOutId,
			name: referredOut.name,
			cnt: sql<number>`COUNT(${clientService.id})::int`.as("cnt"),
		})
		.from(clientService)
		.leftJoin(referredOut, eq(referredOut.id, clientService.referredOutId))
		.where(
			and(
				isNotNull(clientService.referredOutId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		)
		.groupBy(clientService.referredOutId, referredOut.name)
		.orderBy(sql`cnt DESC`);

	// ---- TOTAL COUNT (STRICTLY TYPED) ----
	const totalResult = await db
		.select({
			total: sql<number>`COUNT(${clientService.id})::int`,
		})
		.from(clientService)
		.where(
			and(
				isNotNull(clientService.referredOutId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		);

	const total = totalResult[0]?.total ?? 0;

	// ---- NORMALIZED RETURN TYPE ----
	const normalized: ReferredOutRow[] = rows.map((r) => ({
		referredOutId: r.referredOutId,
		name: r.name,
		cnt: r.cnt,
	}));

	return { rows: normalized, total };
}
//#endregion

//#region Location
type LocationRow = {
	locationId: string | null;
	name: string | null;
	cnt: number;
};

export type LocationResponse = {
	rows: LocationRow[];
	total: number;
};

export async function locationAggregate(startIso: string, endIso: string): Promise<LocationResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN AGGREGATE QUERY (FULLY TYPED) ----
	const rows = await db
		.select({
			locationId: clientService.locationId,
			name: location.name,
			cnt: sql<number>`COUNT(${clientService.id})::int`.as("cnt"),
		})
		.from(clientService)
		.leftJoin(location, eq(location.id, clientService.locationId))
		.where(
			and(
				isNotNull(clientService.locationId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		)
		.groupBy(clientService.locationId, location.name)
		.orderBy(sql`cnt DESC`);

	// ---- TOTAL COUNT (STRICTLY TYPED) ----
	const totalResult = await db
		.select({
			total: sql<number>`COUNT(${clientService.id})::int`,
		})
		.from(clientService)
		.where(
			and(
				isNotNull(clientService.locationId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		);

	const total = totalResult[0]?.total ?? 0;

	// ---- NORMALIZED RETURN TYPE ----
	const normalized: LocationRow[] = rows.map((r) => ({
		locationId: r.locationId,
		name: r.name,
		cnt: r.cnt,
	}));

	return { rows: normalized, total };
}
//#endregion

//#region Visit
type VisitRow = {
	visitId: string | null;
	name: string | null;
	cnt: number;
};

export type VisitResponse = {
	rows: VisitRow[];
	total: number;
};

export async function visitAggregate(startIso: string, endIso: string): Promise<VisitResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN AGGREGATE QUERY (FULLY TYPED) ----
	const rows = await db
		.select({
			visitId: clientService.visitId,
			name: visit.name,
			cnt: sql<number>`COUNT(${clientService.id})::int`.as("cnt"),
		})
		.from(clientService)
		.leftJoin(visit, eq(visit.id, clientService.visitId))
		.where(
			and(
				isNotNull(clientService.visitId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		)
		.groupBy(clientService.visitId, visit.name)
		.orderBy(sql`cnt DESC`);

	// ---- TOTAL COUNT (STRICTLY TYPED) ----
	const totalResult = await db
		.select({
			total: sql<number>`COUNT(${clientService.id})::int`,
		})
		.from(clientService)
		.where(
			and(
				isNotNull(clientService.visitId),
				gte(clientService.updatedAt, start),
				lte(clientService.updatedAt, end)
			)
		);

	const total = totalResult[0]?.total ?? 0;

	// ---- NORMALIZED RETURN TYPE ----
	const normalized: VisitRow[] = rows.map((r) => ({
		visitId: r.visitId,
		name: r.name,
		cnt: r.cnt,
	}));

	return { rows: normalized, total };
}
//#endregion

//#region Volunteer
type VolunteerRow = {
	volunteeringTypeId: string | null;
	name: string | null;
	cnt: number;
};

export type VolunteerResponse = {
	rows: VolunteerRow[];
	total: number;
};

export async function volunteerAggregate(startIso: string, endIso: string): Promise<VolunteerResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN AGGREGATE QUERY (FULLY TYPED) ----
	const rows = await db
		.select({
			volunteeringTypeId: volunteerHours.volunteeringTypeId,
			name: volunteeringType.name,
			cnt: sql<number>`SUM(${volunteerHours.hours})`.as("cnt"),
		})
		.from(volunteerHours)
		.leftJoin(volunteeringType, eq(volunteeringType.id, volunteerHours.volunteeringTypeId))
		.where(
			and(
				isNotNull(volunteerHours.volunteeringTypeId),
				gte(volunteerHours.date, start),
				lte(volunteerHours.date, end)
			)
		)
		.groupBy(volunteerHours.volunteeringTypeId, volunteeringType.name)
		.orderBy(sql`cnt DESC`);

	// ---- TOTAL COUNT (STRICTLY TYPED) ----
	const totalResult = await db
		.select({
			total: sql<number>`SUM(${volunteerHours.hours})`,
		})
		.from(volunteerHours)
		.where(
			and(
				isNotNull(volunteerHours.volunteeringTypeId),
				gte(volunteerHours.date, start),
				lte(volunteerHours.date, end)
			)
		);

	const total = totalResult[0]?.total ?? 0;

	// ---- NORMALIZED RETURN TYPE ----
	const normalized: VolunteerRow[] = rows.map((r) => ({
		volunteeringTypeId: r.volunteeringTypeId,
		name: r.name,
		cnt: r.cnt,
	}));

	return { rows: normalized, total };
}
//#endregion

//#region Coach
type CoachRow = {
	name: string; // "Paid Hours" | "Volunteer Hours" | "Mileage"
	cnt: number;
};

export type CoachResponse = {
	rows: CoachRow[];
	total: number; // paid + volunteer (NOT mileage)
};

export async function coachAggregate(startIso: string, endIso: string): Promise<CoachResponse> {
	const start = new Date(startIso);
	const end = new Date(endIso);

	// ---- MAIN ROWS (Paid, Volunteer, Mileage) ----
	const result = await db.execute<{
		name: string;
		total: number;
	}>(sql`
        (
            SELECT 'Paid Hours' AS name,
                COALESCE(SUM(ch.paid_hours), 0)::float AS total
            FROM ${coachHours} ch
            WHERE ch.date >= ${start} AND ch.date <= ${end}
        )
        UNION ALL
        (
            SELECT 'Volunteer Hours' AS name,
                COALESCE(SUM(ch.volunteer_hours), 0)::float AS total
            FROM ${coachHours} ch
            WHERE ch.date >= ${start} AND ch.date <= ${end}
        )
        UNION ALL
        (
            SELECT 'Mileage' AS name,
                COALESCE(SUM(cm.miles), 0)::float AS total
            FROM ${coachMileage} cm
            WHERE cm.date >= ${start} AND cm.date <= ${end}
        )
    `);

	// IMPORTANT: execute() returns { rows }, not an array
	const rawRows = result.rows;

	// ---- NORMALIZATION ----
	const rows: CoachRow[] = rawRows.map((r: { name: string; total: number }) => ({
		name: r.name,
		cnt: r.total,
	}));

	// ---- TOTAL = paid + volunteer ----
	const totalResult = await db
		.select({
			total: sql<number>`
                COALESCE(SUM(${coachHours.paidHours}), 0)
                + COALESCE(SUM(${coachHours.volunteerHours}), 0)
            `,
		})
		.from(coachHours)
		.where(and(gte(coachHours.date, start), lte(coachHours.date, end)));

	const total = totalResult[0]?.total ?? 0;

	return { rows, total };
}
//#endregion
