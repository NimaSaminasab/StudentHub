"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Add timestamp to force page refresh and clear any cached values
      router.push(`/login?t=${Date.now()}`);
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isParentActive = (paths: string[]) => {
    return paths.some(path => pathname.startsWith(path));
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't show navigation on login page (after all hooks are called)
  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="top-nav">
      <div className="nav-container" ref={navRef}>
        <div className="nav-brand">
          <Link href="/" className="brand-link">
            <span className="brand-icon">📚</span>
            <span className="brand-text">StudentHub</span>
          </Link>
        </div>
        
        <div className="nav-menu">
          <div className="nav-dropdown">
            <button 
              className={`nav-link dropdown-trigger ${isParentActive(['/students']) ? 'active' : ''}`}
              onClick={() => toggleDropdown('students')}
            >
              Students
              <span className="dropdown-arrow">▼</span>
            </button>
            {activeDropdown === 'students' && (
              <div className="dropdown-menu">
                <Link href="/students" className="dropdown-item" onClick={() => setActiveDropdown(null)}>View Students</Link>
                <Link href="/students/new" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Add Student</Link>
                <Link href="/students/search" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Search Students</Link>
                <Link href="/students" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Remove Student</Link>
              </div>
            )}
          </div>

          <div className="nav-dropdown">
            <button 
              className={`nav-link dropdown-trigger ${isParentActive(['/bookings']) ? 'active' : ''}`}
              onClick={() => toggleDropdown('bookings')}
            >
              Bookings
              <span className="dropdown-arrow">▼</span>
            </button>
            {activeDropdown === 'bookings' && (
              <div className="dropdown-menu">
                <Link href="/bookings" className="dropdown-item" onClick={() => setActiveDropdown(null)}>View Bookings</Link>
                <Link href="/bookings/new" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Add Booking</Link>
                <Link href="/bookings" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Remove Booking</Link>
              </div>
            )}
          </div>

          <div className="nav-dropdown">
            <button 
              className={`nav-link dropdown-trigger ${isParentActive(['/payments']) ? 'active' : ''}`}
              onClick={() => toggleDropdown('payments')}
            >
              Payments
              <span className="dropdown-arrow">▼</span>
            </button>
            {activeDropdown === 'payments' && (
              <div className="dropdown-menu">
                <Link href="/payments" className="dropdown-item" onClick={() => setActiveDropdown(null)}>View Payments</Link>
                <Link href="/payments/search" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Search Payments</Link>
              </div>
            )}
          </div>

          <div className="nav-dropdown">
            <button 
              className={`nav-link dropdown-trigger ${isParentActive(['/settings']) ? 'active' : ''}`}
              onClick={() => toggleDropdown('settings')}
            >
              Settings
              <span className="dropdown-arrow">▼</span>
            </button>
            {activeDropdown === 'settings' && (
              <div className="dropdown-menu">
                <Link href="/settings" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Email Reminders</Link>
                <Link href="/settings/password" className="dropdown-item" onClick={() => setActiveDropdown(null)}>Change Password</Link>
              </div>
            )}
          </div>

          <button 
            className="nav-link" 
            onClick={handleLogout}
            style={{ marginLeft: "12px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
