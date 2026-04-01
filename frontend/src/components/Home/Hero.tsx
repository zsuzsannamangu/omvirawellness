'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaHistory,
  FaRegClock,
  FaRegCalendarAlt,
} from 'react-icons/fa';
import styles from '@/styles/Home/Hero.module.scss';

const STORAGE_AREA = 'omvira_search_area';
const STORAGE_RECENT = 'omvira_recent_searches';

type RecentEntry = { area: string; q: string; label: string };

const todayISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const POPULAR_SUGGESTIONS: { q: string; subtitle: string }[] = [
  { q: 'Massage Therapy', subtitle: 'Therapeutic bodywork & relaxation' },
  { q: 'Private Yoga', subtitle: 'One-on-one yoga sessions' },
  { q: 'Meditation', subtitle: 'Mindfulness & stress reduction' },
  { q: 'Skincare / Esthetics', subtitle: 'Facials & professional skincare' },
];

const Hero: React.FC = () => {
  const router = useRouter();
  const [area, setArea] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');
  const [date, setDate] = useState(todayISO);
  const [timeMode, setTimeMode] = useState<'now' | 'custom'>('now');
  const [customTime, setCustomTime] = useState('');
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AREA);
      if (saved) setArea(saved);
      const raw = localStorage.getItem(STORAGE_RECENT);
      if (raw) {
        const parsed = JSON.parse(raw) as RecentEntry[];
        if (Array.isArray(parsed)) setRecent(parsed.slice(0, 5));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const cityLabel = useMemo(() => {
    const t = area.trim();
    if (!t) return 'Set your area';
    return t.length > 42 ? `${t.slice(0, 40)}…` : t;
  }, [area]);

  const persistRecent = useCallback((entry: RecentEntry) => {
    setRecent((prev) => {
      const next = [
        entry,
        ...prev.filter((e) => !(e.q === entry.q && e.area === entry.area)),
      ].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_RECENT, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const goToSearch = useCallback(
    (nextArea: string, nextQ: string, opts?: { skipRecent?: boolean }) => {
      const a = nextArea.trim();
      const q = nextQ.trim();
      if (!a && !q) {
        return;
      }
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (a) params.set('area', a);
      if (date) params.set('date', date);
      if (timeMode === 'custom' && customTime) params.set('time', customTime);

      if (a) {
        try {
          localStorage.setItem(STORAGE_AREA, a);
        } catch {
          /* ignore */
        }
      }

      if (!opts?.skipRecent && (a || q)) {
        const label = q ? (a ? `${q} — ${a}` : q) : a;
        persistRecent({ area: a, q, label: label || '' });
      }

      const qs = params.toString();
      router.push(qs ? `/search?${qs}` : '/search');
    },
    [date, timeMode, customTime, persistRecent, router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeoError(null);
    if (!area.trim() && !serviceQuery.trim()) {
      setFormError('Enter an area or a service (or pick a suggestion below).');
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
            try {
              localStorage.setItem(STORAGE_AREA, line);
            } catch {
              /* ignore */
            }
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

  const focusCity = () => {
    const el = document.getElementById('hero-area-input');
    el?.focus();
  };

  const suggestionsToShow = useMemo(() => {
    if (recent.length > 0) {
      return recent.map((r) => ({
        key: `r-${r.label}`,
        primary: r.label,
        secondary: r.area && r.q ? `${r.q} · ${r.area}` : r.area || r.q,
        onSelect: () => {
          setArea(r.area);
          setServiceQuery(r.q);
          goToSearch(r.area, r.q, { skipRecent: true });
        },
      }));
    }
    return POPULAR_SUGGESTIONS.map((p) => ({
      key: `p-${p.q}`,
      primary: p.q,
      secondary: p.subtitle,
      onSelect: () => {
        setServiceQuery(p.q);
        goToSearch(area, p.q);
      },
    }));
  }, [recent, area, goToSearch]);

  return (
    <section className={styles.bookingHero} aria-label="Find a wellness provider">
      <div className={styles.split}>
        <div className={styles.splitLeft}>
        <div className={styles.cityRow}>
          <FaMapMarkerAlt className={styles.cityPin} aria-hidden />
          <span className={styles.cityText}>{cityLabel}</span>
          <button type="button" className={styles.changeCity} onClick={focusCity}>
            Change area
          </button>
        </div>

        <h1 className={styles.headline}>Find a provider</h1>
        <p className={styles.lede}>
          Enter where you are and what you need—we’ll show professionals who match.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.routeBlock}>
            <div className={styles.routeConnector} aria-hidden />
            <div className={styles.fieldRow}>
              <span className={styles.fieldIconCircle} aria-hidden />
              <label htmlFor="hero-area-input" className="visually-hidden">
                City, region, or ZIP
              </label>
              <input
                id="hero-area-input"
                type="text"
                autoComplete="address-level2"
                placeholder="City, region, or ZIP"
                className={styles.fieldInput}
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
            <div className={styles.fieldRow}>
              <span className={styles.fieldIconSquare} aria-hidden />
              <label htmlFor="hero-service-input" className="visually-hidden">
                Service or provider
              </label>
              <input
                id="hero-service-input"
                type="search"
                placeholder="Service or provider"
                className={styles.fieldInput}
                value={serviceQuery}
                onChange={(e) => {
                  setServiceQuery(e.target.value);
                  setFormError(null);
                }}
              />
            </div>
          </div>

          {(geoError || formError) && (
            <p className={styles.fieldError} role="status">
              {formError || geoError}
            </p>
          )}

          <div className={styles.dateTimeRow}>
            <div className={styles.dateTimeField}>
              <label htmlFor="hero-date">Date</label>
              <div className={styles.dateTimeInputWrap}>
                <FaRegCalendarAlt className={styles.inputGlyph} aria-hidden />
                <input
                  id="hero-date"
                  type="date"
                  className={styles.dateInput}
                  value={date}
                  min={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.dateTimeField}>
              <label htmlFor="hero-time-mode">Time</label>
              <div className={styles.dateTimeInputWrap}>
                <FaRegClock className={styles.timeIcon} aria-hidden />
                <select
                  id="hero-time-mode"
                  className={styles.timeSelect}
                  value={timeMode}
                  onChange={(e) => setTimeMode(e.target.value as 'now' | 'custom')}
                  aria-label="Preferred time"
                >
                  <option value="now">Now</option>
                  <option value="custom">Choose a time…</option>
                </select>
              </div>
            </div>
          </div>

          {timeMode === 'custom' && (
            <div className={styles.customTimeRow}>
              <label htmlFor="hero-time" className="visually-hidden">
                Specific time
              </label>
              <input
                id="hero-time"
                type="time"
                className={styles.timeInput}
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>
          )}

          <h2 className={styles.suggestionsHeading}>
            {recent.length > 0 ? 'Recent searches' : 'Suggested searches'}
          </h2>
          <ul className={styles.suggestionsList}>
            {suggestionsToShow.map((item) => (
              <li key={item.key}>
                <button type="button" className={styles.suggestionBtn} onClick={item.onSelect}>
                  <FaHistory className={styles.suggestionIcon} aria-hidden />
                  <span className={styles.suggestionText}>
                    <span className={styles.suggestionPrimary}>{item.primary}</span>
                    <span className={styles.suggestionSecondary}>{item.secondary}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button type="submit" className={styles.cta}>
            See providers
          </button>
        </form>
        </div>

        <div className={styles.splitRight}>
          <div className={styles.heroImageFrame}>
            <Image
              src="/images/massage4.jpg"
              alt="Calm wellness session in a bright, professional space"
              fill
              className={styles.heroImage}
              sizes="(max-width: 899px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
