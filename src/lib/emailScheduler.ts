import cron from 'node-cron';
import prisma from './prisma';
import { sendClassReminderEmail } from './email';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

function getEmailSettings() {
	try {
		const settingsFile = join(process.cwd(), 'email-settings.json');
		if (existsSync(settingsFile)) {
			const data = readFileSync(settingsFile, 'utf-8');
			return JSON.parse(data);
		}
	} catch (error) {
		console.error('Error reading email settings:', error);
	}
	return { minutesBefore: 2 }; // Default
}

let isSchedulerRunning = false;

export function startEmailScheduler() {
	// Prevent multiple instances
	if (isSchedulerRunning) {
		console.log('Email scheduler already running');
		return;
	}

	// Run every minute
	cron.schedule('* * * * *', async () => {
		try {
			const settings = getEmailSettings();
			const minutesBefore = settings.minutesBefore || 2;
			
			const now = new Date();
			const startWindow = new Date(now.getTime() + minutesBefore * 60 * 1000);
			const endWindow = new Date(now.getTime() + (minutesBefore + 1) * 60 * 1000);

			console.log(`[${now.toLocaleTimeString()}] Checking for upcoming bookings...`);
			console.log(`Looking for bookings between ${startWindow.toLocaleTimeString()} and ${endWindow.toLocaleTimeString()} (${minutesBefore} min before)`);

			// Find bookings starting in the configured time window (to avoid sending multiple emails)
			const upcomingBookings = await prisma.booking.findMany({
				where: {
					startTime: {
						gte: startWindow,
						lt: endWindow,
					},
				},
				include: {
					students: {
						include: {
							student: true
						}
					}
				},
			});

			console.log(`Found ${upcomingBookings.length} upcoming booking(s)`);

			// Send reminder emails to all students in each booking
			let emailCount = 0;
			for (const booking of upcomingBookings) {
				for (const bookingStudent of booking.students) {
					console.log(`Sending reminder for booking ${booking.id} to ${bookingStudent.student.email}`);
					const result = await sendClassReminderEmail(
						bookingStudent.student.email,
						`${bookingStudent.student.firstName} ${bookingStudent.student.lastName}`,
						booking.title,
						booking.startTime,
						minutesBefore
					);
					console.log('Email result:', result);
					emailCount++;
				}
			}

			if (emailCount > 0) {
				console.log(`Sent ${emailCount} reminder email(s) for ${upcomingBookings.length} booking(s)`);
			}
		} catch (error) {
			console.error('Error in email scheduler:', error);
		}
	});

	isSchedulerRunning = true;
	console.log('Email scheduler started - checking every minute for upcoming classes');
}

