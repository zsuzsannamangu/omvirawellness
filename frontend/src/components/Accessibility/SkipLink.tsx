'use client';

import React from 'react';
import styles from './SkipLink.module.scss';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a href={href} className={styles.skipLink}>
      {children}
    </a>
  );
}



