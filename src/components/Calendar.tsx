"use client";
import { useState } from "react";

type Booking = {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  notes: string | null;
  students: Array<{
    id: number;
    studentId: number;
    attended: boolean;
    student: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
};

type CalendarProps = {
  bookings: Booking[];
  onDateClick: (date: Date) => void;
  selectedDate?: Date;
};

export default function Calendar({ bookings, onDateClick, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate.toDateString() === date.toDateString();
    });
  };


  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayBookings = getBookingsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayBookings.length > 0 ? 'has-bookings' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <div className="day-number">{day}</div>
          {dayBookings.length > 0 && (
            <div className="booking-indicator">
              {dayBookings.length} booking{dayBookings.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="btn btn-outline" onClick={() => navigateMonth('prev')}>
          ←
        </button>
        <h2 className="calendar-title">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button className="btn btn-outline" onClick={() => navigateMonth('next')}>
          →
        </button>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}
