import { getAccount } from "@api";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const account = await getAccount();

  if (!account) return redirect("/login");

  return <>Hi, {account.name}</>;
}
