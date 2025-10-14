import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	const student = await prisma.student.findUnique({ where: { id } });
	if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(student);
}

export async function PUT(request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	const body = await request.json();
	const { firstName, lastName, email, phone, privateRate, groupRate, image } = body;
	const updated = await prisma.student.update({
		where: { id },
		data: { 
			firstName, 
			lastName,
			email,
			phone: phone ?? null,
			image: image ?? null,
			privateRate: privateRate ? parseFloat(privateRate) : 0.00,
			groupRate: groupRate ? parseFloat(groupRate) : 0.00
		},
	});
	return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	await prisma.student.delete({ where: { id } });
	return NextResponse.json({ ok: true });
}

