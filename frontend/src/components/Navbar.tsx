'use client';

import Link from 'next/link';
import styles from '../styles/Navbar.module.scss';

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          Omvira Wellness
        </Link>
      </div>
      
      <nav className={styles.mainNav}>
        <button 
          onClick={() => scrollToSection('services')} 
          className={styles.navLink}
        >
          Services
        </button>
        <button 
          onClick={() => scrollToSection('how-it-works')} 
          className={styles.navLink}
        >
          How It Works
        </button>
        <button 
          onClick={() => scrollToSection('faq')} 
          className={styles.navLink}
        >
          FAQ
        </button>
      </nav>
      
      <div className={styles.rightSection}>
        <Link href="/providers" className={styles.providerLink}>
          For Providers
        </Link>
        <Link href="/login" className={styles.loginLink}>
          Log In
        </Link>
        <Link href="/signup" className={styles.signupButton}>
          Sign Up
        </Link>
      </div>
    </header>
  );
}
