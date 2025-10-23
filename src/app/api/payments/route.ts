import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET() {
	const payments = await prisma.payment.findMany({ 
		orderBy: { date: "desc" },
		include: { student: true }
	});
	
	// Convert Decimal amounts to numbers for proper JSON serialization
	const paymentsWithNumbers = payments.map(payment => ({
		...payment,
		amount: Number(payment.amount)
	}));
	
	return NextResponse.json(paymentsWithNumbers);
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { studentId, amount, notes, bookingId } = body;
		
		console.log('=== PAYMENT CREATE ===');
		console.log('Amount received:', amount, typeof amount);
		console.log('Parsed amount:', parseFloat(amount));
		
		if (!studentId || !amount) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}
		
		// Use Decimal to avoid floating-point precision issues
		const parsedAmount = new Decimal(String(amount));
		console.log('Final parsed amount:', parsedAmount.toString());
		
		// Try to create payment with bookingId, fallback to without if schema not updated
		let created;
		try {
			created = await prisma.payment.create({
				data: { 
					studentId: Number(studentId), 
					amount: parsedAmount,
					notes: notes ?? null,
					bookingId: bookingId ? Number(bookingId) : null
				},
				include: { student: true, booking: true }
			});
		} catch (schemaError) {
			// Fallback: create payment without bookingId if schema not updated
			created = await prisma.payment.create({
				data: { 
					studentId: Number(studentId), 
					amount: parsedAmount,
					notes: notes ?? null
				},
				include: { student: true }
			});
		}
		
		console.log('Created payment amount:', created.amount.toString());
		console.log('=====================');
		
		// Convert Decimal to number before returning
		const response = {
			...created,
			amount: Number(created.amount)
		};
		
		return NextResponse.json(response, { status: 201 });
	} catch (error) {
		console.error("Payment creation error:", error);
		return NextResponse.json({ 
			error: error instanceof Error ? error.message : "Database error" 
		}, { status: 500 });
	}
}
