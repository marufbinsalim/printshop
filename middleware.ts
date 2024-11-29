// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // RSC kontrolü
  if (request.nextUrl.searchParams.has('_rsc')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session');

  // Dashboard route kontrolü
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
