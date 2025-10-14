import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return NextResponse.json({ error: "File must be an image" }, { status: 400 });
		}

		// Generate unique filename
		const timestamp = Date.now();
		const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Save to public/uploads
		const uploadDir = join(process.cwd(), "public", "uploads");
		const filepath = join(uploadDir, filename);
		await writeFile(filepath, buffer);

		// Return the public URL
		const imageUrl = `/uploads/${filename}`;
		return NextResponse.json({ imageUrl });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
	}
}

