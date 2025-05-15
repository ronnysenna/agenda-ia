import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { ButtonSignOut } from "./_components/button-signout";
import { redirect } from "next/navigation";


export default async function Dashboard() {

  const session = await auth.api.getSession({
    headers: await headers()

  })

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center flex-col">
      <h1 className=" text-[#fba931] text-4xl font-bold mb-4">Página Dashboard</h1>
      <h3>Usuario logado: {session.user.name}</h3>
      <h3 className="mb-4">E-mail: {session.user.email}</h3>
      <ButtonSignOut />
    </div>
  );
}