import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	const booking = await prisma.booking.findUnique({ 
		where: { id },
		include: { 
			students: {
				include: {
					student: true
				}
			}
		}
	});
	if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(booking);
}

export async function PUT(request: NextRequest, { params }: Context) {
	try {
		const { id: idStr } = await params;
		const id = Number(idStr);
		const body = await request.json();
		const { studentIds, title, startTime, endTime, notes, studentId, attended } = body;
		
		// If updating attendance for a specific student
		if (attended !== undefined && studentId) {
			const bookingStudent = await prisma.bookingStudent.findFirst({
				where: {
					bookingId: id,
					studentId: Number(studentId)
				}
			});
			
			if (bookingStudent) {
				await prisma.bookingStudent.update({
					where: { id: bookingStudent.id },
					data: { attended: Boolean(attended) }
				});
			}
			
			const updated = await prisma.booking.findUnique({
				where: { id },
				include: { 
					students: {
						include: {
							student: true
						}
					}
				}
			});
			return NextResponse.json(updated);
		}
		
		// Full update of booking details
		const updateData: any = { 
			title, 
			startTime: new Date(startTime), 
			endTime: new Date(endTime),
			notes: notes ?? null
		};
		
		// Update students if provided
		if (studentIds && Array.isArray(studentIds)) {
			// Delete existing students and create new ones
			await prisma.bookingStudent.deleteMany({
				where: { bookingId: id }
			});
			
			updateData.students = {
				create: studentIds.map((sid: number) => ({
					studentId: Number(sid),
					attended: false
				}))
			};
		}
		
		const updated = await prisma.booking.update({
			where: { id },
			data: updateData,
			include: { 
				students: {
					include: {
						student: true
					}
				}
			}
		});
		
		return NextResponse.json(updated);
	} catch (error) {
		console.error("Booking update error:", error);
		return NextResponse.json({ 
			error: error instanceof Error ? error.message : "Database error"
		}, { status: 500 });
	}
}

export async function DELETE(_request: NextRequest, { params }: Context) {
	const { id: idStr } = await params;
	const id = Number(idStr);
	await prisma.booking.delete({ where: { id } });
	return NextResponse.json({ ok: true });
}

