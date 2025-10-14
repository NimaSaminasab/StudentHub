import { NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const SETTINGS_FILE = join(process.cwd(), "email-settings.json");

export async function GET() {
	try {
		if (existsSync(SETTINGS_FILE)) {
			const data = readFileSync(SETTINGS_FILE, "utf-8");
			return NextResponse.json(JSON.parse(data));
		}
		// Default settings
		return NextResponse.json({ minutesBefore: 2 });
	} catch (error) {
		console.error("Error reading settings:", error);
		return NextResponse.json({ minutesBefore: 2 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { minutesBefore } = body;
		
		if (!minutesBefore || minutesBefore < 1 || minutesBefore > 60) {
			return NextResponse.json({ error: "Invalid minutes value" }, { status: 400 });
		}
		
		const settings = { minutesBefore: Number(minutesBefore) };
		writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
		
		return NextResponse.json({ success: true, settings });
	} catch (error) {
		console.error("Error saving settings:", error);
		return NextResponse.json({ 
			error: error instanceof Error ? error.message : "Failed to save settings" 
		}, { status: 500 });
	}
}

