import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	const bookings = await prisma.booking.findMany({ 
		orderBy: { startTime: "asc" },
		include: { 
			students: {
				include: {
					student: true
				}
			}
		}
	});
	return NextResponse.json(bookings);
}

export async function POST(request: Request) {
	const body = await request.json();
	const { studentIds, title, startTime, endTime, notes } = body;
	
	if (!studentIds || studentIds.length === 0 || !title || !startTime || !endTime) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}
	
	const created = await prisma.booking.create({
		data: { 
			title, 
			startTime: new Date(startTime), 
			endTime: new Date(endTime),
			notes: notes ?? null,
			students: {
				create: studentIds.map((studentId: number) => ({
					studentId: Number(studentId),
					attended: false
				}))
			}
		},
		include: { 
			students: {
				include: {
					student: true
				}
			}
		}
	});
	return NextResponse.json(created, { status: 201 });
}
