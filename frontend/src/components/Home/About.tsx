import React from 'react';
import styles from '@/styles/Home/About.module.scss';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.columns}>
        {/* Left Column */}
        <div className={styles.columnLeft}>
          <h2>About Omvira</h2>
          <p>
            Omvira is the platform that brings wellness to you — wherever you are.
            <br /><br />
            We connect clients to trusted, mobile wellness professionals for in-home or on-location experiences that range from massage and facials to yoga, personal training, and energy work. At the same time, we give independent providers the tools they need to build thriving, flexible, client-first businesses.
          </p>

          <h3>🌿 For Clients:</h3>
          <ul>
            <li><strong>Book on-demand or in advance</strong> for wellness services near you</li>
            <li><strong>Browse verified providers</strong> with real-time availability and transparent pricing</li>
            <li><strong>Curate your own experience</strong> — solo or with friends, for daily care or special events</li>
            <li><strong>Wellness that travels</strong> to your home, retreat, hotel, or workplace</li>
          </ul>
        </div>

        {/* Right Column */}
        <div className={styles.columnRight}>
          <h3>🌿 For Providers:</h3>
          <ul>
            <li><strong>Business tools built for you</strong> – bookings, payments, CRM, and marketing</li>
            <li><strong>Bio sites with personality</strong> – photos, video, reviews, and real-time bookings</li>
            <li><strong>Autonomy without the headache</strong> – we handle the tech so you can do your work</li>
            <li><strong>Client connection + credibility</strong> – expand your reach, keep your voice</li>
          </ul>

          <h3>Our Mission:</h3>
          <p>
            To make wellness accessible, personal, and mobile — while empowering the practitioners who offer it to lead confident, prosperous, and purposeful careers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
