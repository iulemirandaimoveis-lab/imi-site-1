import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const authToken = req.cookies.get('auth-token');

    if (req.nextUrl.pathname.startsWith('/backoffice/') && !authToken) {
        return NextResponse.redirect(new URL('/backoffice', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/backoffice/:path*']
};
