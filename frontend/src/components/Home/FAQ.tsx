'use client';

import React, { useState } from 'react';
import styles from '@/styles/Home/FAQ.module.scss';
import { FaPlus } from 'react-icons/fa';

const faqData = [
  {
    question: "What kind of services can I offer through Omvira?",
    answer: "Omvira is designed for licensed, certified, or highly experienced wellness professionals—yoga teachers, massage therapists, estheticians, personal trainers, acupuncturists, doulas, and more. If your work supports holistic well-being, there's space for you here."
  },
  {
    question: "How is Omvira different from other gig platforms?",
    answer: "Unlike platforms that extract value, Omvira supports it. We provide essential tools to manage your business—booking, payments, scheduling, CRM, and more—under one roof, with fair commissions and transparent pricing."
  },
  {
    question: "Do I need a website or booking system to use Omvira?",
    answer: "Not at all. Omvira replaces the need for multiple tools. Your profile acts as a booking page, and your dashboard includes everything from financial insights to client communication."
  },
  {
    question: "How much does it cost to join as a provider?",
    answer: "Subscriptions start at $49/month with no hidden fees. Omvira replaces your QuickBooks, Wix, CapCut, and Acuity subscriptions. You'll gain access to our full platform, financial literacy resources, marketing tools, and booking system. So instead of piecing together 7+ platforms, Omvira gives mindful professionals one place to book, grow and thrive — all while staying connected to the purpose behind the practice."
  },
  {
    question: "How much does it cost to use Omvira as a client?",
    answer: "There's no membership fee to explore wellness on Omvira. You only pay for the services you book and rates are set by each individual provider based on their experience, offerings, and availability. We believe in transparency, so you'll always see pricing upfront before confirming any appointment. Some services may include a small concierge fee for bundled or special event experiences. This will be clearly noted before checkout. Your care, your way no surprise charges, ever."
  },
  {
    question: "Can I book services for a group or special event?",
    answer: "Absolutely! Many of our providers offer group sessions and special event services. You can coordinate with providers directly through the platform to arrange group bookings, retreats, workshops, or special celebrations."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        
        <div className={styles.faqGrid}>
          {faqData.map((faq, index) => (
            <div key={index} className={styles.faqCard}>
              <button 
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <FaPlus 
                  className={`${styles.icon} ${openIndex === index ? styles.rotated : ''}`} 
                />
              </button>
              
              {openIndex === index && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
