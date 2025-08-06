// import Navbar from "@/components/Navbar";
// import styles from "../styles/Home.module.scss";
// import Footer from "@/components/Footer";
// import Image from 'next/image';
// import Link from 'next/link';

// export default function Home() {
//   return (
//     <>
//       <Navbar />
//       <main className={styles.main}>
//         {/* HERO SECTION */}
//         <section className={styles.heroSection}>
//           <h1 className={styles.heading}>
//             Personalized wellness. <br className="hidden md:block" />
//             Delivered with care.
//           </h1>
//           <p className={styles.subtext}>
//             Omvira connects you with trusted yoga therapists, massage therapists, and other wellness professionals — for in-home, virtual, or in-studio care.
//           </p>
//           <a href="#providers" className={styles.ctaButton}>
//             Find a Provider
//           </a>
//         </section>

//         {/* ABOUT SECTION */}
//         <section id="about" className={styles.aboutSection}>
//           <div className={styles.columns}>
//             {/* Left Column */}
//             <div className={styles.columnLeft}>
//               <h2>About Omvira</h2>
//               <p>
//                 Omvira is the platform that brings wellness to you — wherever you are.
//                 <br /><br />
//                 We connect clients to trusted, mobile wellness professionals for in-home or on-location experiences that range from massage and facials to yoga, personal training, and energy work. At the same time, we give independent providers the tools they need to build thriving, flexible, client-first businesses.
//               </p>

//               <h3>🌿 For Clients:</h3>
//               <ul>
//                 <li><strong>Book on-demand or in advance</strong> for wellness services near you</li>
//                 <li><strong>Browse verified providers</strong> with real-time availability and transparent pricing</li>
//                 <li><strong>Curate your own experience</strong> — solo or with friends, for daily care or special events</li>
//                 <li><strong>Wellness that travels</strong> — to your home, retreat, hotel, or workplace</li>
//               </ul>
//             </div>

//             {/* Right Column */}
//             <div className={styles.columnRight}>
//               <h3>🌿 For Providers:</h3>
//               <ul>
//                 <li><strong>Business tools built for you</strong> – bookings, payments, CRM, and marketing</li>
//                 <li><strong>Bio sites with personality</strong> – photos, video, reviews, and real-time bookings</li>
//                 <li><strong>Autonomy without the headache</strong> – we handle the tech so you can do your work</li>
//                 <li><strong>Client connection + credibility</strong> – expand your reach, keep your voice</li>
//               </ul>

//               <h3>Our Mission:</h3>
//               <p>
//                 To make wellness accessible, personal, and mobile — while empowering the practitioners who offer it to lead confident, prosperous, and purposeful careers.
//               </p>
//             </div>
//           </div>
//         </section>
//         <section className={styles.faqSection}>
//           <h2>FAQs</h2>

//           <div className={styles.faqItem}>
//             <h3>What kind of services can I offer through Omvira?</h3>
//             <p>
//               Omvira is designed for licensed, certified, or highly experienced wellness professionals—yoga teachers,
//               massage therapists, estheticians, personal trainers, acupuncturists, doulas, and more. If your work supports
//               holistic well-being, there’s space for you here.
//             </p>
//           </div>

//           <div className={styles.faqItem}>
//             <h3>How is Omvira different from other gig platforms?</h3>
//             <p>
//               Unlike platforms that extract value, Omvira supports it. We provide essential tools to manage your business—
//               booking, payments, scheduling, CRM, and more—under one roof, with fair commissions and transparent pricing.
//             </p>
//           </div>

//           <div className={styles.faqItem}>
//             <h3>Do I need a website or booking system to use Omvira?</h3>
//             <p>
//               Not at all. Omvira replaces the need for multiple tools. Your profile acts as a booking page,
//               and your dashboard includes everything from financial insights to client communication.
//             </p>
//           </div>

//           <div className={styles.faqItem}>
//             <h3>How much does it cost to join as a provider?</h3>
//             <p>
//               Subscriptions start at $49/month with no hidden fees. Omvira replaces your quickbooks, Wix, Capcut,
//               and Acuity subscriptions. You’ll gain access to our full platform, financial literacy resources,
//               marketing tools, and booking system.
//               So instead of piecing together 7+ platforms, Omvira gives mindful professionals one place to book,
//               grow and thrive—all while staying connected to the purpose behind the practice.
//             </p>
//           </div>

//           <div className={styles.faqItem}>
//             <h3>How much does it cost to use Omvira as a client?</h3>
//             <p>
//               There’s no membership fee to explore wellness on Omvira. You only pay for the services you book —
//               and rates are set by each individual provider based on their experience, offerings, and availability.
//               We believe in transparency, so you’ll always see pricing upfront before confirming any appointment.
//               Some services may include a small concierge fee for bundled or special event experiences.
//               This will be clearly noted before checkout.
//               <br />
//               <strong>Your care, your way — no surprise charges, ever.</strong>
//             </p>
//           </div>
//         </section>

//       </main>
//       <Footer />
//     </>
//   );
// }

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Refactored homepage sections
import Hero from '@/components/Home/Hero';
// (Future additions)
import About from '@/components/Home/About';
import FAQ from '@/components/Home/FAQ';
import RecommendedProviders from '@/components/Home/RecommendedProviders';
import HowItWorks from '@/components/Home/HowItWorks';
import Testimonials from '@/components/Home/Testimonials';

import ServiceCategories from '@/components/Home/ServiceCategories';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ServiceCategories />
        <RecommendedProviders />
        <Testimonials />
        <About />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Home;
