'use client';

import React, { useRef, useState } from 'react';
import SpaceNavbar from '@/components/Spaces/SpaceNavbar';
import Footer from '@/components/Footer';
import styles from '@/styles/Spaces/SpacesLanding.module.scss';
import Image from 'next/image';

const SpacesPage: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = 320 + 24; // card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleViewAllSpaces = () => {
    // For now, just scroll to the pricing section
    // Later this could navigate to a full spaces listing page
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
      <SpaceNavbar />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <div className={styles.heroTitle}>
                <h2>Rent</h2>
                <h1>Your</h1>
                <h2>Space</h2>
              </div>
              <div className={styles.heroText}>
                <h3>Turn Your Space Into a Revenue Stream</h3>
                <p>Connect with qualified wellness providers who need space to serve their clients. Your massage room, yoga studio, or therapy space can generate income when you're not using it.</p>
                <p className={styles.heroFooterText}>
                  Set your own pricing and availability. No monthly fees, only pay when you book. Start earning from your space with our simple listing process.
                </p>
                <div className={styles.heroButtons}>
                  <a href="/spaces/signup" className={styles.primaryButton}>
                    List Your Space
                  </a>
                  <a href="/spaces/login" className={styles.secondaryButton}>
                    Space Owner Login
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="/images/screenshots/home2.png"
                alt="Massage oils with massage in background"
                width={500}
                height={800}
                className={styles.heroImg}
                priority
              />
            </div>
          </div>
        </section>

        {/* Featured Spaces Carousel */}
        <section id="featured-spaces" className={styles.featuredSpaces}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <h2>OMVIRA SPACES</h2>
                <h3>Featured Space Types</h3>
              </div>
              <div className={styles.headerRight}>
                <button className={styles.viewAllBtn} onClick={handleViewAllSpaces}>View pricing</button>
                <div className={styles.carouselNav}>
                  <button className={styles.navBtn} onClick={() => scrollCarousel('left')}>←</button>
                  <button className={styles.navBtn} onClick={() => scrollCarousel('right')}>→</button>
                </div>
              </div>
            </div>
            <div className={styles.spacesCarousel} ref={carouselRef}>
              <div className={styles.spaceCard}>
                <div className={styles.spaceInfo}>
                  <div className={styles.categoryRow}>
                    <Image
                      src="/images/icons/massage.png"
                      alt="Massage"
                      width={40}
                      height={40}
                      className={styles.icon}
                    />
                    <span className={styles.spaceCategory}>MASSAGE ROOMS</span>
                  </div>
                  <h4>Private, quiet spaces perfect for therapeutic bodywork</h4>
                  <div className={styles.cardDivider}></div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <div className={styles.spaceInfo}>
                  <div className={styles.categoryRow}>
                    <Image
                      src="/images/icons/yoga.png"
                      alt="Yoga"
                      width={40}
                      height={40}
                      className={styles.icon}
                    />
                    <span className={styles.spaceCategory}>YOGA STUDIOS</span>
                  </div>
                  <h4>Open areas with good lighting for yoga classes</h4>
                  <div className={styles.cardDivider}></div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <div className={styles.spaceInfo}>
                  <div className={styles.categoryRow}>
                    <Image
                      src="/images/icons/medicine.png"
                      alt="Therapy"
                      width={40}
                      height={40}
                      className={styles.icon}
                    />
                    <span className={styles.spaceCategory}>THERAPY OFFICES</span>
                  </div>
                  <h4>Professional spaces for counseling and mental health</h4>
                  <div className={styles.cardDivider}></div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <div className={styles.spaceInfo}>
                  <div className={styles.categoryRow}>
                    <Image
                      src="/images/icons/yogatherapy.png"
                      alt="Meditation"
                      width={40}
                      height={40}
                      className={styles.icon}
                    />
                    <span className={styles.spaceCategory}>MEDITATION SPACES</span>
                  </div>
                  <h4>Peaceful rooms for mindfulness and spiritual practices</h4>
                  <div className={styles.cardDivider}></div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <div className={styles.spaceInfo}>
                  <div className={styles.categoryRow}>
                    <Image
                      src="/images/icons/training.png"
                      alt="Fitness"
                      width={40}
                      height={40}
                      className={styles.icon}
                    />
                    <span className={styles.spaceCategory}>FITNESS ROOMS</span>
                  </div>
                  <h4>Spaces equipped for personal training and Pilates</h4>
                  <div className={styles.cardDivider}></div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <div className={styles.spaceInfo}>
                  <div className={styles.categoryRow}>
                    <Image
                      src="/images/icons/power.png"
                      alt="Wellness"
                      width={40}
                      height={40}
                      className={styles.icon}
                    />
                    <span className={styles.spaceCategory}>WELLNESS SUITES</span>
                  </div>
                  <h4>Multi-purpose spaces for various wellness services</h4>
                  <div className={styles.cardDivider}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.container}>
            <h2>How Hosting Works</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3>List your space for free</h3>
                <p>Set your price, add photos and details, then your listing is ready to be seen by millions of people searching for space.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3>Welcome guests to your space</h3>
                <p>Message with guests and accept bookings through the Omvira platform. Once you confirm, your guests will receive information on how to get there and details like your wifi code.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3>Get paid every time</h3>
                <p>Guests are charged upfront through Omvira's secure payment system. Your payout is directly deposited after each booking, minus our service fee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className={styles.benefits}>
          <div className={styles.container}>
            <h2>Why List Your Space on Omvira?</h2>
            <div className={styles.benefitsContent}>
              <div className={styles.benefitsText}>
                <div className={styles.benefitsList}>
                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>✓</div>
                    <div>
                      <h3>Earn Extra Income</h3>
                      <p>Generate revenue from your unused space. Set your own rates and availability to maximize your earning potential.</p>
                    </div>
                  </div>
                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>✓</div>
                    <div>
                      <h3>Vetted Wellness Providers</h3>
                      <p>All providers are background-checked and licensed professionals in their field. Your space is used by qualified wellness practitioners.</p>
                    </div>
                  </div>
                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>✓</div>
                    <div>
                      <h3>Easy Management</h3>
                      <p>Manage bookings, payments, and availability through our simple platform.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.benefitsImage}>
                <Image
                  src="/images/screenshots/yogapose6.png"
                  alt="Arm chair, blanket and plant"
                  width={500}
                  height={600}
                  className={styles.benefitImg}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className={styles.pricing}>
          <div className={styles.container}>
            <h2>Simple, Transparent Pricing</h2>
            <p className={styles.pricingDescription}>Our simple pricing structure means you keep more of what you earn while we handle the rest.</p>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>5%</div>
                <div className={styles.statLabel}>Per Booking</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>95%</div>
                <div className={styles.statLabel}>You Keep</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>$0</div>
                <div className={styles.statLabel}>Monthly Fees</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Support</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statText}>Start earning today</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>Ready to start earning from your space?</h2>
            <a href="/spaces/signup" className={styles.ctaButton}>
              List Your Space
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SpacesPage;
