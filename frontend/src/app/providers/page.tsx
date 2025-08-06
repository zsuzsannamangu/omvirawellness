'use client';

import React from 'react';
import styles from '@/styles/Providers/Providers.module.scss';
import Link from 'next/link';
import ProviderNavbar from '@/components/ProviderNavbar';
import Footer from '@/components/Footer';

const ProvidersPage: React.FC = () => {
    return (
        <>
            <main className={styles.main}>

                <ProviderNavbar />
                {/* HERO */}
                <section className={styles.hero}>
                    <h1>Wellness work, reimagined.</h1>
                    <p>
                        Omvira empowers independent wellness professionals to grow thriving, flexible businesses — with less burnout and more support.
                    </p>
                    <Link href="/pre-sale" className={styles.ctaButton}>
                        Join the Waitlist
                    </Link>
                </section>

                {/* BENEFITS */}
                <section className={styles.benefits}>
                    <h2>What you get as a provider</h2>
                    <ul>
                        <li><strong>Bookings, payments & calendar</strong> — all in one place</li>
                        <li><strong>Client-facing profile</strong> — with video, reviews, and real-time availability</li>
                        <li><strong>Marketing support</strong> — social assets, onboarding help, and more</li>
                        <li><strong>Keep your voice & flexibility</strong> — you’re in control</li>
                    </ul>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <h2>Ready to grow your practice on your own terms?</h2>
                    <Link href="/pre-sale" className={styles.ctaButton}>
                        Become a Provider
                    </Link>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ProvidersPage;
