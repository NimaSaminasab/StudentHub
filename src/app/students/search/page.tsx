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

export default function SearchStudentsPage() {
	const [students, setStudents] = useState<Student[]>([]);
	const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStudents() {
			try {
				const res = await fetch("/api/students");
				if (res.ok) {
					const data = await res.json();
					setStudents(data);
					setFilteredStudents(data);
				}
			} catch (error) {
				console.error("Failed to fetch students:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchStudents();
	}, []);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredStudents(students);
		} else {
			const query = searchQuery.toLowerCase().trim();
			const filtered = students.filter(student => {
				const firstName = (student.firstName || "").toLowerCase();
				const lastName = (student.lastName || "").toLowerCase();
				const email = (student.email || "").toLowerCase();
				const phone = (student.phone || "").toLowerCase();
				const fullName = `${firstName} ${lastName}`;
				
				return firstName.includes(query) ||
					lastName.includes(query) ||
					fullName.includes(query) ||
					email.includes(query) ||
					phone.includes(query);
			});
			setFilteredStudents(filtered);
		}
	}, [searchQuery, students]);

	if (loading) {
		return <main>Loading...</main>;
	}

	return (
		<main>
			<h1>Search Students</h1>
			
			<div style={{ margin: "20px 0" }}>
				<input
					type="text"
					placeholder="Search by name, email, or phone..."
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
				Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
			</div>

			{filteredStudents.length > 0 ? (
				<div style={{ overflowX: "auto", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 8 }}>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Photo</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>First Name</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Last Name</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Email</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Phone</th>
								<th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredStudents.map((s: Student) => (
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
									<td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
										<Link className="btn btn-outline" href={`/students/${s.id}`}>View</Link>
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
					{searchQuery ? "No students found matching your search." : "No students available."}
				</div>
			)}
		</main>
	);
}

