"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [formKey, setFormKey] = useState(Date.now());

	// Clear form fields when component mounts (e.g., after logout)
	useEffect(() => {
		setUsername("");
		setPassword("");
		setError("");
		setFormKey(Date.now()); // Force form to re-render with new key
	}, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setSubmitting(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			if (res.ok) {
				router.push("/students");
				router.refresh();
			} else {
				const data = await res.json();
				setError(data.error || "Invalid credentials");
			}
		} catch (err) {
			setError("Login failed. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div style={{
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
		}}>
			<div className="form-container" style={{ maxWidth: "400px", width: "100%" }}>
				<div className="form-header" style={{ textAlign: "center" }}>
					<h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📚 StudentHub</h1>
					<p>Please login to continue</p>
				</div>

				<form className="fancy-form" onSubmit={onSubmit} autoComplete="off" key={formKey}>
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							id="username"
							name="username"
							placeholder="Enter username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoFocus
							autoComplete="new-password"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete="new-password"
						/>
					</div>

					{error && (
						<div style={{ 
							padding: "12px", 
							borderRadius: "8px", 
							background: "rgba(244, 67, 54, 0.2)",
							color: "white",
							marginBottom: "16px",
							textAlign: "center"
						}}>
							{error}
						</div>
					)}

					<div className="form-actions">
						<button className="btn btn-primary" disabled={submitting} type="submit" style={{ width: "100%" }}>
							{submitting ? "Logging in..." : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

