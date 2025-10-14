"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";

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
		student: {
			id: number;
			firstName: string;
			lastName: string;
			email: string;
			rate: number;
		};
	}>;
};

export default function BookingsPage() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchBookings() {
			try {
				const res = await fetch("/api/bookings");
				if (res.ok) {
					const data = await res.json();
					// Convert date strings back to Date objects
					const bookingsWithDates = data.map((booking: any) => ({
						...booking,
						startTime: new Date(booking.startTime),
						endTime: new Date(booking.endTime),
						students: booking.students.map((bs: any) => ({
							...bs,
							student: {
								...bs.student,
								rate: Number(bs.student.rate)
							}
						}))
					}));
					setBookings(bookingsWithDates);
				}
			} catch (error) {
				console.error("Failed to fetch bookings:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchBookings();
	}, []);

	const handleDateClick = (date: Date) => {
		setSelectedDate(date);
	};

	const getBookingsForSelectedDate = () => {
		if (!selectedDate) return [];
		return bookings.filter(booking => {
			const bookingDate = new Date(booking.startTime);
			return bookingDate.toDateString() === selectedDate.toDateString();
		});
	};

	const formatDateTime = (date: Date) => {
		return new Date(date).toLocaleString();
	};

	const handleAttended = async (booking: Booking, studentId: number) => {
		try {
			// Find current attendance status
			const currentBookingStudent = booking.students.find(bs => bs.studentId === studentId);
			const currentAttended = currentBookingStudent?.attended || false;
			const newAttended = !currentAttended; // Toggle attendance

			// Update the specific student's attended status
			const res = await fetch(`/api/bookings/${booking.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					studentId: studentId,
					title: booking.title,
					startTime: booking.startTime.toISOString(),
					endTime: booking.endTime.toISOString(),
					notes: booking.notes,
					attended: newAttended
				})
			});
			
			if (res.ok) {
				// Update local state immediately for better UX
				setBookings(prevBookings => 
					prevBookings.map(b => 
						b.id === booking.id 
							? {
								...b,
								students: b.students.map(bs => 
									bs.studentId === studentId 
										? { ...bs, attended: newAttended }
										: bs
								)
							}
							: b
					)
				);
			} else {
				const errorData = await res.json();
				alert(`Failed to update attendance: ${errorData.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Error updating attendance:", error);
			alert("Error updating attendance");
		}
	};

	if (loading) {
		return <main>Loading...</main>;
	}

	return (
		<main>
			<h1>Bookings Calendar</h1>
			<div style={{ margin: "12px 0", textAlign: "center" }}>
				<Link className="btn btn-primary" href="/bookings/new">New Booking</Link>
			</div>

			<Calendar 
				bookings={bookings} 
				onDateClick={handleDateClick}
				selectedDate={selectedDate || undefined}
			/>

			{selectedDate && (
				<div style={{ marginTop: "24px" }}>
					<h2>Bookings for {selectedDate.toDateString()}</h2>
					{getBookingsForSelectedDate().length > 0 ? (
						<div style={{ overflowX: "auto", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 8 }}>
							<table style={{ width: "100%", borderCollapse: "collapse" }}>
								<thead>
									<tr>
										<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Title</th>
										<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Student</th>
										<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Start Time</th>
										<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>End Time</th>
										<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Notes</th>
										<th style={{ textAlign: "center", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{getBookingsForSelectedDate().map((b: Booking) => (
										<tr key={b.id}>
											<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{b.title}</td>
											<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
												{b.students.map((bs, idx) => (
													<div key={bs.id} style={{ marginBottom: idx < b.students.length - 1 ? "4px" : "0" }}>
														{bs.student.firstName} {bs.student.lastName}
														{bs.attended && <span style={{ color: "#51cf66", marginLeft: "8px" }}>✓</span>}
													</div>
												))}
											</td>
											<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
												{formatDateTime(b.startTime)}
											</td>
											<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
												{formatDateTime(b.endTime)}
											</td>
											<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
												{b.notes ?? "N/A"}
											</td>
											<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
												<div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
													<Link className="btn btn-outline" href={`/bookings/${b.id}`} style={{ fontSize: "0.8rem", padding: "4px 8px" }}>
														Edit
													</Link>
													{b.students.map((bs) => (
														<button 
															key={bs.id}
															className={bs.attended ? "btn btn-success" : "btn btn-primary"} 
															onClick={() => handleAttended(b, bs.studentId)}
															style={{ fontSize: "0.7rem", padding: "3px 6px", width: "100%" }}
														>
															{bs.attended ? `✓ ${bs.student.firstName}` : bs.student.firstName}
														</button>
													))}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p style={{ color: "rgba(255,255,255,0.7)" }}>No bookings for this date.</p>
					)}
				</div>
			)}
		</main>
	);
}
