"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageCropper from "@/components/ImageCropper";

export default function EditStudentPage() {
	const params = useParams();
	const id = Number(params?.id);
	const router = useRouter();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [privateRate, setPrivateRate] = useState<string>("");
	const [groupRate, setGroupRate] = useState<string>("");
	const [currentImage, setCurrentImage] = useState<string>("");
	const [newImage, setNewImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [imageToCrop, setImageToCrop] = useState<string>("");
	const [showCropper, setShowCropper] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageToCrop(reader.result as string);
				setShowCropper(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCropComplete = (croppedBlob: Blob) => {
		const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
		setNewImage(croppedFile);
		
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(croppedBlob);
		
		setShowCropper(false);
	};

	const handleCropCancel = () => {
		setShowCropper(false);
		setImageToCrop("");
	};

	useEffect(() => {
		async function load() {
			const res = await fetch(`/api/students/${id}`);
			if (res.ok) {
				const s = await res.json();
				setFirstName(s.firstName);
				setLastName(s.lastName);
				setEmail(s.email ?? "");
				setPhone(s.phone ?? "");
				setPrivateRate(s.privateRate?.toString() ?? "");
				setGroupRate(s.groupRate?.toString() ?? "");
				setCurrentImage(s.image ?? "");
				setImagePreview(s.image ?? "");
			}
			setLoading(false);
		}
		if (id) load();
	}, [id]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		try {
			let imageUrl = currentImage;
			
			// Upload new image if provided
			if (newImage) {
				const formData = new FormData();
				formData.append("file", newImage);
				
				const uploadRes = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});
				
				if (uploadRes.ok) {
					const uploadData = await uploadRes.json();
					imageUrl = uploadData.imageUrl;
				}
			}
			
			// Update student with new or existing image URL
			const res = await fetch(`/api/students/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, lastName, email, phone, privateRate, groupRate, image: imageUrl }),
			});
			if (!res.ok) throw new Error("Failed to update");
			router.push("/students");
			router.refresh();
		} finally {
			setSubmitting(false);
		}
	}

	async function onDelete() {
		setSubmitting(true);
		try {
			const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete");
			router.push("/students");
			router.refresh();
		} finally {
			setSubmitting(false);
		}
	}

	if (loading) return <main>Loading...</main>;

	return (
		<main>
			{showCropper && (
				<ImageCropper
					image={imageToCrop}
					onCropComplete={handleCropComplete}
					onCancel={handleCropCancel}
				/>
			)}
			
			<div className="form-container">
				<div className="form-header">
					<h1>Edit Student</h1>
					<p>Update student information</p>
				</div>
				
				<form className="fancy-form" onSubmit={onSubmit}>
					<div className="form-group">
						<label htmlFor="image">Profile Picture</label>
						<input
							id="image"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							style={{ padding: "8px" }}
						/>
						{imagePreview && (
							<div style={{ marginTop: "12px", textAlign: "center" }}>
								<img 
									src={imagePreview} 
									alt="Preview" 
									style={{ 
										width: "100px", 
										height: "100px", 
										borderRadius: "50%", 
										objectFit: "cover",
										border: "3px solid rgba(255,255,255,0.3)"
									}} 
								/>
								<p style={{ marginTop: "8px", fontSize: "0.9em", color: "rgba(255,255,255,0.7)" }}>
									{newImage ? "New image selected" : "Current image"}
								</p>
							</div>
						)}
					</div>

					<div className="form-row">
						<div className="form-group">
							<label htmlFor="firstName">First Name</label>
							<input 
								id="firstName"
								placeholder="Enter first name" 
								value={firstName} 
								onChange={(e) => setFirstName(e.target.value)} 
								required 
							/>
						</div>
						<div className="form-group">
							<label htmlFor="lastName">Last Name</label>
							<input 
								id="lastName"
								placeholder="Enter last name" 
								value={lastName} 
								onChange={(e) => setLastName(e.target.value)} 
								required 
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input 
							id="email"
							placeholder="student@example.com" 
							type="email"
							value={email} 
							onChange={(e) => setEmail(e.target.value)} 
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="phone">Phone Number</label>
						<input 
							id="phone"
							placeholder="+47 123 45 678" 
							type="tel"
							value={phone} 
							onChange={(e) => setPhone(e.target.value)} 
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label htmlFor="privateRate">Private Lesson Rate (kr)</label>
							<input 
								id="privateRate"
								placeholder="Enter private rate" 
								type="number" 
								min="0"
								value={privateRate} 
								onChange={(e) => setPrivateRate(e.target.value)} 
							/>
						</div>
						<div className="form-group">
							<label htmlFor="groupRate">Group Lesson Rate (kr)</label>
							<input 
								id="groupRate"
								placeholder="Enter group rate" 
								type="number" 
								min="0"
								value={groupRate} 
								onChange={(e) => setGroupRate(e.target.value)} 
							/>
						</div>
					</div>

					<div className="form-actions">
						<button className="btn btn-primary" disabled={submitting} type="submit">
							{submitting ? "Saving..." : "Save Changes"}
						</button>
						<button className="btn btn-danger" disabled={submitting} onClick={onDelete} style={{ marginLeft: "12px" }}>
							Delete Student
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}

