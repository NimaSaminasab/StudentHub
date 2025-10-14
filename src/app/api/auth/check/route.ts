import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const authToken = cookieStore.get("auth-token");
		
		if (authToken?.value === "authenticated") {
			return NextResponse.json({ authenticated: true });
		}
		
		return NextResponse.json({ authenticated: false }, { status: 401 });
	} catch (error) {
		console.error("Auth check error:", error);
		return NextResponse.json({ authenticated: false }, { status: 500 });
	}
}

