"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page immediately
    router.push("/login");
  }, [router]);

  return (
    <main>
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">
            Redirecting to <span className="brand-gradient">StudentHub</span> Login...
          </h1>
          <p className="home-subtitle">
            Please wait while we redirect you to the login page.
          </p>
        </div>
      </div>
    </main>
  );
}
