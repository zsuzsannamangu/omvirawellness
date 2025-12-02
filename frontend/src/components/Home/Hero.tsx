'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Home/Hero.module.scss';

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Hello, Wellness Has Arrived.</h1>
        <p className={styles.subtitle}>
        A platform that connects you to independent wellness, beauty, and fitness professionals - anytime, anywhere.  
        </p>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search services or providers"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
