import { auth } from "@/auth"; // Server-side auth
import { redirect } from "next/navigation";
import { HomeContent } from "./page-content";

// Force dynamic rendering so middleware can validate auth
export const dynamic = "force-dynamic";

export default async function Home() {
  // Validar autenticação no server-side
  const session = await auth();

  // Se não autenticado, redireciona para login
  if (!session) {
    redirect("/login");
  }

  // Se autenticado, renderiza a página home
  return <HomeContent />;
}
