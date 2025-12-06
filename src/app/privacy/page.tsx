"use client";

import { FC } from "react";

const PrivacyPage: FC = () => {
	return (
		<div className="container mx-auto py-12 px-4 lg:px-8">
			<h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

			<p className="mb-4">
				Your privacy is important to us. This page explains what information we collect, how we use it, and your
				rights regarding your data.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
			<p className="mb-4">
				We use <strong>Clerk</strong> for authentication. When you create an account or sign in, we store your
				Clerk user ID (hashed) and the email address you provide through Clerk.
			</p>
			<p className="mb-4">
				After signup, we may also collect additional information you provide to us voluntarily, including:
			</p>
			<ul className="list-disc ml-6 mb-4">
				<li>First and last name</li>
				<li>Email address</li>
				<li>Address, city, state, and ZIP code</li>
				<li>Phone number</li>
				<li>Birth month and day</li>
				<li>Desired role and account role type</li>
				<li>Notes you choose to provide</li>
				<li>Theme preference (light, dark, system)</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
			<p className="mb-4">We use your information solely to provide and manage our services, including:</p>
			<ul className="list-disc ml-6 mb-4">
				<li>Identifying and authenticating your account</li>
				<li>Personalizing your experience based on your role and preferences</li>
				<li>Allowing authorized users (coaches, staff, admins) to access relevant data</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing</h2>
			<p className="mb-4">
				We do <strong>not</strong> share your personal information with any third parties. All data is stored
				securely in our cloud-hosted database.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-4">Account Deletion</h2>
			<p className="mb-4">
				If you request account deletion via Clerk, we remove all personal identifiers (email, name, Clerk ID)
				from our system. We retain a generic &quot;deleted user&quot; record so we can maintain service history
				without retaining personal data.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-4">Access Control</h2>
			<p className="mb-4">Access to data within the system is role-based:</p>
			<ul className="list-disc ml-6 mb-4">
				<li>Clients can only see their own information</li>
				<li>Volunteers can only see their own volunteer data</li>
				<li>Coaches can see information for the clients they manage</li>
				<li>Staff and Admins have full access to all relevant data</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Tracking</h2>
			<p className="mb-4">
				We do not use any cookies or tracking tools beyond what is required for Clerk authentication.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
			<p className="mb-4">
				We may update this Privacy Policy from time to time. Any changes will be posted here with an updated
				effective date.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
			<p className="mb-4">
				<span>If you have questions or concerns about your privacy or this policy, please </span>
				<a
					href="https://www.sircc-tencsinc.com/contact-us/"
					rel="noopener noreferrer"
					target="_blank"
					className="ml-1 mr-1 text-blue-500 hover:underline"
				>
					contact
				</a>
				<span> us via our support channels.</span>
			</p>
		</div>
	);
};

export default PrivacyPage;
