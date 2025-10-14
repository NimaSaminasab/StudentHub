import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const PASSWORD_FILE = join(process.cwd(), "admin-password.json");

function getStoredPassword() {
	try {
		if (existsSync(PASSWORD_FILE)) {
			const data = readFileSync(PASSWORD_FILE, "utf-8");
			const parsed = JSON.parse(data);
			return parsed.password;
		}
	} catch (error) {
		console.error("Error reading password file:", error);
	}
	return "admin123"; // Default password
}

function savePassword(newPassword: string) {
	try {
		writeFileSync(PASSWORD_FILE, JSON.stringify({ password: newPassword }, null, 2));
		return true;
	} catch (error) {
		console.error("Error saving password:", error);
		return false;
	}
}

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const authToken = cookieStore.get("auth-token");

		// Check if user is authenticated
		if (!authToken || authToken.value !== "authenticated") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { currentPassword, newPassword } = body;

		if (!currentPassword || !newPassword) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Verify current password
		const storedPassword = getStoredPassword();
		if (currentPassword !== storedPassword) {
			return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
		}

		// Save new password
		const saved = savePassword(newPassword);
		if (!saved) {
			return NextResponse.json({ error: "Failed to save new password" }, { status: 500 });
		}

		// Log out the user (they'll need to login with new password)
		cookieStore.delete("auth-token");

		return NextResponse.json({ success: true, message: "Password changed successfully" });
	} catch (error) {
		console.error("Password change error:", error);
		return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
	}
}

