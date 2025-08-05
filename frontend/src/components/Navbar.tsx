"use client";

import Link from "next/link";
import styles from "../styles/Navbar.module.scss";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>Omvira Wellness</div>
      <nav className={styles.navLinks}>
        <Link href="/" className={styles.link}>
          Home
        </Link>
        <Link href="/clients" className={styles.link}>
          For Clients
        </Link>
        <Link href="/providers" className={styles.link}>
          For Providers
        </Link>
        <Link href="/pre-sale" className={styles.link}>
          Pre-Sale
        </Link>
      </nav>
    </header>
  );
}
