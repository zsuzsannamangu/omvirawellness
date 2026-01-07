'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaChevronLeft } from 'react-icons/fa';
import styles from '@/styles/Classes/ReserveClass.module.scss';

export default function ReserveClassPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token');

  // Mock class data - replace with API call
  const classData = {
    id: classId,
    title: 'Flow & Restore (unheated)',
    date: 'Wednesday, January 7, 2026',
    time: '7:30 PM',
    timezone: 'America/Los_Angeles',
    location: 'North Portland · Earth Room',
    duration: '60 min.',
    instructor: 'Nikita C.'
  };

  return (
    <div className={styles.reservePage}>
      {/* Back Navigation */}
      <header className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={() => router.back()}
          aria-label="Back to Schedule"
        >
          <FaChevronLeft />
          <span>Back to Schedule</span>
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Reserve Class</h1>

        {/* Class Details Card */}
        <div className={styles.classCard}>
          <h2 className={styles.className}>{classData.title}</h2>
          
          <div className={styles.classInfo}>
            <p className={styles.classDateTime}>
              {classData.date} at {classData.time} {classData.timezone}
            </p>
            <p className={styles.classDetails}>
              {classData.location} · {classData.duration} · {classData.instructor}
            </p>
          </div>

          <Link href={`/classes/${classId}`} className={styles.viewDetailsLink}>
            View Class Details
          </Link>

          <div className={styles.divider}></div>
        </div>

        {/* Login Prompt */}
        {!isAuthenticated ? (
          <div className={styles.loginPrompt}>
            <h2 className={styles.loginTitle}>Log in to continue</h2>
            <p className={styles.loginDescription}>
              Please log in or create an account to make a reservation.
            </p>
            
            <Link href="/login" className={styles.loginButton}>
              LOG IN
            </Link>
            
            <p className={styles.createAccountText}>
              Don't have an account?{' '}
              <Link href="/signup" className={styles.createAccountLink}>
                Create one now.
              </Link>
            </p>
          </div>
        ) : (
          <div className={styles.bookingForm}>
            {/* Booking form will go here for authenticated users */}
            <p>Booking form coming soon...</p>
          </div>
        )}
      </main>

      {/* Decorative Yoga Pose */}
      <div className={styles.decorativePose}></div>
    </div>
  );
}
