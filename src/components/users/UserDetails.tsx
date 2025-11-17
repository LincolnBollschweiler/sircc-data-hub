"use client";

import { ClientFull } from "@/userInteractions/db";
import { formatPhoneNumber } from "react-phone-number-input";

export const UserDetails = ({ client }: { client: ClientFull["user"] }) => {
	return (
		<div className="flex flex-wrap">
			<div className="px-3">
				{client?.firstName} {client?.lastName}
			</div>
			{client?.email && <div className="px-3">{client.email}</div>}
			{client?.phone && <div className="px-3">{formatPhoneNumber(client.phone)}</div>}
			{client?.address && <div className="px-3">{client.address}</div>}
		</div>
	);
};
