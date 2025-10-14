"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
	const [emailMinutesBefore, setEmailMinutesBefore] = useState<string>("2");
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		// Load current setting
		async function loadSettings() {
			const res = await fetch("/api/settings/email");
			if (res.ok) {
				const data = await res.json();
				setEmailMinutesBefore(data.minutesBefore?.toString() || "2");
			}
		}
		loadSettings();
	}, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		setMessage("");
		try {
			const res = await fetch("/api/settings/email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ minutesBefore: Number(emailMinutesBefore) }),
			});
			
			if (res.ok) {
				setMessage("Settings saved successfully! Restart the server for changes to take effect.");
			} else {
				setMessage("Failed to save settings");
			}
		} catch (error) {
			setMessage("Error saving settings");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main>
			<div className="form-container">
				<div className="form-header">
					<h1>Email Reminder Settings</h1>
					<p>Configure when students receive email reminders before their classes</p>
				</div>

				<form className="fancy-form" onSubmit={onSubmit}>
					<div className="form-group">
						<label htmlFor="minutesBefore">Send Email Reminder (minutes before class)</label>
						<input
							id="minutesBefore"
							type="number"
							min="1"
							max="60"
							value={emailMinutesBefore}
							onChange={(e) => setEmailMinutesBefore(e.target.value)}
							required
						/>
						<small style={{ color: "rgba(255,255,255,0.7)", marginTop: "4px", display: "block" }}>
							Students will receive an email reminder {emailMinutesBefore} minute(s) before their class starts
						</small>
					</div>

					{message && (
						<div style={{ 
							padding: "12px", 
							borderRadius: "8px", 
							background: message.includes("success") ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)",
							color: "white",
							marginBottom: "16px"
						}}>
							{message}
						</div>
					)}

					<div className="form-actions">
						<button className="btn btn-primary" disabled={submitting} type="submit">
							{submitting ? "Saving..." : "Save Settings"}
						</button>
					</div>
				</form>

				<div style={{ marginTop: "32px", padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "12px" }}>
					<h3 style={{ marginTop: 0 }}>Current Configuration</h3>
					<p>Email reminders are sent <strong>{emailMinutesBefore} minute(s)</strong> before class starts</p>
					<p style={{ fontSize: "0.9em", color: "rgba(255,255,255,0.7)", marginTop: "16px" }}>
						Note: After changing this setting, you need to restart the development server for the changes to take effect.
					</p>
				</div>
			</div>
		</main>
	);
}

