"use client";
import { useState, useEffect } from "react";
import { Prisma } from "@/generated/prisma";

type Payment = {
	id: number;
	studentId: number;
	amount: number;
	date: Date;
	notes: string | null;
	bookingId: number | null;
	student: {
		id: number;
		firstName: string;
		lastName: string;
		rate: Prisma.Decimal;
	};
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

type Student = {
	id: number;
	firstName: string;
	lastName: string;
	privateRate: Prisma.Decimal;
	groupRate: Prisma.Decimal;
};

export default function PaymentsPage() {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [newPayment, setNewPayment] = useState({
		studentId: "",
		amount: "",
		notes: ""
	});
	const [submitting, setSubmitting] = useState(false);
	const [deleting, setDeleting] = useState<number | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [paymentsRes, studentsRes, bookingsRes] = await Promise.all([
					fetch("/api/payments"),
					fetch("/api/students"),
					fetch("/api/bookings")
				]);
				
				if (paymentsRes.ok) {
					const paymentsData = await paymentsRes.json();
					setPayments(paymentsData.map((payment: Payment & { date: string; amount: any }) => ({
						...payment,
						date: new Date(payment.date),
						amount: typeof payment.amount === 'object' ? Number(payment.amount) : payment.amount
					})));
				}
				
				if (studentsRes.ok) {
					const studentsData = await studentsRes.json();
					setStudents(studentsData);
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

	const handleAddPayment = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const res = await fetch("/api/payments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newPayment)
			});
			
			if (res.ok) {
				const addedPayment = await res.json() as Payment & { date: string; amount: any };
				setPayments(prev => [{
					...addedPayment,
					date: new Date(addedPayment.date),
					amount: typeof addedPayment.amount === 'object' ? Number(addedPayment.amount) : addedPayment.amount
				}, ...prev]);
				setNewPayment({ studentId: "", amount: "", notes: "" });
				setShowAddForm(false);
				// Refresh to update all balances
				window.location.reload();
			}
		} catch (error) {
			console.error("Failed to add payment:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeletePayment = async (paymentId: number) => {
		if (!confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
			return;
		}

		setDeleting(paymentId);
		try {
			const res = await fetch(`/api/payments/${paymentId}`, {
				method: "DELETE"
			});
			
			if (res.ok) {
				setPayments(prev => prev.filter(payment => payment.id !== paymentId));
				// Refresh to update all balances
				window.location.reload();
			} else {
				alert('Failed to delete payment');
			}
		} catch (error) {
			console.error("Failed to delete payment:", error);
			alert('Error deleting payment');
		} finally {
			setDeleting(null);
		}
	};


	const getTotalLessons = (studentId: number) => {
		// Find all bookings where this student attended
		let totalLessons = 0;
		
		for (const booking of bookings) {
			const studentBooking = booking.students.find(bs => bs.studentId === studentId && bs.attended);
			if (studentBooking) {
				const minutes = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60);
				const lessons = minutes / 45; // Each lesson is 45 minutes
				totalLessons += lessons;
			}
		}
		
		return totalLessons;
	};

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
			<h1>Payment Tracking</h1>
			
			<div style={{ margin: "12px 0", textAlign: "center" }}>
				<button 
					className="btn btn-primary" 
					onClick={() => setShowAddForm(!showAddForm)}
				>
					{showAddForm ? "Cancel" : "Add Payment"}
				</button>
			</div>

			{showAddForm && (
				<div className="form-container">
					<div className="form-header">
						<h2>Record New Payment</h2>
						<p>Add a payment received from a student</p>
					</div>
					
					<form className="fancy-form" onSubmit={handleAddPayment}>
						<div className="form-group">
							<label htmlFor="studentId">Select Student</label>
							<select 
								id="studentId"
								value={newPayment.studentId} 
								onChange={(e) => setNewPayment({...newPayment, studentId: e.target.value})} 
								required
							>
								<option value="">Choose a student...</option>
								{students.map((student) => (
									<option key={student.id} value={student.id}>
										{student.firstName} {student.lastName} - Private: {Math.round(Number(student.privateRate))} kr, Group: {Math.round(Number(student.groupRate))} kr
									</option>
								))}
							</select>
						</div>
						
						<div className="form-group">
							<label htmlFor="amount">Payment Amount (kr)</label>
							<input 
								id="amount"
								placeholder="Enter payment amount" 
								type="number" 
								min="0"
								value={newPayment.amount} 
								onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})} 
								required
							/>
						</div>
						
						<div className="form-group">
							<label htmlFor="notes">Notes (Optional)</label>
							<textarea 
								id="notes"
								placeholder="Add any notes about this payment..." 
								value={newPayment.notes} 
								onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
								rows={3}
							/>
						</div>
						
						<div className="form-actions">
							<button className="btn btn-primary" disabled={submitting} type="submit">
								{submitting ? "Recording..." : "Record Payment"}
							</button>
						</div>
					</form>
				</div>
			)}

			<div style={{ overflowX: "auto", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, marginTop: "24px" }}>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Date</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Student</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Amount</th>
							<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Notes</th>
							<th style={{ textAlign: "center", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{payments.map((payment) => (
							<tr key={payment.id}>
								<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
									{payment.date.toLocaleDateString()}
								</td>
								<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
									{payment.student.firstName} {payment.student.lastName}
								</td>
								<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
									{formatCurrency(payment.amount)}
								</td>
								<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
									{payment.notes ?? "N/A"}
								</td>
								<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
									<button 
										onClick={() => handleDeletePayment(payment.id)}
										disabled={deleting === payment.id}
										style={{
											backgroundColor: "#dc3545",
											borderColor: "#dc3545",
											color: "white",
											padding: "4px 8px",
											borderRadius: "4px",
											border: "none",
											cursor: deleting === payment.id ? "not-allowed" : "pointer",
											opacity: deleting === payment.id ? 0.6 : 1,
											fontSize: "12px"
										}}
									>
										{deleting === payment.id ? "..." : "Delete"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div style={{ marginTop: "32px" }}>
				<h2>Student Balances</h2>
				<div style={{ overflowX: "auto", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 8 }}>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Student</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Private Rate</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Group Rate</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Total Lessons</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Balance</th>
							</tr>
						</thead>
						<tbody>
							{students.map((student) => {
								const totalLessons = getTotalLessons(student.id);
								const balance = getTotalOwed(student.id);
								
								return (
									<tr key={student.id}>
										<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
											{student.firstName} {student.lastName}
										</td>
										<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
											{Math.round(Number(student.privateRate))} kr
										</td>
										<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
											{Math.round(Number(student.groupRate))} kr
										</td>
										<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
											{totalLessons.toFixed(1)} lessons
										</td>
										<td style={{ 
											padding: 8, 
											borderBottom: "1px solid rgba(255,255,255,0.1)",
											color: balance > 0 ? "#ff6b6b" : (balance < 0 ? "#64b5f6" : "#51cf66"),
											fontWeight: "600"
										}}>
											{formatCurrency(balance)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
