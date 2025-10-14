import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const authToken = request.cookies.get('auth-token');
	const { pathname } = request.nextUrl;

	// Allow access to login page, API auth endpoints, and API init endpoint
	if (pathname === '/login' || pathname.startsWith('/api/auth/') || pathname === '/api/init') {
		return NextResponse.next();
	}

	// Check if user is authenticated
	if (!authToken || authToken.value !== 'authenticated') {
		// Redirect to login page
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
	],
};

