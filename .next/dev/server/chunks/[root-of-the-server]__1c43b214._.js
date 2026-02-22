module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/jornada-com-deus/src/auth.config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next-auth/providers/google.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/@auth/core/providers/google.js [app-route] (ecmascript)");
;
const authConfig = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/jornada-com-deus/src/lib/credentials-db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCredentialUser",
    ()=>createCredentialUser,
    "findUserByEmail",
    ()=>findUserByEmail,
    "verifyCredentials",
    ()=>verifyCredentials
]);
/**
 * Store de credenciais server-side (arquivo JSON local).
 *
 * ⚠️  APENAS PARA DESENVOLVIMENTO / MVP
 * Em produção, substitua por um banco de dados real (PostgreSQL, MongoDB, etc.)
 * e use bcryptjs (já integrado) com custo ≥ 12 para os hashes de senha.
 *
 * O arquivo `data/credentials-users.json` é criado automaticamente e está
 * listado no .gitignore para não ser versionado.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
// Caminho do arquivo JSON que armazena os usuários
const DB_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "credentials-users.json");
// Custo do bcrypt — 12 é o mínimo recomendado para produção
const BCRYPT_ROUNDS = 12;
// ─── Helpers de I/O ────────────────────────────────────────────────────────────
function readUsers() {
    try {
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DB_FILE)) return [];
        const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
    } catch  {
        return [];
    }
}
function writeUsers(users) {
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(DB_FILE);
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(dir, {
            recursive: true
        });
    }
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
}
async function findUserByEmail(email) {
    const users = readUsers();
    return users.find((u)=>u.email.toLowerCase() === email.toLowerCase()) ?? null;
}
async function createCredentialUser(data) {
    const users = readUsers();
    const emailExists = users.some((u)=>u.email.toLowerCase() === data.email.toLowerCase());
    if (emailExists) {
        throw new Error("Este e-mail já está cadastrado.");
    }
    const passwordHash = await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(data.password, BCRYPT_ROUNDS);
    const newUser = {
        id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
        email: data.email.trim().toLowerCase(),
        name: data.name.trim(),
        passwordHash,
        createdAt: new Date().toISOString()
    };
    writeUsers([
        ...users,
        newUser
    ]);
    return newUser;
}
async function verifyCredentials(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return null;
    const passwordMatch = await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.passwordHash);
    if (!passwordMatch) return null;
    return user;
}
}),
"[project]/jornada-com-deus/src/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
/**
 * Configuração completa do Auth.js — roda apenas no Node.js Runtime.
 *
 * Estende authConfig (edge-compatible) adicionando o CredentialsProvider,
 * que depende de fs/path/bcryptjs e NÃO pode rodar no Edge Runtime.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/@auth/core/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/auth.config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$credentials$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/lib/credentials-db.ts [app-route] (ecmascript)");
;
;
;
;
const { handlers, auth, signIn, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    ...__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authConfig"],
    providers: [
        // Inclui o GoogleProvider que já está em authConfig
        ...__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$auth$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authConfig"].providers,
        // ── Login com E-mail + Senha (Node.js only — usa fs + bcryptjs) ──────────
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "Credenciais",
            credentials: {
                email: {
                    label: "E-mail",
                    type: "email",
                    placeholder: "seu@email.com"
                },
                password: {
                    label: "Senha",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$credentials$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyCredentials"])(credentials.email, credentials.password);
                if (!user) return null;
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.avatar ?? null
                };
            }
        })
    ]
});
}),
"[project]/jornada-com-deus/src/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/auth.ts [app-route] (ecmascript)");
;
const { GET, POST } = __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handlers"];
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1c43b214._.js.map