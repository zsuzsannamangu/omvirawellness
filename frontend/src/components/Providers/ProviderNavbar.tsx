'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from '@/styles/Providers/ProviderNavbar.module.scss';

export default function ProviderNavbar() {
  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  };

  // Handle hash navigation on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1); // Remove the # symbol
        // Only scroll if it's a valid section
        const validSections = ['who-is-omvira-for', 'work-where-clients-need-you', 'everything-you-need', 'our-mission', 'pricing', 'about'];
        if (validSections.includes(sectionId)) {
          setTimeout(() => {
            scrollToSection(sectionId);
          }, 100);
        }
      }
    }
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/providers" className={styles.logoLink}>
          Omvira Wellness
        </Link>
      </div>

      <nav className={styles.mainNav}>
        <button
          onClick={() => scrollToSection('who-is-omvira-for')}
          className={styles.navLink}
        >
          Providers
        </button>
        <button
          onClick={() => scrollToSection('everything-you-need')}
          className={styles.navLink}
        >
          Tools & Features
        </button>
        <button
          onClick={() => scrollToSection('our-mission')}
          className={styles.navLink}
        >
          Our Mission
        </button>
        <button
          onClick={() => scrollToSection('pricing')}
          className={styles.navLink}
        >
          Pricing
        </button>
        <button
          onClick={() => scrollToSection('about')}
          className={styles.navLink}
        >
          About
        </button>
      </nav>

      <div className={styles.rightSection}>
        <Link href="/search" className={styles.clientLink}>
          Find a Provider
        </Link>
        <Link href="/spaces" className={styles.clientLink}>
          For Spaces
        </Link>
        <Link href="/providers/login" className={styles.loginLink}>
          Log In
        </Link>
        <Link href="/providers/signup" className={styles.signupButton}>
          Join
        </Link>
      </div>
    </header>
  );
}
