import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home/ProviderFinalCta.module.scss';

const ProviderFinalCta: React.FC = () => {
  return (
    <section
      className={styles.section}
      aria-labelledby="provider-final-cta-heading"
    >
      <div className={styles.inner}>
        <h2 id="provider-final-cta-heading" className={styles.heading}>
          Built for independent providers.
        </h2>
        <p className={styles.copy}>
          Omvira gives wellness pros the tools to run their business with clarity and confidence
          without relying on outdated systems or constant self-promotion.
        </p>
        <Link href="/join" className={styles.cta}>
          Become a provider
        </Link>
      </div>
    </section>
  );
};

export default ProviderFinalCta;
