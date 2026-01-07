'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaCalendarPlus } from 'react-icons/fa';
import styles from '@/styles/Classes/Classes.module.scss';

type ClassFilter = 'all' | 'heated' | 'unheated';

export default function ClassesPage() {
  const [activeFilter, setActiveFilter] = useState<ClassFilter>('all');

  return (
    <div className={styles.classesPage}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button className={styles.menuButton} aria-label="Menu">
          <FaBars />
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

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Our Classes</h1>
          <div className={styles.heroAccent}></div>
          <p className={styles.heroDescription}>
            Whether you are craving the heat, prefer an unheated class, or you like practicing from home- we have options for you! Our radiantly-heated classes are held in the Fire Room and our unheated classes are held in the Earth Room.
          </p>
        </div>
      </section>

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

      {/* Classes List */}
      <section className={styles.classesList}>
        {/* Placeholder - will be populated with actual classes */}
        <div className={styles.classCard}>
          <Link href="/classes/1" className={styles.classLink}>
            <div className={styles.classImageWrapper}>
              <img
                src="/images/deep-stretch.jpg"
                alt="Deep Stretch"
                className={styles.classCardImage}
                onError={(e) => {
                  // Fallback to placeholder if image doesn't exist
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Deep+Stretch';
                }}
              />
            </div>
            <div className={styles.classCardContent}>
              <h3 className={styles.classCardTitle}>Deep Stretch</h3>
              <p className={styles.classCardCategory}>UNHEATED CLASSES</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
