import { NextResponse } from "next/server";

import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  //   function middleware(req: NextRequestWithAuth) {
  //     const pathname = req.nextUrl.pathname;
  //     const route = PageRoutes.find((route) => pathname.startsWith(route.path));
  //     if (
  //       !req.nextauth.token ||
  //       !route ||
  //       !route.roles.includes(req.nextauth.token.role)
  //     ) {
  //       return NextResponse.rewrite(new URL(DEFAULT_ROUTE, req.url));
  //     }

  //     return NextResponse.next();
  //   },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|$).*)"],
};
