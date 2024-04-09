import { getAccount } from "@api";

export default async function AccountPage() {
	const account = await getAccount();

	return !account ? "no account found" : account.username;
}