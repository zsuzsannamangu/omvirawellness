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
    <>
      <section className={styles.hero} aria-label="Hero section">
        <div className={styles.overlay}>
          <h1 className={styles.title}>Hello, Wellness Has Arrived.</h1>
          <p className={styles.subtitle}>
          A platform that connects you to independent wellness, beauty, and fitness professionals - anytime, anywhere.  
          </p>
          <form onSubmit={handleSearch} className={styles.searchForm} role="search" aria-label="Search for services or providers">
            <label htmlFor="hero-search-desktop" className="visually-hidden">Search services or providers</label>
            <input
              id="hero-search-desktop"
              type="text"
              placeholder="Search services or providers"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search services or providers"
            />
            <button type="submit" className={styles.searchButton} aria-label="Submit search">
              Search
            </button>
          </form>
        </div>
      </section>
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchFormMobile} role="search" aria-label="Search for services or providers">
          <label htmlFor="hero-search-mobile" className="visually-hidden">Search services or providers</label>
          <input
            id="hero-search-mobile"
            type="text"
            placeholder="Search services or providers"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search services or providers"
          />
          <button type="submit" className={styles.searchButton} aria-label="Submit search">
            Search
          </button>
        </form>
      </div>
    </>
  );
};

export default Hero;
