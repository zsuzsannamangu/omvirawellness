'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { FaStar, FaEye, FaCalendarAlt, FaDollarSign, FaChartLine, FaUsers, FaArrowUp, FaArrowDown, FaChevronDown, FaCheckCircle, FaClock, FaTimesCircle, FaReply } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface StatsProps {
  activeSubmenu: string;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  reviewer_first_name: string | null;
  reviewer_last_name: string | null;
  reviewer_email: string;
}

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  total_amount: number;
  payment_status: string;
  created_at: string;
}

type TrafficPeriod = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'this_year' | 'last_year';

export default function Stats({ activeSubmenu }: StatsProps) {
  const params = useParams();
  const userId = params.userId as string;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [trafficPeriod, setTrafficPeriod] = useState<TrafficPeriod>('today');
  const [trafficData, setTrafficData] = useState<{ [key: string]: number }>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Map reviews to bookings to get service names
  const getServiceNameForReview = (review: Review, reviewIndex: number): string => {
    // Try to get service name from bookings if available
    // Match by index or try to find related booking
    if (bookings.length > 0 && reviewIndex < bookings.length) {
      try {
        const booking = bookings[reviewIndex];
        if (booking.provider_notes) {
          const serviceInfo = JSON.parse(booking.provider_notes);
          return serviceInfo.name || 'Service';
        }
      } catch (e) {
        // If parsing fails, continue
      }
    }
    // Default to generic service name
    return 'Service';
  };
  
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  useEffect(() => {
    if (activeSubmenu === 'reviews' && userId) {
      loadReviews();
      loadBookings(); // Load bookings to get service names for reviews
    }
    if ((activeSubmenu === 'traffic' || activeSubmenu === 'bookings' || activeSubmenu === 'revenue') && userId) {
      loadBookings();
      loadTrafficData();
    }
    // Close dropdown when switching sections
    setDropdownOpen(false);
  }, [activeSubmenu, userId, trafficPeriod]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:4000/api/reviews/provider/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
        
        if (data.length > 0) {
          const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length;
          setAverageRating(avg);
          setTotalReviews(data.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:4000/api/bookings/provider/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const loadTrafficData = async () => {
    // TODO: Replace with actual API call when backend endpoint is available
    // For now, using mock data based on bookings as a proxy
    const mockTraffic: { [key: string]: number } = {
      today: Math.floor(Math.random() * 50) + 10,
      yesterday: Math.floor(Math.random() * 50) + 10,
      last_7_days: Math.floor(Math.random() * 200) + 50,
      last_30_days: Math.floor(Math.random() * 800) + 200,
      this_month: Math.floor(Math.random() * 600) + 150,
      last_month: Math.floor(Math.random() * 600) + 150,
      this_year: Math.floor(Math.random() * 5000) + 2000,
      last_year: Math.floor(Math.random() * 5000) + 2000,
    };
    setTrafficData(mockTraffic);
  };

  const getTrafficCount = (period: TrafficPeriod): number => {
    return trafficData[period] || 0;
  };

  const getDateRange = (period: TrafficPeriod): { start: Date; end: Date } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return { start: yesterday, end: today };
      case 'last_7_days':
        return { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: today };
      case 'last_30_days':
        return { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: today };
      case 'this_month':
        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: lastMonth, end: lastMonthEnd };
      case 'this_year':
        return { start: new Date(now.getFullYear(), 0, 1), end: now };
      case 'last_year':
        return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59) };
      default:
        return { start: today, end: today };
    }
  };

  const filterBookingsByPeriod = (period: TrafficPeriod): Booking[] => {
    const { start, end } = getDateRange(period);
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= start && bookingDate <= end;
    });
  };

  const calculateBookingStats = (period: TrafficPeriod) => {
    const filteredBookings = filterBookingsByPeriod(period);
    const total = filteredBookings.length;
    const confirmed = filteredBookings.filter(b => b.status === 'confirmed').length;
    const completed = filteredBookings.filter(b => b.status === 'completed').length;
    const cancelled = filteredBookings.filter(b => b.status === 'cancelled').length;
    const pending = filteredBookings.filter(b => b.status === 'pending').length;
    
    return { total, confirmed, completed, cancelled, pending };
  };

  const calculateRevenueStats = (period: TrafficPeriod) => {
    const filteredBookings = filterBookingsByPeriod(period);
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (parseFloat(String(b.total_amount)) || 0), 0);
    const averageBookingValue = filteredBookings.length > 0 ? totalRevenue / filteredBookings.length : 0;
    const completedRevenue = filteredBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (parseFloat(String(b.total_amount)) || 0), 0);
    
    return { totalRevenue, averageBookingValue, completedRevenue, bookingCount: filteredBookings.length };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Generate chart data based on period
  const generateChartData = (period: TrafficPeriod, dataType: 'traffic' | 'bookings' | 'revenue') => {
    const { start, end } = getDateRange(period);
    const data: { time: string; value: number }[] = [];
    
    // Determine interval and format based on period
    let intervalMs = 60 * 60 * 1000; // Default 1 hour
    let formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    
    if (period === 'today' || period === 'yesterday') {
      intervalMs = 60 * 60 * 1000; // 1 hour intervals
      formatTime = (date: Date) => {
        const hour = date.getHours();
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour % 12 || 12;
        return `${displayHour}${ampm}`;
      };
    } else if (period === 'last_7_days') {
      intervalMs = 24 * 60 * 60 * 1000; // Daily intervals
      formatTime = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === 'last_30_days' || period === 'this_month' || period === 'last_month') {
      intervalMs = 24 * 60 * 60 * 1000; // Daily intervals
      formatTime = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      intervalMs = 30 * 24 * 60 * 60 * 1000; // Monthly intervals
      formatTime = (date: Date) => date.toLocaleDateString('en-US', { month: 'short' });
    }

    const current = new Date(start);
    const endTime = end.getTime();
    
    while (current.getTime() <= endTime) {
      const intervalEnd = new Date(current.getTime() + intervalMs);
      let value = 0;
      
      if (dataType === 'traffic') {
        // Mock traffic data - in real app, fetch from API
        value = Math.floor(Math.random() * 20);
      } else if (dataType === 'bookings') {
        const periodBookings = bookings.filter(b => {
          const bookingDate = new Date(b.booking_date);
          return bookingDate >= current && bookingDate < intervalEnd;
        });
        value = periodBookings.length;
      } else if (dataType === 'revenue') {
        const periodBookings = bookings.filter(b => {
          const bookingDate = new Date(b.booking_date);
          return bookingDate >= current && bookingDate < intervalEnd;
        });
        value = periodBookings.reduce((sum, b) => sum + (parseFloat(String(b.total_amount)) || 0), 0);
      }
      
      data.push({
        time: formatTime(current),
        value: value
      });
      
      current.setTime(current.getTime() + intervalMs);
    }
    
    // Ensure we have at least some data points
    if (data.length === 0) {
      data.push({ time: formatTime(start), value: 0 });
    }
    
    // Limit to reasonable number of data points for better visualization
    if (data.length > 30) {
      const step = Math.ceil(data.length / 30);
      return data.filter((_, index) => index % step === 0);
    }
    
    return data;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPeriodLabel = (period: TrafficPeriod): string => {
    const labels: { [key: string]: string } = {
      today: 'Today',
      yesterday: 'Yesterday',
      last_7_days: 'Last 7 Days',
      last_30_days: 'Last 30 Days',
      this_month: 'This Month',
      last_month: 'Last Month',
      this_year: 'This Year',
      last_year: 'Last Year',
    };
    return labels[period] || period;
  };

  const getPeriodDisplayLabel = (period: TrafficPeriod): string => {
    // Format for display in dropdown button (e.g., "Today: Dec 16")
    const now = new Date();
    const labels: { [key: string]: string } = {
      today: `Today: ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      yesterday: `Yesterday: ${new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      last_7_days: 'Last 7 Days',
      last_30_days: 'Last 30 Days',
      this_month: `This Month: ${now.toLocaleDateString('en-US', { month: 'long' })}`,
      last_month: `Last Month: ${new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleDateString('en-US', { month: 'long' })}`,
      this_year: `This Year: ${now.getFullYear()}`,
      last_year: `Last Year: ${now.getFullYear() - 1}`,
    };
    return labels[period] || getPeriodLabel(period);
  };

  const periodOptions: { value: TrafficPeriod; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_year', label: 'Last Year' },
  ];

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'traffic':
        const currentTraffic = getTrafficCount(trafficPeriod);
        const previousPeriod = trafficPeriod === 'today' ? 'yesterday' : 
                              trafficPeriod === 'yesterday' ? 'today' :
                              trafficPeriod === 'last_7_days' ? 'last_30_days' :
                              trafficPeriod === 'last_30_days' ? 'last_7_days' :
                              trafficPeriod === 'this_month' ? 'last_month' :
                              trafficPeriod === 'last_month' ? 'this_month' :
                              trafficPeriod === 'this_year' ? 'last_year' : 'this_year';
        const previousTraffic = getTrafficCount(previousPeriod as TrafficPeriod);
        const trafficChange = previousTraffic > 0 ? ((currentTraffic - previousTraffic) / previousTraffic * 100) : 0;

        return (
          <div className={styles.statsContent}>
            <div className={styles.statsHeader}>
              <h2 className={styles.sectionTitle}>Traffic</h2>
              <div className={styles.periodDropdownWrapper} ref={dropdownRef}>
                <button
                  className={styles.periodDropdownBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{getPeriodDisplayLabel(trafficPeriod)}</span>
                  <FaChevronDown className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className={styles.periodDropdownMenu}>
                    {periodOptions.map(option => (
                      <button
                        key={option.value}
                        className={`${styles.periodDropdownItem} ${trafficPeriod === option.value ? styles.periodDropdownItemActive : ''}`}
                        onClick={() => {
                          setTrafficPeriod(option.value);
                          setDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.trafficStats}>
              <div className={styles.statCardCompact}>
                <FaEye className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{currentTraffic.toLocaleString()}</div>
                  <div className={styles.statLabelCompact}>Profile Visits</div>
                  {previousTraffic > 0 && (
                    <div className={`${styles.statChangeCompact} ${trafficChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}`}>
                      {trafficChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                      {Math.abs(trafficChange).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className={styles.statsChart}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateChartData(trafficPeriod, 'traffic')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    className={styles.chartAxis}
                  />
                  <YAxis 
                    className={styles.chartAxis}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'bookings':
        const bookingPreviousPeriod = trafficPeriod === 'today' ? 'yesterday' : 
                              trafficPeriod === 'yesterday' ? 'today' :
                              trafficPeriod === 'last_7_days' ? 'last_30_days' :
                              trafficPeriod === 'last_30_days' ? 'last_7_days' :
                              trafficPeriod === 'this_month' ? 'last_month' :
                              trafficPeriod === 'last_month' ? 'this_month' :
                              trafficPeriod === 'this_year' ? 'last_year' : 'this_year';
        const bookingStats = calculateBookingStats(trafficPeriod);
        const previousBookingStats = calculateBookingStats(bookingPreviousPeriod as TrafficPeriod);
        const bookingChange = previousBookingStats.total > 0 
          ? ((bookingStats.total - previousBookingStats.total) / previousBookingStats.total * 100) 
          : 0;
        const bookingPreviousPeriodLabel = getPeriodLabel(bookingPreviousPeriod as TrafficPeriod);

        return (
          <div className={styles.statsContent}>
            <div className={styles.statsHeader}>
              <h2 className={styles.sectionTitle}>Bookings Stats</h2>
              <div className={styles.periodDropdownWrapper} ref={dropdownRef}>
                <button
                  className={styles.periodDropdownBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{getPeriodDisplayLabel(trafficPeriod)}</span>
                  <FaChevronDown className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className={styles.periodDropdownMenu}>
                    {periodOptions.map(option => (
                      <button
                        key={option.value}
                        className={`${styles.periodDropdownItem} ${trafficPeriod === option.value ? styles.periodDropdownItemActive : ''}`}
                        onClick={() => {
                          setTrafficPeriod(option.value);
                          setDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.bookingStatsGrid}>
              <div className={styles.statCardCompact}>
                <FaCalendarAlt className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{bookingStats.total}</div>
                  <div className={styles.statLabelCompact}>Total Bookings</div>
                  {previousBookingStats.total > 0 && (
                    <div className={`${styles.statChangeCompact} ${bookingChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}`}>
                      {bookingChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                      {Math.abs(bookingChange).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaCheckCircle className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{bookingStats.confirmed}</div>
                  <div className={styles.statLabelCompact}>Confirmed</div>
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaCheckCircle className={`${styles.statIcon} ${styles.statIconSuccess}`} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{bookingStats.completed}</div>
                  <div className={styles.statLabelCompact}>Completed</div>
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaClock className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{bookingStats.pending}</div>
                  <div className={styles.statLabelCompact}>Pending</div>
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaTimesCircle className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{bookingStats.cancelled}</div>
                  <div className={styles.statLabelCompact}>Cancelled</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className={styles.statsChart}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateChartData(trafficPeriod, 'bookings')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    className={styles.chartAxis}
                  />
                  <YAxis 
                    className={styles.chartAxis}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'revenue':
        const revenuePreviousPeriod = trafficPeriod === 'today' ? 'yesterday' : 
                              trafficPeriod === 'yesterday' ? 'today' :
                              trafficPeriod === 'last_7_days' ? 'last_30_days' :
                              trafficPeriod === 'last_30_days' ? 'last_7_days' :
                              trafficPeriod === 'this_month' ? 'last_month' :
                              trafficPeriod === 'last_month' ? 'this_month' :
                              trafficPeriod === 'this_year' ? 'last_year' : 'this_year';
        const revenueStats = calculateRevenueStats(trafficPeriod);
        const previousRevenueStats = calculateRevenueStats(revenuePreviousPeriod as TrafficPeriod);
        const revenueChange = previousRevenueStats.totalRevenue > 0
          ? ((revenueStats.totalRevenue - previousRevenueStats.totalRevenue) / previousRevenueStats.totalRevenue * 100)
          : 0;
        const revenuePreviousPeriodLabel = getPeriodLabel(revenuePreviousPeriod as TrafficPeriod);

        return (
          <div className={styles.statsContent}>
            <div className={styles.statsHeader}>
              <h2 className={styles.sectionTitle}>Revenue Stats</h2>
              <div className={styles.periodDropdownWrapper} ref={dropdownRef}>
                <button
                  className={styles.periodDropdownBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{getPeriodDisplayLabel(trafficPeriod)}</span>
                  <FaChevronDown className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className={styles.periodDropdownMenu}>
                    {periodOptions.map(option => (
                      <button
                        key={option.value}
                        className={`${styles.periodDropdownItem} ${trafficPeriod === option.value ? styles.periodDropdownItemActive : ''}`}
                        onClick={() => {
                          setTrafficPeriod(option.value);
                          setDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.revenueStatsGrid}>
              <div className={styles.statCardCompact}>
                <FaDollarSign className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{formatCurrency(revenueStats.totalRevenue)}</div>
                  <div className={styles.statLabelCompact}>Total Revenue</div>
                  {previousRevenueStats.totalRevenue > 0 && (
                    <div className={`${styles.statChangeCompact} ${revenueChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}`}>
                      {revenueChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                      {Math.abs(revenueChange).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaCheckCircle className={`${styles.statIcon} ${styles.statIconSuccess}`} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{formatCurrency(revenueStats.completedRevenue)}</div>
                  <div className={styles.statLabelCompact}>Completed Revenue</div>
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaChartLine className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{formatCurrency(revenueStats.averageBookingValue)}</div>
                  <div className={styles.statLabelCompact}>Avg Booking Value</div>
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaCalendarAlt className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{revenueStats.bookingCount}</div>
                  <div className={styles.statLabelCompact}>Total Bookings</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className={styles.statsChart}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateChartData(trafficPeriod, 'revenue')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666"
                    className={styles.chartAxis}
                  />
                  <YAxis 
                    stroke="#666"
                    className={styles.chartAxis}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#455F76" 
                    strokeWidth={2}
                    dot={{ fill: '#455F76', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className={styles.reviewsContent}>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleWithMargin}`}>Reviews</h2>
            
            {loading ? (
              <div className={styles.placeholderText}>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className={styles.placeholderText}>
                <p>No reviews yet.</p>
              </div>
            ) : (
              <>
                {/* Reviews List */}
                <div className={styles.reviewsListNew}>
                  {reviews.map((review, index) => {
                    const reviewerName = review.reviewer_first_name && review.reviewer_last_name
                      ? `${review.reviewer_first_name} ${review.reviewer_last_name}`
                      : review.reviewer_email?.split('@')[0] || 'Anonymous';
                    const serviceName = getServiceNameForReview(review, index);
                    const nameParts = reviewerName.split(' ');
                    const initials = nameParts.length > 1 
                      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                      : reviewerName.charAt(0).toUpperCase();
                    
                    return (
                      <div key={review.id} className={styles.reviewCardNew}>
                        <div className={styles.reviewCardHeader}>
                          <div className={styles.reviewerAvatarContainer}>
                            <div className={styles.reviewerAvatarNew}>
                              {initials}
                            </div>
                            <div className={styles.avatarBadge}>
                              <FaStar />
                            </div>
                          </div>
                          <div className={styles.reviewerInfoNew}>
                            <div className={styles.reviewerNameNew}>
                              {reviewerName} <span className={styles.reviewAction}>left a review on your listing</span>
                            </div>
                            <div className={styles.listingName}>{serviceName}</div>
                          </div>
                        </div>
                        
                        <div className={styles.reviewBox}>
                          <div className={styles.reviewStarsInBox}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={star <= review.rating ? styles.starFilledInBox : styles.starEmptyInBox}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className={styles.reviewTextNew}>{review.comment}</p>
                          )}
                        </div>
                        
                        <div className={styles.reviewFooter}>
                          <span className={styles.reviewTimeAgo}>{getTimeAgo(review.created_at)}</span>
                          <button className={styles.responseButton}>
                            <FaReply className={styles.responseIcon} />
                            Post a public response
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
