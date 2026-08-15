const PROTECTED_PATHS = Object.freeze(["/.env","/.git","/_functions","/admin","/api","/auth","/backend","/config","/internal","/private","/scripts","/server.js","/upload","/webhook","/write"]);

function normalizedPathname(requestUrl) {
  let pathname = new URL(requestUrl).pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  pathname = pathname.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");
  return pathname.toLowerCase();
}

function isProtectedPath(pathname) {
  if (pathname === null) return true;
  if (pathname === "/.env" || pathname.startsWith("/.env.")) return true;
  if (pathname === "/server.js" || pathname.startsWith("/server.js.")) return true;
  return PROTECTED_PATHS.some((protectedPath) => (
    pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  ));
}

function blockedResponse(request) {
  const body = request.method === "HEAD" ? null : "Not Found\n";
  return new Response(body, {
    status: 404,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Security-Policy": "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "Content-Type": "text/plain; charset=utf-8",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Pragma": "no-cache",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

export function onRequest(context) {
  const pathname = normalizedPathname(context.request.url);
  if (!isProtectedPath(pathname)) return context.next();
  return blockedResponse(context.request);
}
