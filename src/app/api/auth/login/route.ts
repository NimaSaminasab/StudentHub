import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { verifyPassword } from "@/lib/passwordUtils";

function getStoredPasswordHash() {
	try {
		const passwordFile = join(process.cwd(), "admin-password.json");
		if (existsSync(passwordFile)) {
			const data = readFileSync(passwordFile, "utf-8");
			const parsed = JSON.parse(data);
			
			// Check if it's the new encrypted format
			if (parsed.passwordHash) {
				return parsed.passwordHash;
			}
			
			// Fallback for old plain text format
			if (parsed.password) {
				console.warn("⚠️ Using plain text password! Please run: node scripts/setup-admin-password.js");
				return parsed.password;
			}
		}
	} catch (error) {
		console.error("Error reading password file:", error);
	}
	
	// Default fallback (should not be used in production)
	console.error("❌ No password file found! Please run: node scripts/setup-admin-password.js");
	return null;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { username, password } = body;

		// Check username first
		if (username !== "admin") {
			return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
		}

		const storedPasswordHash = getStoredPasswordHash();
		
		if (!storedPasswordHash) {
			console.error("❌ No password configuration found!");
			return NextResponse.json({ error: "Authentication system not configured" }, { status: 500 });
		}

		// Verify password using bcrypt for encrypted passwords
		let passwordValid = false;
		
		if (storedPasswordHash.startsWith('$2b$')) {
			// This is a bcrypt hash - use secure verification
			passwordValid = await verifyPassword(password, storedPasswordHash);
		} else {
			// Fallback for plain text (deprecated)
			passwordValid = password === storedPasswordHash;
			if (passwordValid) {
				console.warn("⚠️ Using plain text password authentication - please upgrade to encrypted passwords");
			}
		}

		if (passwordValid) {
			// Set a secure cookie
			const cookieStore = await cookies();
			cookieStore.set("auth-token", "authenticated", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			return NextResponse.json({ success: true });
		}

		return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json({ error: "Login failed" }, { status: 500 });
	}
}

