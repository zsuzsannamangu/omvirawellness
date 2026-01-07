'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FaBars, FaCalendarPlus, FaChevronLeft } from 'react-icons/fa';
import styles from '@/styles/Classes/ClassDetail.module.scss';

type ClassFilter = 'all' | 'heated' | 'unheated';

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  const [activeFilter, setActiveFilter] = useState<ClassFilter>('all');

  // Mock class data - replace with API call
  const classData = {
    id: classId,
    title: 'Deep Stretch',
    category: 'UNHEATED CLASSES',
    description: 'A calming and grounding unheated practice in our Earth Room, focusing on a full body stretch including the muscles of the neck, shoulders, back, hips and hamstrings. Find release, balance and calm with this soothing practice, whether you have been sitting at a desk all day, or participating in high-intensity workouts resulting in tired, tight muscles.',
    image: '/images/deep-stretch.jpg',
    location: 'Earth Room',
    instructor: 'Nikita C.',
    duration: '60 min',
    date: 'Wednesday, January 7, 2026',
    time: '7:30 PM',
    timezone: 'America/Los_Angeles'
  };

  return (
    <div className={styles.classDetailPage}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button 
          className={styles.backButton} 
          onClick={() => router.back()}
          aria-label="Back"
        >
          <FaChevronLeft />
        </button>
        <div className={styles.logo}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={40} 
            height={40}
            className={styles.logoImage}
          />
        </div>
        <button className={styles.calendarButton} aria-label="Calendar">
          <FaCalendarPlus />
        </button>
      </header>

      {/* Location Banner */}
      <div className={styles.locationBanner}>
        held in the {classData.location}
      </div>

      {/* Filter Navigation */}
      <section className={styles.filterSection}>
        <button
          className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          ALL CLASSES
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'heated' ? styles.active : ''}`}
          onClick={() => setActiveFilter('heated')}
        >
          HEATED CLASSES
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'unheated' ? styles.active : ''}`}
          onClick={() => setActiveFilter('unheated')}
        >
          UNHEATED CLASSES
        </button>
      </section>

      {/* Class Image */}
      <div className={styles.classImageContainer}>
        <Image
          src={classData.image}
          alt={classData.title}
          fill
          className={styles.classImage}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Class Details */}
      <section className={styles.classDetails}>
        <h1 className={styles.classTitle}>{classData.title}</h1>
        <p className={styles.classCategory}>{classData.category}</p>
        <p className={styles.classDescription}>{classData.description}</p>
      </section>

      {/* Reserve Button */}
      <div className={styles.reserveSection}>
        <Link href={`/classes/${classId}/reserve`} className={styles.reserveButton}>
          Reserve Class
        </Link>
      </div>
    </div>
  );
}
