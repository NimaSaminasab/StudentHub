import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const now = new Date();
		
		// Get all bookings
		const allBookings = await prisma.booking.findMany({
			include: {
				students: {
					include: {
						student: true
					}
				}
			},
			orderBy: {
				startTime: 'asc'
			}
		});
		
		// Get settings
		const { readFileSync, existsSync } = require('fs');
		const { join } = require('path');
		const settingsFile = join(process.cwd(), 'email-settings.json');
		let minutesBefore = 2;
		if (existsSync(settingsFile)) {
			const data = readFileSync(settingsFile, 'utf-8');
			const settings = JSON.parse(data);
			minutesBefore = settings.minutesBefore || 2;
		}
		
		const startWindow = new Date(now.getTime() + minutesBefore * 60 * 1000);
		const endWindow = new Date(now.getTime() + (minutesBefore + 1) * 60 * 1000);
		
		// Find upcoming bookings
		const upcomingBookings = allBookings.filter(b => 
			b.startTime >= startWindow && b.startTime < endWindow
		);
		
		return NextResponse.json({
			currentTime: now.toLocaleString(),
			minutesBefore,
			startWindow: startWindow.toLocaleString(),
			endWindow: endWindow.toLocaleString(),
			totalBookings: allBookings.length,
			allBookings: allBookings.map(b => ({
				id: b.id,
				title: b.title,
				startTime: b.startTime.toLocaleString(),
				students: b.students.map(s => ({
					name: `${s.student.firstName} ${s.student.lastName}`,
					email: s.student.email
				}))
			})),
			upcomingBookings: upcomingBookings.map(b => ({
				id: b.id,
				title: b.title,
				startTime: b.startTime.toLocaleString(),
				students: b.students.map(s => ({
					name: `${s.student.firstName} ${s.student.lastName}`,
					email: s.student.email
				}))
			}))
		});
	} catch (error) {
		console.error("Test email error:", error);
		return NextResponse.json({ 
			error: error instanceof Error ? error.message : "Unknown error" 
		}, { status: 500 });
	}
}

