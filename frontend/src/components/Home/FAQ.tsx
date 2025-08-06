import React from 'react';
import styles from '@/styles/Home/FAQ.module.scss';

const FAQ: React.FC = () => {
  return (
    <section className={styles.faqSection}>
      <h2>FAQs</h2>

      <div className={styles.faqItem}>
        <h3>What kind of services can I offer through Omvira?</h3>
        <p>
          Omvira is designed for licensed, certified, or highly experienced wellness professionals—yoga teachers,
          massage therapists, estheticians, personal trainers, acupuncturists, doulas, and more. If your work supports
          holistic well-being, there’s space for you here.
        </p>
      </div>

      <div className={styles.faqItem}>
        <h3>How is Omvira different from other gig platforms?</h3>
        <p>
          Unlike platforms that extract value, Omvira supports it. We provide essential tools to manage your business—
          booking, payments, scheduling, CRM, and more—under one roof, with fair commissions and transparent pricing.
        </p>
      </div>

      <div className={styles.faqItem}>
        <h3>Do I need a website or booking system to use Omvira?</h3>
        <p>
          Not at all. Omvira replaces the need for multiple tools. Your profile acts as a booking page,
          and your dashboard includes everything from financial insights to client communication.
        </p>
      </div>

      <div className={styles.faqItem}>
        <h3>How much does it cost to join as a provider?</h3>
        <p>
          Subscriptions start at $49/month with no hidden fees. Omvira replaces your QuickBooks, Wix, CapCut,
          and Acuity subscriptions. You’ll gain access to our full platform, financial literacy resources,
          marketing tools, and booking system. <br /><br />
          So instead of piecing together 7+ platforms, Omvira gives mindful professionals one place to book,
          grow and thrive — all while staying connected to the purpose behind the practice.
        </p>
      </div>

      <div className={styles.faqItem}>
        <h3>How much does it cost to use Omvira as a client?</h3>
        <p>
          There’s no membership fee to explore wellness on Omvira. You only pay for the services you book —
          and rates are set by each individual provider based on their experience, offerings, and availability.
          We believe in transparency, so you’ll always see pricing upfront before confirming any appointment. <br /><br />
          Some services may include a small concierge fee for bundled or special event experiences.
          This will be clearly noted before checkout. <br />
          <strong>Your care, your way — no surprise charges, ever.</strong>
        </p>
      </div>
    </section>
  );
};

export default FAQ;
