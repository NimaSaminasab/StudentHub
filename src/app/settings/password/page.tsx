"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
	const router = useRouter();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState<"success" | "error">("success");

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		setMessage("");

		// Validation
		if (newPassword !== confirmPassword) {
			setMessage("New passwords do not match");
			setMessageType("error");
			setSubmitting(false);
			return;
		}

		if (newPassword.length < 6) {
			setMessage("New password must be at least 6 characters long");
			setMessageType("error");
			setSubmitting(false);
			return;
		}

		try {
			const res = await fetch("/api/auth/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage("Password changed successfully!");
				setMessageType("success");
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
				
				// Redirect to login after 2 seconds
				setTimeout(() => {
					router.push("/login");
				}, 2000);
			} else {
				setMessage(data.error || "Failed to change password");
				setMessageType("error");
			}
		} catch (error) {
			setMessage("Error changing password");
			setMessageType("error");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main>
			<div className="form-container">
				<div className="form-header">
					<h1>Change Password</h1>
					<p>Update your admin password</p>
				</div>

				<form className="fancy-form" onSubmit={onSubmit}>
					<div className="form-group">
						<label htmlFor="currentPassword">Current Password</label>
						<input
							id="currentPassword"
							type="password"
							placeholder="Enter current password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="newPassword">New Password</label>
						<input
							id="newPassword"
							type="password"
							placeholder="Enter new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">Confirm New Password</label>
						<input
							id="confirmPassword"
							type="password"
							placeholder="Confirm new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>

					{message && (
						<div style={{ 
							padding: "12px", 
							borderRadius: "8px", 
							background: messageType === "success" ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)",
							color: "white",
							marginBottom: "16px"
						}}>
							{message}
						</div>
					)}

					<div className="form-actions">
						<button className="btn btn-primary" disabled={submitting} type="submit">
							{submitting ? "Changing..." : "Change Password"}
						</button>
					</div>
				</form>

				<div style={{ marginTop: "32px", padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "12px" }}>
					<h3 style={{ marginTop: 0 }}>Password Requirements</h3>
					<ul style={{ paddingLeft: "20px", color: "rgba(255,255,255,0.8)" }}>
						<li>Minimum 6 characters</li>
						<li>Current password must be correct</li>
						<li>New password and confirmation must match</li>
					</ul>
					<p style={{ fontSize: "0.9em", color: "rgba(255,255,255,0.7)", marginTop: "16px" }}>
						Note: After changing your password, you will be logged out and need to login with the new password.
					</p>
				</div>
			</div>
		</main>
	);
}

