"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Student = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
};

export default function NewBookingPage() {
	const router = useRouter();
	const [students, setStudents] = useState<Student[]>([]);
	const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
	const [title, setTitle] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [notes, setNotes] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		async function fetchStudents() {
			const res = await fetch("/api/students");
			if (res.ok) {
				const studentsData = await res.json();
				setStudents(studentsData);
			}
		}
		fetchStudents();
	}, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		try {
			const res = await fetch("/api/bookings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					studentIds: selectedStudents,
					title,
					startTime: new Date(startTime).toISOString(),
					endTime: new Date(endTime).toISOString(),
					notes
				}),
			});
			if (!res.ok) throw new Error("Failed to create booking");
			router.push("/bookings");
			router.refresh();
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main>
			<div className="form-container">
				<div className="form-header">
					<h1>Create New Booking</h1>
					<p>Schedule an appointment for a student</p>
				</div>
				
				<form className="fancy-form" onSubmit={onSubmit}>
					<div className="form-group">
						<label htmlFor="students">Select Students (hold Ctrl/Cmd for multiple)</label>
						<select 
							id="students"
							multiple
							size={Math.min(students.length, 5)}
							value={selectedStudents.map(String)}
							onChange={(e) => {
								const selected = Array.from(e.target.selectedOptions).map(option => Number(option.value));
								setSelectedStudents(selected);
							}}
							required
							style={{ minHeight: "120px" }}
						>
							{students.map((student) => (
								<option key={student.id} value={student.id}>
									{student.firstName} {student.lastName} - {student.email}
								</option>
							))}
						</select>
						<small style={{ color: "rgba(255,255,255,0.7)", marginTop: "4px", display: "block" }}>
							{selectedStudents.length > 0 
								? `${selectedStudents.length} student(s) selected` 
								: "No students selected"}
						</small>
					</div>
					
					<div className="form-group">
						<label htmlFor="title">Appointment Title</label>
						<input 
							id="title"
							placeholder="Enter appointment title" 
							value={title} 
							onChange={(e) => setTitle(e.target.value)} 
							required
						/>
					</div>
					
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="startTime">Start Time</label>
							<input 
								id="startTime"
								type="datetime-local" 
								value={startTime} 
								onChange={(e) => setStartTime(e.target.value)} 
								required
							/>
						</div>
						
						<div className="form-group">
							<label htmlFor="endTime">End Time</label>
							<input 
								id="endTime"
								type="datetime-local" 
								value={endTime} 
								onChange={(e) => setEndTime(e.target.value)} 
								required
							/>
						</div>
					</div>
					
					<div className="form-group">
						<label htmlFor="notes">Notes (Optional)</label>
						<textarea 
							id="notes"
							placeholder="Add any additional notes..." 
							value={notes} 
							onChange={(e) => setNotes(e.target.value)}
							rows={4}
						/>
					</div>
					
					<div className="form-actions">
						<button className="btn btn-primary" disabled={submitting} type="submit">
							{submitting ? "Creating..." : "Create Booking"}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
