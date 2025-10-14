import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Context = {
	params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	const payment = await prisma.payment.findUnique({ 
		where: { id },
		include: { student: true }
	});
	if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(payment);
}

export async function PUT(request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	const body = await request.json();
	const { studentId, amount, notes } = body;
	
	const updated = await prisma.payment.update({
		where: { id },
		data: { 
			studentId: studentId ? Number(studentId) : undefined,
			amount: amount ? parseFloat(amount) : undefined,
			notes: notes ?? null
		},
		include: { student: true }
	});
	
	return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	await prisma.payment.delete({ where: { id } });
	return NextResponse.json({ success: true });
}
