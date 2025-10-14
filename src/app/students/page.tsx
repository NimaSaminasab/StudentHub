"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Prisma } from "@/generated/prisma";

type Student = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	image: string | null;
	privateRate: Prisma.Decimal;
	groupRate: Prisma.Decimal;
};

type Payment = {
	id: number;
	studentId: number;
	amount: number;
	date: Date;
	notes: string | null;
	bookingId: number | null;
};

type Booking = {
	id: number;
	title: string;
	startTime: Date;
	endTime: Date;
	notes: string | null;
	students: Array<{
		id: number;
		studentId: number;
		attended: boolean;
	}>;
};

export default function StudentsPage() {
	const [students, setStudents] = useState<Student[]>([]);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const [studentsRes, paymentsRes, bookingsRes] = await Promise.all([
					fetch("/api/students"),
					fetch("/api/payments"),
					fetch("/api/bookings")
				]);
				
				if (studentsRes.ok) {
					const studentsData = await studentsRes.json();
					setStudents(studentsData);
				}
				
				if (paymentsRes.ok) {
					const paymentsData = await paymentsRes.json();
					setPayments(paymentsData.map((payment: Payment & { date: string; amount: any }) => ({
						...payment,
						date: new Date(payment.date),
						amount: typeof payment.amount === 'object' ? Number(payment.amount) : payment.amount
					})));
				}
				
				if (bookingsRes.ok) {
					const bookingsData = await bookingsRes.json();
					setBookings(bookingsData.map((booking: any) => ({
						...booking,
						startTime: new Date(booking.startTime),
						endTime: new Date(booking.endTime)
					})));
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const getTotalOwed = (studentId: number) => {
		const student = students.find(s => s.id === studentId);
		if (!student) return 0;
		
		// Calculate total owed based on lesson type (private or group)
		let totalOwed = 0;
		
		for (const booking of bookings) {
			const studentBooking = booking.students.find(bs => bs.studentId === studentId && bs.attended);
			if (studentBooking) {
				const minutes = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60);
				const lessons = minutes / 45; // Each lesson is 45 minutes
				
				// Determine if it's a group or private lesson
				const isGroupLesson = booking.students.length > 1;
				const rate = isGroupLesson ? Number(student.groupRate) : Number(student.privateRate);
				
				totalOwed += lessons * rate;
			}
		}
		
		// Calculate total payments received
		const studentPayments = payments.filter(p => p.studentId === studentId);
		const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
		
		// Return the difference (can be negative if overpaid)
		return totalOwed - totalPaid;
	};

	const formatCurrency = (amount: number) => {
		const rounded = Math.round(amount);
		if (rounded > 0) {
			return `-${rounded} kr`; // Owes money (debt)
		} else if (rounded < 0) {
			return `+${Math.abs(rounded)} kr`; // Overpaid (credit)
		} else {
			return `${rounded} kr`; // Paid up
		}
	};

	if (loading) {
		return <main>Loading...</main>;
	}

	return (
		<main>
			<h1>Students</h1>
			<div style={{ margin: "12px 0" }}>
				<Link className="btn btn-primary" href="/students/new">Create Student</Link>
			</div>
			<div style={{ overflowX: "auto", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 8 }}>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Photo</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>First Name</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Last Name</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Email</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Phone</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Private Rate</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Group Rate</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Balance</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{students.map((s: Student) => {
							const balance = getTotalOwed(s.id);
							const studentPayments = payments.filter(p => p.studentId === s.id);
							const totalPaid = studentPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
							
							return (
								<tr key={s.id}>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
										{s.image ? (
											<img 
												src={s.image} 
												alt={`${s.firstName} ${s.lastName}`}
												style={{ 
													width: "40px", 
													height: "40px", 
													borderRadius: "50%", 
													objectFit: "cover",
													border: "2px solid rgba(255,255,255,0.3)"
												}}
											/>
										) : (
											<div style={{ 
												width: "40px", 
												height: "40px", 
												borderRadius: "50%", 
												background: "rgba(255,255,255,0.2)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "18px",
												fontWeight: "600"
											}}>
												{s.firstName.charAt(0)}{s.lastName.charAt(0)}
											</div>
										)}
									</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{s.firstName}</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{s.lastName}</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{s.email}</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{s.phone ?? "N/A"}</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{Math.round(Number(s.privateRate))} kr</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{Math.round(Number(s.groupRate))} kr</td>
									<td style={{ 
										padding: 8, 
										borderBottom: "1px solid rgba(255,255,255,0.1)",
										color: balance > 0 ? "#ff6b6b" : (balance < 0 ? "#64b5f6" : "#51cf66"),
										fontWeight: "600"
									}}>
										{formatCurrency(balance)}
									</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
										<Link className="btn btn-outline" href={`/students/${s.id}`}>Edit</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</main>
	);
}