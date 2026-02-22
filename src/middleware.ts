import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Usa a config leve (sem fs/path/bcryptjs) para o Edge Runtime do middleware
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isRegisterPage = req.nextUrl.pathname === "/register";
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Rotas protegidas
  const protectedRoutes = ["/", "/explorar", "/biblia", "/oracoes", "/meditacoes", "/diario"];

  // Se estiver acessando uma rota protegida sem estar autenticado
  if (protectedRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {
    // Redireciona para login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Páginas públicas de auth — usuários autenticados são mandados para a home
  if ((isLoginPage || isRegisterPage) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Rota de cadastro é pública (sem autenticação necessária)
  if (isRegisterPage) {
    return NextResponse.next();
  }

  // Permite acesso normal para outras rotas
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};