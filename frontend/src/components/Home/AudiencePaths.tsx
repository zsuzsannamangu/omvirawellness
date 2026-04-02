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
    image: '/images/Jenn-45.jpg',
    imageAlt: 'Bright, inviting setting where you can discover wellness services',
    variant: 'primary' as const,
  },
  {
    key: 'provider',
    title: 'Become a provider',
    description:
      'Start earning with tools, visibility and clients without the overwhelm.',
    cta: 'Get started',
    href: '/join',
    image: '/images/screenshots/audience-provider.png',
    imageAlt: 'Beauty professional with tools of the trade, ready to grow their practice',
    variant: 'primary' as const,
  },
  {
    key: 'space',
    title: 'List your space',
    description:
      'Turn your space into a destination for wellness professionals and experiences.',
    cta: 'Coming soon',
    href: null,
    image: '/images/Jenn-14.png',
    imageAlt:
      'Provider with equipment arriving at a bright, welcoming home as a host greets them',
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
                  className={
                    item.variant === 'soon'
                      ? `${styles.mediaImg} ${styles.mediaImgMuted}`
                      : item.key === 'provider'
                        ? `${styles.mediaImg} ${styles.mediaImgProvider}`
                        : styles.mediaImg
                  }
                  sizes="(max-width: 899px) 100vw, 33vw"
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
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
