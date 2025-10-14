import { NextResponse } from "next/server";
import { startEmailScheduler } from "@/lib/emailScheduler";

// This endpoint initializes the email scheduler
export async function GET() {
	try {
		startEmailScheduler();
		return NextResponse.json({ 
			success: true, 
			message: "Email scheduler initialized" 
		});
	} catch (error) {
		console.error("Error initializing scheduler:", error);
		return NextResponse.json({ 
			error: error instanceof Error ? error.message : "Failed to initialize" 
		}, { status: 500 });
	}
}

