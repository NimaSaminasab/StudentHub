import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
	try {
		// Delete all payments
		const result = await prisma.payment.deleteMany({});
		
		return NextResponse.json({ 
			success: true, 
			deletedCount: result.count,
			message: `Successfully deleted ${result.count} payments`
		});
	} catch (error) {
		console.error("Error deleting all payments:", error);
		return NextResponse.json({ 
			error: error instanceof Error ? error.message : "Database error" 
		}, { status: 500 });
	}
}
