'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaLocationArrow, FaSearch } from 'react-icons/fa';
import styles from '@/styles/Home/Hero.module.scss';

const HERO_BG = '/images/screenshots/massage1.png';

const Hero: React.FC = () => {
  const router = useRouter();
  const [area, setArea] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const goToSearch = useCallback(
    (nextArea: string, nextQ: string) => {
      const a = nextArea.trim();
      const q = nextQ.trim();
      if (!a && !q) {
        return;
      }
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (a) params.set('area', a);

      const qs = params.toString();
      router.push(qs ? `/search?${qs}` : '/search');
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeoError(null);
    if (!area.trim() && !serviceQuery.trim()) {
      setFormError('Enter an area or a service to search.');
      return;
    }
    setFormError(null);
    goToSearch(area, serviceQuery);
  };

  const locateMe = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Location is not supported in this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          if (!res.ok) throw new Error('Geocode failed');
          const data = await res.json();
          const city = data.city || data.locality || data.principalSubdivision || '';
          const region = data.principalSubdivision || '';
          const line = [city, region].filter(Boolean).join(', ');
          if (line) {
            setArea(line);
          } else {
            setGeoError('Could not resolve a city name from your location.');
          }
        } catch {
          setGeoError('Could not look up your city. Enter it manually.');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setGeoError('Location access was denied or unavailable.');
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 600_000 }
    );
  };

  return (
    <section className={styles.doorDashHero} aria-label="Omvira — find a wellness provider">
      <div className={styles.bgWrap}>
        <Image
          src={HERO_BG}
          alt="Relaxing wellness massage in a calm, curated setting"
          fill
          priority
          className={styles.bgImage}
          sizes="100vw"
        />
        <div className={styles.bgOverlay} aria-hidden />
      </div>

      <div className={styles.heroInner}>
        <div className={styles.homeDoorDashHeroHeadlineOuter}>
          <div className={styles.homeDoorDashHeroHeadlineStack}>
            <h1 className={styles.homeDoorDashHeroWordmark}>Omvira</h1>
            <p className={styles.homeDoorDashHeroTaglineRow}>
              <span className={styles.homeDoorDashHeroTaglineText}>
                Wellness, delivered to you
              </span>
            </p>
          </div>
        </div>
        <p className={styles.homeHeroLeadSupportLine}>
          Book trusted professionals for massage, yoga, skincare and more.
        </p>

        <div className={styles.searchCard}>
          <form onSubmit={handleSubmit} className={styles.cardForm} noValidate>
            <div className={styles.cardField}>
              <FaMapMarkerAlt className={styles.cardFieldIcon} aria-hidden />
              <label htmlFor="hero-area-input" className="visually-hidden">
                City, region, or ZIP
              </label>
              <input
                id="hero-area-input"
                type="text"
                autoComplete="address-level2"
                placeholder="City, region, or ZIP"
                className={styles.cardInput}
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setFormError(null);
                }}
              />
              <button
                type="button"
                className={styles.locateBtn}
                onClick={locateMe}
                disabled={locating}
                aria-label="Use current location"
              >
                <FaLocationArrow aria-hidden />
              </button>
            </div>

            <div className={styles.cardField}>
              <FaSearch className={styles.cardFieldIcon} aria-hidden />
              <label htmlFor="hero-service-input" className="visually-hidden">
                Service or provider
              </label>
              <input
                id="hero-service-input"
                type="text"
                placeholder="Service or provider"
                className={styles.cardInput}
                autoComplete="off"
                value={serviceQuery}
                onChange={(e) => {
                  setServiceQuery(e.target.value);
                  setFormError(null);
                }}
              />
            </div>

            {(geoError || formError) && (
              <p className={styles.fieldError} role="status">
                {formError || geoError}
              </p>
            )}

            <button type="submit" className={styles.primaryCta}>
              Find providers
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
