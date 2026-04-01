import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home/AudiencePaths.module.scss';

const paths = [
  {
    key: 'find',
    title: 'Find a service',
    description:
      'Browse and book trusted providers for in-home or on-location wellness.',
    cta: 'Search providers',
    href: '/search',
    image: '/images/screenshots/arrival.png',
    imageAlt: 'Guest arriving for a wellness appointment',
    variant: 'primary' as const,
  },
  {
    key: 'provider',
    title: 'Become a provider',
    description:
      'Start earning with tools, visibility and clients without the overwhelm.',
    cta: 'Get started',
    href: '/join',
    image: '/images/screenshots/growyourpractice2.png',
    imageAlt: 'Wellness provider growing their practice',
    variant: 'primary' as const,
  },
  {
    key: 'space',
    title: 'List your space',
    description:
      'Turn your space into a destination for wellness professionals and experiences.',
    cta: 'Coming soon',
    href: null,
    image: '/images/screenshots/wework2.png',
    imageAlt: 'Bright shared workspace suitable for wellness sessions',
    variant: 'soon' as const,
  },
];

const AudiencePaths: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="audience-paths-heading">
      <div className={styles.container}>
        <h2 id="audience-paths-heading" className={styles.visuallyHidden}>
          Ways to use Omvira
        </h2>
        <div className={styles.grid}>
          {paths.map((item) => (
            <article key={item.key} className={styles.card}>
              <div className={styles.media}>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className={item.variant === 'soon' ? `${styles.mediaImg} ${styles.mediaImgMuted}` : styles.mediaImg}
                  sizes="(max-width: 899px) 100vw, 33vw"
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                {item.variant === 'soon' && (
                  <span className={styles.badge}>Coming soon</span>
                )}
                <p className={styles.cardCopy}>{item.description}</p>
                {item.href ? (
                  <Link href={item.href} className={styles.cta}>
                    {item.cta}
                  </Link>
                ) : (
                  <span className={styles.ctaDisabled} aria-disabled="true">
                    {item.cta}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudiencePaths;
