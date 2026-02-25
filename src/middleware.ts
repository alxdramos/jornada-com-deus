import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const protectedRoutes = ['/', '/explorar', '/biblia', '/oracoes', '/meditacoes', '/diario', '/perfil', '/admin'];
const authRoutes = ['/login', '/cadastro'];
// Rotas públicas que nunca devem ser bloqueadas pelo middleware
const publicRoutes = ['/auth/callback'];

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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

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
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
