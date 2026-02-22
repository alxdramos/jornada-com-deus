(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/jornada-com-deus/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript) <export * as Slot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__["Slot"].Root : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        "data-variant": variant,
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/button.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript) <export * as Dialog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Root, {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_c = Dialog;
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Trigger, {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
_c1 = DialogTrigger;
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Portal, {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
_c2 = DialogPortal;
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 31,
        columnNumber: 10
    }, this);
}
_c3 = DialogClose;
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Overlay, {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[9999] bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c4 = DialogOverlay;
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Content, {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[10000] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg", className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
                        "data-slot": "dialog-close",
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_c5 = DialogContent;
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c6 = DialogHeader;
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
        ...props,
        children: [
            children,
            showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    children: "Close"
                }, void 0, false, {
                    fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c7 = DialogFooter;
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Title, {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_c8 = DialogTitle;
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Description, {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/ui/dialog.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_c9 = DialogDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogPortal");
__turbopack_context__.k.register(_c3, "DialogClose");
__turbopack_context__.k.register(_c4, "DialogOverlay");
__turbopack_context__.k.register(_c5, "DialogContent");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/hooks/use-pwa-install.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePWAInstall",
    ()=>usePWAInstall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function usePWAInstall() {
    _s();
    const [deferredPrompt, setDeferredPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isInstallable, setIsInstallable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalled, setIsInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePWAInstall.useEffect": ()=>{
            // Check if already installed
            if ("TURBOPACK compile-time truthy", 1) {
                const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
                const isInWebAppiOS = window.navigator.standalone === true;
                setIsInstalled(isStandalone || isInWebAppiOS);
            }
            const handleBeforeInstallPrompt = {
                "usePWAInstall.useEffect.handleBeforeInstallPrompt": (e)=>{
                    // Prevent the mini-infobar from appearing on mobile
                    e.preventDefault();
                    // Stash the event so it can be triggered later
                    setDeferredPrompt(e);
                    setIsInstallable(true);
                }
            }["usePWAInstall.useEffect.handleBeforeInstallPrompt"];
            const handleAppInstalled = {
                "usePWAInstall.useEffect.handleAppInstalled": ()=>{
                    setIsInstalled(true);
                    setIsInstallable(false);
                    setDeferredPrompt(null);
                }
            }["usePWAInstall.useEffect.handleAppInstalled"];
            window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.addEventListener("appinstalled", handleAppInstalled);
            return ({
                "usePWAInstall.useEffect": ()=>{
                    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
                    window.removeEventListener("appinstalled", handleAppInstalled);
                }
            })["usePWAInstall.useEffect"];
        }
    }["usePWAInstall.useEffect"], []);
    const installPWA = async ()=>{
        if (!deferredPrompt) return;
        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setIsInstalled(true);
            }
            setDeferredPrompt(null);
            setIsInstallable(false);
        } catch (error) {
            console.error("Error installing PWA:", error);
        }
    };
    const dismissPrompt = ()=>{
        setIsInstallable(false);
        setDeferredPrompt(null);
    };
    return {
        isInstallable,
        isInstalled,
        installPWA,
        dismissPrompt
    };
}
_s(usePWAInstall, "+3DyIhGe90t9VfD+B07bGy/4WTE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/components/install-prompt.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InstallPrompt",
    ()=>InstallPrompt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$use$2d$pwa$2d$install$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/hooks/use-pwa-install.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function InstallPrompt() {
    _s();
    const { isInstallable, installPWA, dismissPrompt } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$use$2d$pwa$2d$install$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePWAInstall"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isInstallable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
            open: isInstallable,
            onOpenChange: dismissPrompt,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: "sm:max-w-md border-0 shadow-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.9,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.9,
                        y: 20
                    },
                    transition: {
                        duration: 0.3,
                        ease: "easeOut"
                    },
                    className: "flex flex-col items-center text-center p-8 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                scale: 0
                            },
                            animate: {
                                scale: 1
                            },
                            transition: {
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200
                            },
                            className: "w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                className: "w-10 h-10 text-white"
                            }, void 0, false, {
                                fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                lineNumber: 31,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                            lineNumber: 25,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.3
                            },
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-foreground",
                                    children: "Instale o Jornada com Deus"
                                }, void 0, false, {
                                    fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                    lineNumber: 41,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground text-sm leading-relaxed",
                                    children: "Tenha acesso offline aos seus momentos devocionais e receba lembretes diários"
                                }, void 0, false, {
                                    fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                    lineNumber: 44,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                            lineNumber: 35,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            transition: {
                                delay: 0.4
                            },
                            className: "flex items-center gap-3 text-sm text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                            lineNumber: 57,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Acesso rápido"
                                        }, void 0, false, {
                                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                            lineNumber: 58,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                    lineNumber: 56,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                            lineNumber: 61,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Sem distrações"
                                        }, void 0, false, {
                                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                            lineNumber: 62,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                    lineNumber: 60,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                            lineNumber: 50,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.5
                            },
                            className: "flex gap-3 w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: dismissPrompt,
                                    variant: "outline",
                                    className: "flex-1 rounded-xl border-2 hover:bg-muted/50 transition-colors",
                                    children: "Agora não"
                                }, void 0, false, {
                                    fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                    lineNumber: 73,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: installPWA,
                                    className: "flex-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transition-all duration-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                            lineNumber: 84,
                                            columnNumber: 19
                                        }, this),
                                        "Instalar"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                                    lineNumber: 80,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                            lineNumber: 67,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                    lineNumber: 17,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
                lineNumber: 16,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
            lineNumber: 15,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/install-prompt.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_s(InstallPrompt, "bzZm5h4Zhf7yV9U+jNQTNPJx9lc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$use$2d$pwa$2d$install$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePWAInstall"]
    ];
});
_c = InstallPrompt;
var _c;
__turbopack_context__.k.register(_c, "InstallPrompt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/hooks/useOnlineStatus.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnlineStatus",
    ()=>useOnlineStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useOnlineStatus() {
    _s();
    const [isOnline, setIsOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [wasOffline, setWasOffline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOnlineStatus.useEffect": ()=>{
            // Verificar status inicial
            setIsOnline(navigator.onLine);
            const handleOnline = {
                "useOnlineStatus.useEffect.handleOnline": ()=>{
                    setIsOnline(true);
                    setWasOffline(true);
                    // Reset wasOffline após 3 segundos
                    setTimeout({
                        "useOnlineStatus.useEffect.handleOnline": ()=>setWasOffline(false)
                    }["useOnlineStatus.useEffect.handleOnline"], 3000);
                }
            }["useOnlineStatus.useEffect.handleOnline"];
            const handleOffline = {
                "useOnlineStatus.useEffect.handleOffline": ()=>{
                    setIsOnline(false);
                    setWasOffline(false);
                }
            }["useOnlineStatus.useEffect.handleOffline"];
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            return ({
                "useOnlineStatus.useEffect": ()=>{
                    window.removeEventListener('online', handleOnline);
                    window.removeEventListener('offline', handleOffline);
                }
            })["useOnlineStatus.useEffect"];
        }
    }["useOnlineStatus.useEffect"], []);
    return {
        isOnline,
        wasOffline
    };
}
_s(useOnlineStatus, "vcOA2Q0FsLlA9rg2Hl90x8UOqXM=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/hooks/useToast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
function useToast() {
    const success = (message, options)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(message, {
            duration: 4000,
            style: {
                background: "#F0FDF4",
                border: "1px solid #86EFAC",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            },
            ...options
        });
    };
    const error = (message, options)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message, {
            duration: 5000,
            style: {
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            },
            ...options
        });
    };
    const warning = (message, options)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(message, {
            duration: 4000,
            style: {
                background: "#FFFBEB",
                border: "1px solid #FCD34D",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            },
            ...options
        });
    };
    const info = (message, options)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(message, {
            duration: 4000,
            style: {
                background: "#EFF6FF",
                border: "1px solid #93C5FD",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            },
            ...options
        });
    };
    const prayerSaved = ()=>{
        success("Oração salva com sucesso! 🙏", {
            description: "Sua oração foi adicionada à sua coleção pessoal."
        });
    };
    const entrySaved = ()=>{
        success("Entrada salva no diário! 📝", {
            description: "Sua reflexão foi registrada com sucesso."
        });
    };
    const favoriteAdded = (item)=>{
        success(`${item} adicionado aos favoritos! ❤️`);
    };
    const favoriteRemoved = (item)=>{
        info(`${item} removido dos favoritos`);
    };
    const dayCompleted = ()=>{
        success("Dia concluído! Glória a Deus 🙌", {
            duration: 6000,
            description: "Parabéns por completar seu devocional diário!"
        });
    };
    const offlineMode = ()=>{
        warning("Modo offline ativado", {
            description: "Algumas funcionalidades podem não estar disponíveis.",
            duration: 5000
        });
    };
    const onlineRestored = ()=>{
        success("Conexão restaurada! 🌐", {
            description: "Todas as funcionalidades estão disponíveis novamente."
        });
    };
    return {
        success,
        error,
        warning,
        info,
        prayerSaved,
        entrySaved,
        favoriteAdded,
        favoriteRemoved,
        dayCompleted,
        offlineMode,
        onlineRestored
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/components/OfflineIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BibleApiError",
    ()=>BibleApiError,
    "BibleOfflineMessage",
    ()=>BibleOfflineMessage,
    "OfflineIndicator",
    ()=>OfflineIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useOnlineStatus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/hooks/useOnlineStatus.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/hooks/useToast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function OfflineIndicator() {
    _s();
    const { isOnline, wasOffline } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useOnlineStatus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnlineStatus"])();
    const { error: showError, success: showSuccess } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OfflineIndicator.useEffect": ()=>{
            if (!isOnline) {
                showError("Você está offline. A leitura da Bíblia requer conexão com a internet.", {
                    duration: 6000
                });
            } else if (wasOffline) {
                showSuccess("Conexão restaurada! Você pode continuar lendo a Bíblia.", {
                    duration: 4000
                });
            }
        }
    }["OfflineIndicator.useEffect"], [
        isOnline,
        wasOffline,
        showError,
        showSuccess
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: [
            !isOnline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    y: -100,
                    opacity: 0
                },
                animate: {
                    y: 0,
                    opacity: 1
                },
                exit: {
                    y: -100,
                    opacity: 0
                },
                className: "fixed top-0 left-0 right-0 z-[1000] bg-red-500 text-white px-4 py-3 shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                            lineNumber: 37,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium",
                            children: "Sem conexão - Bíblia indisponível"
                        }, void 0, false, {
                            fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                            lineNumber: 38,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>window.location.reload(),
                            className: "ml-2 p-1 rounded hover:bg-red-600 transition-colors",
                            title: "Tentar novamente",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                                lineNumber: 44,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                    lineNumber: 36,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this),
            isOnline && wasOffline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    y: -100,
                    opacity: 0
                },
                animate: {
                    y: 0,
                    opacity: 1
                },
                exit: {
                    y: -100,
                    opacity: 0
                },
                transition: {
                    delay: 0.5
                },
                className: "fixed top-0 left-0 right-0 z-[1000] bg-green-500 text-white px-4 py-3 shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium",
                            children: "Conexão restaurada - Bíblia disponível"
                        }, void 0, false, {
                            fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                    lineNumber: 58,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(OfflineIndicator, "e0GkKYqoOn/Kdg51VqZQKGZqGSY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useOnlineStatus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnlineStatus"],
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = OfflineIndicator;
function BibleOfflineMessage({ onRetry }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            scale: 0.9
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        className: "bg-white rounded-2xl p-8 shadow-sm text-center max-w-md mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                    className: "w-8 h-8 text-red-500"
                }, void 0, false, {
                    fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-[#1F2937] mb-2",
                children: "Sem conexão com a internet"
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#6B7280] text-sm mb-6 leading-relaxed",
                children: "A leitura da Bíblia requer conexão com a internet para buscar os textos da API. Verifique sua conexão e tente novamente."
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "flex-1 bg-[#FB923C] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            "Recarregar página"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    onRetry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onRetry,
                        className: "flex-1 bg-white border border-[#E5E7EB] text-[#1F2937] py-3 px-4 rounded-xl font-medium hover:bg-[#F9FAFB] transition-colors",
                        children: "Tentar novamente"
                    }, void 0, false, {
                        fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_c1 = BibleOfflineMessage;
function BibleApiError({ error, onRetry }) {
    const isOfflineError = error.includes('Failed to fetch') || error.includes('Network') || error.includes('fetch');
    if (isOfflineError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BibleOfflineMessage, {
            onRetry: onRetry
        }, void 0, false, {
            fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
            lineNumber: 118,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            scale: 0.9
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        className: "bg-white rounded-2xl p-8 shadow-sm text-center max-w-md mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                    className: "w-8 h-8 text-amber-500"
                }, void 0, false, {
                    fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-[#1F2937] mb-2",
                children: "Erro ao carregar"
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#6B7280] text-sm mb-6 leading-relaxed",
                children: error.includes('Referência inválida') ? "Verifique se a referência está correta. Use o formato 'Livro Capítulo:Versículo' (ex: 'João 3:16')." : "Ocorreu um erro ao buscar os dados. Tente novamente em alguns instantes."
            }, void 0, false, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            onRetry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onRetry,
                className: "w-full bg-[#FB923C] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    "Tentar novamente"
                ]
            }, void 0, true, {
                fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/jornada-com-deus/src/components/OfflineIndicator.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c2 = BibleApiError;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "OfflineIndicator");
__turbopack_context__.k.register(_c1, "BibleOfflineMessage");
__turbopack_context__.k.register(_c2, "BibleApiError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/components/providers/SessionProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionProvider",
    ()=>SessionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next-auth/react.js [app-client] (ecmascript)");
"use client";
;
;
function SessionProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/jornada-com-deus/src/components/providers/SessionProvider.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = SessionProvider;
var _c;
__turbopack_context__.k.register(_c, "SessionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/stores/userStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUserStore",
    ()=>useUserStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useUserStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        setUser: (user)=>set({
                user
            }),
        updateUser: (updates)=>{
            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: {
                        ...currentUser,
                        ...updates
                    }
                });
            }
        },
        togglePlus: ()=>{
            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: {
                        ...currentUser,
                        isPlus: !currentUser.isPlus
                    }
                });
            }
        },
        clearUser: ()=>set({
                user: null
            })
    }), {
    name: 'user-storage',
    // Only persist specific fields
    partialize: (state)=>({
            user: state.user ? {
                ...state.user
            } : null
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/stores/progressStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProgressStore",
    ()=>useProgressStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const INITIAL_PROGRESS = {
    currentStreak: 0,
    maxStreak: 0,
    totalXp: 0,
    level: 1,
    treeLevel: 0,
    lastCompletedDate: null,
    completedDays: 0,
    completedDates: []
};
const useProgressStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        progress: INITIAL_PROGRESS,
        completeDay: ()=>{
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const { progress } = get();
            // Verificar se já completou hoje
            if (progress.lastCompletedDate) {
                const lastCompleted = new Date(progress.lastCompletedDate);
                const lastCompletedDate = new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate());
                if (lastCompletedDate.getTime() === today.getTime()) {
                    // Já completou hoje, não fazer nada
                    return;
                }
            }
            // Calcular se mantém o streak
            let newStreak = 1; // Começa com 1
            if (progress.lastCompletedDate) {
                const lastCompleted = new Date(progress.lastCompletedDate);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const lastCompletedDate = new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate());
                if (lastCompletedDate.getTime() === yesterday.getTime()) {
                    // Completou ontem, mantém streak +1
                    newStreak = progress.currentStreak + 1;
                }
            // Senão, streak reseta para 1
            }
            // Calcular novo XP e level
            const xpGained = 75; // XP por dia completado
            const newTotalXp = progress.totalXp + xpGained;
            const newLevel = Math.floor(newTotalXp / 100) + 1;
            // Calcular novo treeLevel (árvore da vida)
            const newCompletedDays = progress.completedDays + 1;
            const newTreeLevel = Math.min(Math.floor(newCompletedDays / 5), 10);
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const newCompletedDates = progress.completedDates.includes(todayStr) ? progress.completedDates : [
                ...progress.completedDates ?? [],
                todayStr
            ];
            const newProgress = {
                currentStreak: newStreak,
                maxStreak: Math.max(progress.maxStreak, newStreak),
                totalXp: newTotalXp,
                level: newLevel,
                treeLevel: newTreeLevel,
                lastCompletedDate: today,
                completedDays: newCompletedDays,
                completedDates: newCompletedDates
            };
            set({
                progress: newProgress
            });
        },
        getXpForNextLevel: ()=>{
            const { progress } = get();
            const xpForCurrentLevel = (progress.level - 1) * 100;
            const xpForNextLevel = progress.level * 100;
            return xpForNextLevel - progress.totalXp;
        },
        getTreeProgress: ()=>{
            const { progress } = get();
            const daysForCurrentLevel = progress.treeLevel * 5;
            const daysForNextLevel = (progress.treeLevel + 1) * 5;
            const progressInCurrentLevel = progress.completedDays - daysForCurrentLevel;
            return progressInCurrentLevel / (daysForNextLevel - daysForCurrentLevel) * 100;
        },
        resetProgress: ()=>set({
                progress: INITIAL_PROGRESS
            })
    }), {
    name: 'progress-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/lib/db.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JornadaComDeusDB",
    ()=>JornadaComDeusDB,
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$dexie$2f$import$2d$wrapper$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/dexie/import-wrapper.mjs [app-client] (ecmascript)");
;
class JornadaComDeusDB extends __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$dexie$2f$import$2d$wrapper$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] {
    users;
    progress;
    devotionals;
    prayers;
    journalEntries;
    favorites;
    constructor(){
        super('JornadaComDeusDB');
        this.version(1).stores({
            users: '++id, name, email, isPlus, avatar, createdAt',
            progress: '++id, streak, xp, level, treeLevel, lastCompletedDate, userId',
            devotionals: '++id, title, duration, category, isPlus, audioUrl, imageUrl, description, createdAt',
            prayers: '++id, title, text, audioUrl, isPersonal, answered, createdAt, userId',
            journalEntries: '++id, type, content, date, favorite, userId',
            favorites: '++id, contentId, type, userId, createdAt'
        });
        // Hook para seed automático na primeira criação
        // NOTA: Removido seed automático para evitar conflito com autenticação
        // O seed será feito apenas quando necessário via código específico
        this.on('ready', async ()=>{
            console.log('📱 Banco de dados IndexedDB pronto para Jornada com Deus');
        });
    }
}
const db = new JornadaComDeusDB();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/hooks/useAuthSync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthSync",
    ()=>useAuthSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next-auth/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$userStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/stores/userStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$progressStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/stores/progressStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/lib/db.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function useAuthSync() {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const { user: zustandUser, setUser, updateUser, clearUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$userStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"])();
    const { progress: zustandProgress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$progressStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProgressStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuthSync.useEffect": ()=>{
            const syncUserData = {
                "useAuthSync.useEffect.syncUserData": async ()=>{
                    if (status === 'loading') return;
                    if (session?.user && status === 'authenticated') {
                        try {
                            // Buscar usuário existente no Dexie pelo email
                            const existingDexieUser = await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].users.where('email').equals(session.user.email).first();
                            if (existingDexieUser) {
                                // Usuário existe - atualizar dados básicos e carregar progresso
                                console.log('🔄 Usuário existente encontrado, sincronizando dados...');
                                // Atualizar dados básicos no Dexie (preservando progresso)
                                await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].users.update(existingDexieUser.id, {
                                    name: session.user.name,
                                    avatar: session.user.image || undefined
                                });
                                // Buscar progresso associado ao usuário
                                const userProgress = await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].progress.where('userId').equals(existingDexieUser.id).first();
                                // Atualizar Zustand com dados do Dexie
                                setUser({
                                    id: existingDexieUser.id,
                                    name: session.user.name,
                                    email: session.user.email,
                                    isPlus: existingDexieUser.isPlus,
                                    avatar: session.user.image || undefined,
                                    createdAt: existingDexieUser.createdAt
                                });
                                // Se há progresso no Dexie, sincronizar com Zustand
                                if (userProgress) {
                                    // Sincronizar progresso do Dexie com Zustand
                                    const progressStore = __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$progressStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProgressStore"].getState();
                                    const syncedProgress = {
                                        currentStreak: userProgress.streak,
                                        maxStreak: Math.max(progressStore.progress.maxStreak, userProgress.streak),
                                        totalXp: userProgress.xp,
                                        level: userProgress.level,
                                        treeLevel: userProgress.treeLevel,
                                        lastCompletedDate: userProgress.lastCompletedDate || null,
                                        completedDays: Math.floor(userProgress.xp / 75),
                                        completedDates: []
                                    };
                                    // Atualizar Zustand com progresso sincronizado
                                    __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$progressStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProgressStore"].setState({
                                        progress: syncedProgress
                                    });
                                    console.log('📊 Progresso sincronizado para usuário:', syncedProgress);
                                }
                            } else {
                                // Usuário não existe - criar novo perfil
                                console.log('🆕 Criando novo perfil para usuário autenticado...');
                                // Criar usuário no Dexie
                                const newUserId = await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].users.add({
                                    name: session.user.name,
                                    email: session.user.email,
                                    isPlus: false,
                                    avatar: session.user.image || undefined,
                                    createdAt: new Date()
                                });
                                // Criar progresso inicial para o novo usuário
                                await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].progress.add({
                                    streak: 0,
                                    xp: 0,
                                    level: 1,
                                    treeLevel: 0,
                                    userId: newUserId,
                                    lastCompletedDate: undefined
                                });
                                // Atualizar Zustand com o novo usuário
                                setUser({
                                    id: newUserId,
                                    name: session.user.name,
                                    email: session.user.email,
                                    isPlus: false,
                                    avatar: session.user.image || undefined,
                                    createdAt: new Date()
                                });
                                console.log('✅ Novo perfil criado com sucesso!');
                            }
                        } catch (error) {
                            console.error('❌ Erro ao sincronizar dados do usuário:', error);
                        }
                    } else if (status === 'unauthenticated') {
                        // Usuário não está autenticado - limpar dados sensíveis do Zustand
                        // mas manter dados locais no Dexie para uso offline
                        console.log('🚪 Usuário deslogado, limpando sessão...');
                        clearUser();
                    }
                }
            }["useAuthSync.useEffect.syncUserData"];
            syncUserData();
        }
    }["useAuthSync.useEffect"], [
        session,
        status,
        setUser,
        clearUser
    ]);
    // Função auxiliar para obter dados do usuário atual (útil para outras partes do app)
    const getCurrentUserData = async ()=>{
        if (!zustandUser?.email) return null;
        try {
            const dexieUser = await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].users.where('email').equals(zustandUser.email).first();
            const userProgress = dexieUser ? await __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"].progress.where('userId').equals(dexieUser.id).first() : null;
            return {
                user: dexieUser,
                progress: userProgress
            };
        } catch (error) {
            console.error('❌ Erro ao buscar dados do usuário atual:', error);
            return null;
        }
    };
    return {
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        user: zustandUser,
        getCurrentUserData
    };
}
_s(useAuthSync, "prdqxhde3W3Luvvl3+E4OPPslW0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$userStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$stores$2f$progressStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProgressStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/jornada-com-deus/src/components/AuthSyncWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthSyncWrapper",
    ()=>AuthSyncWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useAuthSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/jornada-com-deus/src/hooks/useAuthSync.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AuthSyncWrapper({ children }) {
    _s();
    // Este hook garante a sincronização automática entre Auth.js, Zustand e Dexie
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useAuthSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthSync"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthSyncWrapper, "is3ZA0jOkYUJJfQhKEGY0ZWVOJ8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$jornada$2d$com$2d$deus$2f$src$2f$hooks$2f$useAuthSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthSync"]
    ];
});
_c = AuthSyncWrapper;
var _c;
__turbopack_context__.k.register(_c, "AuthSyncWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=jornada-com-deus_src_6f1af3b3._.js.map