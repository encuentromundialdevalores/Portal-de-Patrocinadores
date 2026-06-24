import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PlanesClient from "./PlanesClient";

export default async function PlanesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return <PlanesClient userName={session.user.name || ""} />;
}
