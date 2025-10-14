"use client";
import { useEffect } from 'react';

export default function EmailSchedulerInit() {
	useEffect(() => {
		// Initialize the email scheduler when the app loads
		fetch('/api/init')
			.then(res => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then(data => console.log('Email scheduler:', data))
			.catch(err => console.error('Failed to initialize email scheduler:', err.message || err));
	}, []);

	return null; // This component doesn't render anything
}

