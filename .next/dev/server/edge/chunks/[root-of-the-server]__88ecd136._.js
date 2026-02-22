(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__88ecd136._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/jornada-com-deus/src/auth.config.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Configuração leve do Auth.js — compatível com Edge Runtime.
 *
 * Este arquivo NÃO pode importar módulos Node.js (fs, path, bcryptjs, etc.)
 * porque é usado pelo middleware, que roda no Edge Runtime.
 *
 * O CredentialsProvider (que precisa de fs/bcryptjs) fica apenas em auth.ts,
 * que roda exclusivamente no ambiente Node.js.
 */ __turbopack_context__.s([
    "authConfig",
    ()=>authConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next-auth/providers/google.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/@auth/core/providers/google.js [middleware-edge] (ecmascript)");
;
const authConfig = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ],
    callbacks: {
        async session ({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt ({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    }
};
}),
"[project]/jornada-com-deus/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next-auth/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$auth$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/auth.config.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
;
// Usa a config leve (sem fs/path/bcryptjs) para o Edge Runtime do middleware
const { auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$auth$2e$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["authConfig"]);
const __TURBOPACK__default__export__ = auth((req)=>{
    const isAuthenticated = !!req.auth;
    const isLoginPage = req.nextUrl.pathname === "/login";
    const isRegisterPage = req.nextUrl.pathname === "/register";
    const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
    // Rotas protegidas
    const protectedRoutes = [
        "/",
        "/explorar",
        "/biblia",
        "/oracoes",
        "/diario"
    ];
    // Se estiver acessando uma rota protegida sem estar autenticado
    if (protectedRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {
        // Redireciona para login
        return __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", req.url));
    }
    // Páginas públicas de auth — usuários autenticados são mandados para a home
    if ((isLoginPage || isRegisterPage) && isAuthenticated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", req.url));
    }
    // Rota de cadastro é pública (sem autenticação necessária)
    if (isRegisterPage) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Permite acesso normal para outras rotas
    return __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
});
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */ "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__88ecd136._.js.map