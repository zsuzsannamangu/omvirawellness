'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaUserFriends, FaHome } from 'react-icons/fa';
import styles from '../styles/Navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.brandSection}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/Omvira_logo_long.png"
            alt="Omvira Wellness"
            width={300}
            height={75}
            className={styles.logoImage}
            priority
          />
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

      <div className={styles.rightWrap}>
        <div className={styles.authGroup}>
          <Link href="/login" className={styles.loginLink}>
            Log In
          </Link>
          <Link href="/signup" className={styles.signupButton}>
            Sign Up
          </Link>
        </div>

        <div className={styles.secondaryLinks}>
          <Link href="/providers" className={styles.providerLink}>
            <FaUserFriends className={styles.linkIcon} />
            For Providers
          </Link>
          {pathname?.startsWith('/spaces') ? (
            <Link href="/providers" className={styles.spacesLink}>
              <FaUserFriends className={styles.linkIcon} />
              Find a Provider
            </Link>
          ) : (
            <Link href="/spaces" className={styles.spacesLink}>
              <FaHome className={styles.linkIcon} />
              For Spaces
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
