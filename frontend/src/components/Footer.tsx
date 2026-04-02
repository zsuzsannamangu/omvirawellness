// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import styles from '../styles/Footer.module.scss';

type FooterLinkItem =
  | { label: string; href: string }
  | { label: string; future: true };

const footerColumns: { title: string; links: FooterLinkItem[] }[] = [
  {
    title: 'Omvira',
    links: [
      { label: 'Get to know us', href: '/#wellness-not-one-size' },
      { label: 'How it works', href: '/#how-it-works' },
      {
        label: 'Careers',
        href: 'mailto:hello@omvirawellness.com?subject=Careers%20inquiry',
      },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Popular Services', href: '/#services' },
      { label: 'Experiences', href: '/classes' },
      { label: 'Locations', future: true },
    ],
  },
  {
    title: 'Support',
    links: [{ label: 'FAQ', href: '/#faq' }],
  },
];

function FooterLinkRow({ item }: { item: FooterLinkItem }) {
  if ('future' in item && item.future) {
    return (
      <li className={styles.linkItem}>
        <span className={styles.futureLink}>
          {item.label}{' '}
          <span className={styles.futureHint}>(future)</span>
        </span>
      </li>
    );
  }

  const { label, href } = item;
  const isMailto = href.startsWith('mailto:');

  if (isMailto) {
    return (
      <li className={styles.linkItem}>
        <a href={href} className={styles.link}>
          {label}
        </a>
      </li>
    );
  }

  return (
    <li className={styles.linkItem}>
      <Link href={href} className={styles.link}>
        {label}
      </Link>
    </li>
  );
}

type FooterProps = {
  className?: string;
};

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={[styles.footer, className].filter(Boolean).join(' ')}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brandPanel}>
            <div className={styles.brandTop}>
              <Link href="/" className={styles.logoLink}>
                <Image
                  src="/Omvira_logo_white.png"
                  alt="Omvira Wellness — home"
                  width={300}
                  height={75}
                  className={styles.logo}
                />
              </Link>
              <div className={styles.brandAside}>
                <p className={styles.tagline}>Wellness, delivered.</p>
                <div className={styles.socialWrap}>
                  <span className={styles.socialLabel}>Follow</span>
                  <div className={styles.socialIcons}>
                    <a
                      href="https://www.instagram.com/omvirawellness"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialIcon}
                      aria-label="Omvira on Instagram"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61577726068469"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialIcon}
                      aria-label="Omvira on Facebook"
                    >
                      <FaFacebook />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav className={styles.linkGrid} aria-label="Footer">
            {footerColumns.map((col) => (
              <div key={col.title} className={styles.column}>
                <h2 className={styles.columnTitle}>{col.title}</h2>
                <ul className={styles.linkList}>
                  {col.links.map((item) => (
                    <FooterLinkRow
                      key={'future' in item && item.future ? `${item.label}-future` : item.label}
                      item={item}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>© 2026 Omvira Wellness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
