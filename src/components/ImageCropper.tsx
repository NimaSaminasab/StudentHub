"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

type ImageCropperProps = {
	image: string;
	onCropComplete: (croppedImage: Blob) => void;
	onCancel: () => void;
};

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [processing, setProcessing] = useState(false);

	const onCropChange = (location: Point) => {
		setCrop(location);
	};

	const onZoomChange = (zoom: number) => {
		setZoom(zoom);
	};

	const onCropCompleteCallback = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	const createCroppedImage = async () => {
		if (!croppedAreaPixels) return;

		setProcessing(true);
		try {
			const croppedImage = await getCroppedImg(image, croppedAreaPixels);
			onCropComplete(croppedImage);
		} catch (error) {
			console.error("Error cropping image:", error);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div style={{
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: "rgba(0, 0, 0, 0.9)",
			zIndex: 9999,
			display: "flex",
			flexDirection: "column"
		}}>
			<div style={{
				flex: 1,
				position: "relative"
			}}>
				<Cropper
					image={image}
					crop={crop}
					zoom={zoom}
					aspect={1}
					cropShape="round"
					showGrid={false}
					onCropChange={onCropChange}
					onZoomChange={onZoomChange}
					onCropComplete={onCropCompleteCallback}
				/>
			</div>
			
			<div style={{
				padding: "20px",
				background: "rgba(0, 0, 0, 0.8)",
				display: "flex",
				flexDirection: "column",
				gap: "16px"
			}}>
				<div>
					<label style={{ color: "white", marginBottom: "8px", display: "block" }}>
						Zoom
					</label>
					<input
						type="range"
						min={1}
						max={3}
						step={0.1}
						value={zoom}
						onChange={(e) => setZoom(Number(e.target.value))}
						style={{ width: "100%" }}
					/>
				</div>
				
				<div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
					<button
						className="btn btn-outline"
						onClick={onCancel}
						disabled={processing}
					>
						Cancel
					</button>
					<button
						className="btn btn-primary"
						onClick={createCroppedImage}
						disabled={processing}
					>
						{processing ? "Processing..." : "Crop & Save"}
					</button>
				</div>
			</div>
		</div>
	);
}

// Helper function to create cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("No 2d context");
	}

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) {
				resolve(blob);
			} else {
				reject(new Error("Canvas is empty"));
			}
		}, "image/jpeg", 0.95);
	});
}

function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});
}

