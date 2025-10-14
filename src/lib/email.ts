import nodemailer from 'nodemailer';

// Create a transporter - configured for Gmail
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.SMTP_USER || 'your-email@gmail.com',
		pass: process.env.SMTP_PASS || 'your-app-password',
	},
	tls: {
		rejectUnauthorized: false
	}
});

export async function sendClassReminderEmail(
	studentEmail: string,
	studentName: string,
	classTitle: string,
	startTime: Date,
	minutesBefore: number = 2
) {
	try {
		console.log('Attempting to send email...');
		console.log('From:', process.env.SMTP_USER);
		console.log('To:', studentEmail);
		
		// Verify connection first
		await transporter.verify();
		console.log('SMTP connection verified');
		
		const timeText = minutesBefore === 1 ? '1 minute' : `${minutesBefore} minutes`;
		
		const info = await transporter.sendMail({
			from: `"StudentHub" <${process.env.SMTP_USER}>`,
			to: studentEmail,
			subject: `Reminder: Class starting in ${timeText} - ${classTitle}`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #2196F3;">Class Reminder</h2>
					<p>Hi ${studentName},</p>
					<p>This is a friendly reminder that your class is starting in ${timeText}!</p>
					<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<h3 style="margin-top: 0; color: #333;">${classTitle}</h3>
						<p style="margin: 5px 0;"><strong>Start Time:</strong> ${startTime.toLocaleString()}</p>
					</div>
					<p>Please be ready to join your lesson.</p>
					<p style="color: #666; font-size: 0.9em; margin-top: 30px;">
						This is an automated reminder from StudentHub.
					</p>
				</div>
			`,
		});

		console.log('✅ Email sent successfully!');
		console.log('Message ID:', info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error('❌ Error sending email:', error);
		console.error('Error details:', error instanceof Error ? error.message : error);
		return { success: false, error };
	}
}

