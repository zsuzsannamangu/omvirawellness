'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/Login.module.scss';

export default function TermsPage() {
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
          Terms & Conditions
        </h1>
        
        <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

        <div style={{ fontFamily: 'Avenir, sans-serif', lineHeight: '1.8', color: '#333' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Omvira Wellness, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              2. Use License
            </h2>
            <p>
              Permission is granted to temporarily use Omvira Wellness for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on Omvira Wellness</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              3. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              4. Booking and Cancellation Policy
            </h2>
            <p>
              Appointments may be cancelled or rescheduled up to 24 hours in advance. Cancellations made less than 24 hours before the appointment may be subject to fees as determined by the service provider.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              5. Limitation of Liability
            </h2>
            <p>
              Omvira Wellness shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Forum, serif', color: '#294055', marginBottom: '1rem' }}>
              6. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
