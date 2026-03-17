import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

const protectedRoutes = ['/', '/explorar', '/biblia', '/oracoes', '/meditacoes', '/diario', '/perfil', '/admin'];
const authRoutes = ['/login', '/cadastro'];
// Rotas públicas que nunca devem ser bloqueadas pelo middleware
const publicRoutes = ['/auth/callback'];

type PendingCookie = { name: string; value: string; options: CookieOptions };

/** Aplica cookies de rotação de token a qualquer NextResponse (incluindo redirects). */
function applyPendingCookies(res: NextResponse, cookies: PendingCookie[]) {
  cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar assets estáticos, API routes, arquivos com extensão e rotas públicas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    publicRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se as variáveis não estiverem configuradas, deixar passar sem bloquear
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Middleware] Variáveis Supabase não configuradas — ignorando proteção de rota');
    return NextResponse.next();
  }

  // Rastreia cookies que o Supabase quer escrever (token rotation).
  // Precisamos propagá-los para qualquer tipo de response, incluindo redirects —
  // caso contrário, o token rotacionado é perdido quando há redirect.
  const pendingCookies: PendingCookie[] = [];

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  let user = null;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Acumula para propagação em qualquer response (normal ou redirect)
          cookiesToSet.forEach((cookie) => pendingCookies.push(cookie));
          // Atualiza request para middleware downstream
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Aplica na response normal (navegação sem redirect)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // getUser() valida o token com o servidor Supabase e dispara refresh quando expirado.
    // Os novos access_token + refresh_token são gravados via setAll acima.
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    // Se o Supabase não responder, deixar a página carregar normalmente
    // A proteção client-side ainda funciona via AuthContext
    console.error('[Middleware] Erro ao verificar sessão:', err);
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!user && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    // Propaga tokens rotacionados para o browser mesmo no redirect
    applyPendingCookies(redirectResponse, pendingCookies);
    return redirectResponse;
  }

  if (user && isAuthRoute) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    applyPendingCookies(redirectResponse, pendingCookies);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
