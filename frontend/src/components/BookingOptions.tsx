'use client';

import Link from 'next/link';
import styles from '@/styles/BookingOptions.module.scss';

interface BookingOptionsProps {
  isAuthenticated: boolean;
  canBook: boolean;
  bookingUrl?: string;
  serviceName?: string;
  selectedDate?: string;
  selectedSlot?: string;
}

export default function BookingOptions({ 
  isAuthenticated, 
  canBook, 
  bookingUrl, 
  serviceName, 
  selectedDate, 
  selectedSlot 
}: BookingOptionsProps) {
  if (!canBook) {
    return (
      <button
        className={`${styles.bookButton} ${styles.disabled}`}
        disabled
      >
        Book
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        href={bookingUrl || '#'}
        className={styles.bookButton}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        Book
      </Link>
    );
  }

  return (
    <div className={styles.bookingOptionsContainer}>
      <Link
        href={`http://localhost:3000/login?redirect=${encodeURIComponent(bookingUrl || '/search')}`}
        className={styles.authButton}
      >
        Sign In to Book
      </Link>
      <Link
        href={`/signup?redirect=${encodeURIComponent(bookingUrl || '/search')}`}
        className={styles.authButton}
      >
        Register to Book
      </Link>
      <Link
        href={bookingUrl || '#'}
        className={styles.guestButton}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        Book as Guest
      </Link>
    </div>
  );
}
