"use client";
import { useState, useEffect } from "react";

type Payment = {
	id: number;
	studentId: number;
	amount: number;
	date: Date;
	notes: string | null;
	student: {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
	};
};

export default function SearchPaymentsPage() {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchPayments() {
			try {
				const res = await fetch("/api/payments");
				if (res.ok) {
					const data = await res.json();
					const paymentsWithDates = data.map((payment: Payment & { date: string }) => ({
						...payment,
						date: new Date(payment.date)
					}));
					setPayments(paymentsWithDates);
					setFilteredPayments(paymentsWithDates);
				}
			} catch (error) {
				console.error("Failed to fetch payments:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchPayments();
	}, []);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredPayments(payments);
		} else {
			const query = searchQuery.toLowerCase();
			const filtered = payments.filter(payment =>
				payment.student.firstName.toLowerCase().includes(query) ||
				payment.student.lastName.toLowerCase().includes(query) ||
				payment.student.email.toLowerCase().includes(query) ||
				payment.amount.toString().includes(query) ||
				(payment.notes && payment.notes.toLowerCase().includes(query))
			);
			setFilteredPayments(filtered);
		}
	}, [searchQuery, payments]);

	const formatCurrency = (amount: number) => {
		return `${Math.round(amount)} kr`;
	};

	if (loading) {
		return <main>Loading...</main>;
	}

	return (
		<main>
			<h1>Search Payments</h1>
			
			<div style={{ margin: "20px 0" }}>
				<input
					type="text"
					placeholder="Search by student name, email, amount, or notes..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					style={{
						width: "100%",
						padding: "12px 16px",
						fontSize: "16px",
						borderRadius: "8px",
						border: "1px solid rgba(255,255,255,0.3)",
						background: "rgba(255,255,255,0.1)",
						color: "white",
						outline: "none"
					}}
					autoFocus
				/>
			</div>

			<div style={{ marginBottom: "16px", color: "rgba(255,255,255,0.7)" }}>
				Found {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
			</div>

			{filteredPayments.length > 0 ? (
				<div style={{ overflowX: "auto", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 8 }}>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Student</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Amount</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Date</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Notes</th>
							</tr>
						</thead>
						<tbody>
							{filteredPayments.map((payment) => (
								<tr key={payment.id}>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
										{payment.student.firstName} {payment.student.lastName}
										<br />
										<span style={{ fontSize: "0.85em", color: "rgba(255,255,255,0.6)" }}>
											{payment.student.email}
										</span>
									</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)", fontWeight: "600", color: "#51cf66" }}>
										{formatCurrency(payment.amount)}
									</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
										{payment.date.toLocaleDateString()}
									</td>
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
										{payment.notes ?? "N/A"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div style={{ 
					padding: "40px", 
					textAlign: "center", 
					background: "rgba(255,255,255,0.1)", 
					borderRadius: "8px",
					color: "rgba(255,255,255,0.7)"
				}}>
					{searchQuery ? "No payments found matching your search." : "No payments available."}
				</div>
			)}
		</main>
	);
}

