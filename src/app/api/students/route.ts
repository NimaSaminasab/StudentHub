import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	const students = await prisma.student.findMany({ orderBy: { id: "desc" } });
	return NextResponse.json(students);
}

export async function POST(request: Request) {
	const body = await request.json();
	const { firstName, lastName, email, phone, privateRate, groupRate, image } = body;
	if (!firstName || !lastName || !email) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}
	const created = await prisma.student.create({
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
	return NextResponse.json(created, { status: 201 });
}

