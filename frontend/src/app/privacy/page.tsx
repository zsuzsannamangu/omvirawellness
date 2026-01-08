'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#6C4F70', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
        
        <h1 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
          Privacy Policy
        </h1>
        
        <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

        <div style={{ fontFamily: 'Avenir, sans-serif', lineHeight: '1.8', color: '#333' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              1. Information We Collect
            </h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li>Name, email address, and contact information</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Location data for service matching</li>
              <li>Booking history and preferences</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              3. Information Sharing
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li>With service providers who assist us in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>With your consent</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              4. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              5. Your Rights
            </h2>
            <p>
              You have the right to access, update, or delete your personal information at any time through your account settings.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              6. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
