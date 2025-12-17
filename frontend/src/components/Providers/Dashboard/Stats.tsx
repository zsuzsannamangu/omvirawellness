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
  const [dailyTrafficData, setDailyTrafficData] = useState<{ date: string; count: number }[]>([]);
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
    if ((activeSubmenu === 'traffic' || activeSubmenu === 'bookings') && userId) {
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

    if (dropdownOpen && typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        if (typeof document !== 'undefined') {
          document.removeEventListener('mousedown', handleClickOutside);
        }
      };
    }
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
    try {
      // Fetch real traffic data for all periods
      const periods: TrafficPeriod[] = ['today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', 'last_month', 'this_year', 'last_year'];
      const trafficPromises = periods.map(period =>
        fetch(`http://localhost:4000/api/providers/${userId}/visits/stats?period=${period}`)
          .then(res => res.json())
          .then(data => ({ 
            period, 
            count: data.count || 0,
            daily: data.daily || []
          }))
          .catch(() => ({ period, count: 0, daily: [] }))
      );
      
      const results = await Promise.all(trafficPromises);
      const newTrafficData: { [key: string]: number } = {};
      let dailyData: { date: string; count: number }[] = [];
      
      results.forEach(({ period, count, daily }) => {
        newTrafficData[period] = count;
        // Store daily data for the current selected period
        if (period === trafficPeriod) {
          dailyData = daily || [];
        }
      });
      
      setTrafficData(newTrafficData);
      setDailyTrafficData(dailyData);
    } catch (error) {
      console.error('Error loading traffic data:', error);
      // Set all to 0 if there's an error
      setTrafficData({
        today: 0,
        yesterday: 0,
        last_7_days: 0,
        last_30_days: 0,
        this_month: 0,
        last_month: 0,
        this_year: 0,
        last_year: 0,
      });
      setDailyTrafficData([]);
    }
  };

  const getTrafficCount = (period: TrafficPeriod): number => {
    return trafficData[period] || 0;
  };

  const getDateRange = (period: TrafficPeriod): { start: Date; end: Date } => {
    // Get current date in LOCAL timezone
    const now = new Date();
    // Create today at midnight local time
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    switch (period) {
      case 'today':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { start: today, end: tomorrow };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: today };
      case 'last_7_days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate() + 1);
        return { start: sevenDaysAgo, end: nextDay };
      case 'last_30_days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const nextDay30 = new Date(today);
        nextDay30.setDate(nextDay30.getDate() + 1);
        return { start: thirtyDaysAgo, end: nextDay30 };
      case 'this_month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const nextDay2 = new Date(today);
        nextDay2.setDate(nextDay2.getDate() + 1);
        return { start: monthStart, end: nextDay2 };
      case 'last_month':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        return { start: lastMonthStart, end: lastMonthEnd };
      case 'this_year':
        const yearStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        const nextDay3 = new Date(today);
        nextDay3.setDate(nextDay3.getDate() + 1);
        return { start: yearStart, end: nextDay3 };
      case 'last_year':
        const lastYearStart = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
        const lastYearEnd = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        return { start: lastYearStart, end: lastYearEnd };
      default:
        return { start: today, end: today };
    }
  };

  const filterBookingsByPeriod = (period: TrafficPeriod): Booking[] => {
    const { start, end } = getDateRange(period);

    return bookings.filter(booking => {
      // Parse the booking_date which could be ISO timestamp or YYYY-MM-DD
      let bookingDateStr = booking.booking_date;
      
      // If it's an ISO timestamp, extract just the date part
      if (bookingDateStr.includes('T')) {
        bookingDateStr = bookingDateStr.split('T')[0];
      }
      
      const [year, month, day] = bookingDateStr.split('-').map(Number);
      // Create date at midnight LOCAL time (month is 0-indexed)
      const bookingDateOnly = new Date(year, month - 1, day, 0, 0, 0, 0);

      // Compare dates (end is exclusive)
      const isInRange = bookingDateOnly >= start && bookingDateOnly < end;

      return isInRange;
    });
  };

  // Get upcoming bookings (future bookings)
  const getUpcomingBookings = (): Booking[] => {
    // Get today at midnight in local time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    return bookings.filter(booking => {
      // Parse booking date in local time
      let bookingDateStr = booking.booking_date;
      
      // If it's an ISO timestamp, extract just the date part
      if (bookingDateStr.includes('T')) {
        bookingDateStr = bookingDateStr.split('T')[0];
      }
      
      const [year, month, day] = bookingDateStr.split('-').map(Number);
      const bookingDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      
      return bookingDate >= today && (booking.status === 'confirmed' || booking.status === 'pending');
    });
  };

  const calculateBookingStats = (period: TrafficPeriod) => {
    const filteredBookings = filterBookingsByPeriod(period);
    const total = filteredBookings.length;
    
    // Get today to determine if a booking is in the past
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    // Count completed: bookings with past dates (regardless of status except cancelled)
    const completed = filteredBookings.filter(b => {
      let bookingDateStr = b.booking_date;
      if (bookingDateStr.includes('T')) {
        bookingDateStr = bookingDateStr.split('T')[0];
      }
      const [year, month, day] = bookingDateStr.split('-').map(Number);
      const bookingDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      
      return bookingDate < today && b.status !== 'cancelled';
    }).length;
    
    return { total, completed };
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
    
    // For yearly periods, use monthly iteration
    if (period === 'this_year' || period === 'last_year') {
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      
      // Generate data for each month
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(startYear, month, 1, 0, 0, 0, 0);
        const monthEnd = new Date(startYear, month + 1, 1, 0, 0, 0, 0);
        let value = 0;
        
        if (dataType === 'traffic') {
          if (dailyTrafficData.length > 0) {
            const monthStr = monthStart.toISOString().substring(0, 7); // YYYY-MM
            value = dailyTrafficData.filter(d => {
              const dateDateStr = d.date.substring(0, 7); // YYYY-MM
              return dateDateStr === monthStr;
            }).reduce((sum, d) => sum + d.count, 0);
          }
        } else if (dataType === 'bookings') {
          value = bookings.filter(b => {
            const [year, month_num, day] = b.booking_date.split('-').map(Number);
            const bookingDate = new Date(year, month_num - 1, day, 0, 0, 0, 0);
            return bookingDate >= monthStart && bookingDate < monthEnd;
          }).length;
        } else if (dataType === 'revenue') {
          value = bookings.filter(b => {
            const [year, month_num, day] = b.booking_date.split('-').map(Number);
            const bookingDate = new Date(year, month_num - 1, day, 0, 0, 0, 0);
            return bookingDate >= monthStart && bookingDate < monthEnd;
          }).reduce((sum, b) => sum + (parseFloat(String(b.total_amount)) || 0), 0);
        }
        
        data.push({
          time: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          value: value
        });
      }
      
      return data.length > 0 ? data : [{ time: 'No data', value: 0 }];
    }
    
    // For other periods, use time-based intervals
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
    }

    const current = new Date(start);
    const endTime = end.getTime();
    
    while (current.getTime() < endTime) {
      const intervalEnd = new Date(current.getTime() + intervalMs);
      let value = 0;
      
      if (dataType === 'traffic') {
        // Use real traffic data from API
        if (dailyTrafficData.length > 0) {
          // For daily/weekly/monthly data, match by date only
          if (period === 'last_7_days' || period === 'last_30_days' || period === 'this_month' || period === 'last_month') {
            const currentDateStr = current.toISOString().split('T')[0]; // YYYY-MM-DD
            const matchingData = dailyTrafficData.find(d => {
              const dateDateStr = d.date.split('T')[0]; // YYYY-MM-DD
              return dateDateStr === currentDateStr;
            });
            value = matchingData ? matchingData.count : 0;
          } else if (period === 'today' || period === 'yesterday') {
            // For hourly data (today/yesterday), match by hour in local timezone
            value = dailyTrafficData.filter(d => {
              // Parse the UTC timestamp from backend
              const dataDate = new Date(d.date);
              
              // Get the hour of this interval in local time
              const currentHour = current.getHours();
              const currentDay = current.getDate();
              const currentMonth = current.getMonth();
              const currentYear = current.getFullYear();
              
              // Get the hour of the data point in local time
              const dataHour = dataDate.getHours();
              const dataDay = dataDate.getDate();
              const dataMonth = dataDate.getMonth();
              const dataYear = dataDate.getFullYear();
              
              // Match if same day and same hour
              return dataYear === currentYear && 
                     dataMonth === currentMonth && 
                     dataDay === currentDay && 
                     dataHour === currentHour;
            }).reduce((sum, d) => sum + d.count, 0);
          }
        } else {
          value = 0;
        }
      } else if (dataType === 'bookings') {
        const periodBookings = bookings.filter(b => {
          let bookingDateStr = b.booking_date;
          if (bookingDateStr.includes('T')) {
            bookingDateStr = bookingDateStr.split('T')[0];
          }
          const [year, month, day] = bookingDateStr.split('-').map(Number);
          const bookingDate = new Date(year, month - 1, day, 0, 0, 0, 0);
          return bookingDate >= current && bookingDate < intervalEnd;
        });
        value = periodBookings.length;
      } else if (dataType === 'revenue') {
        const periodBookings = bookings.filter(b => {
          let bookingDateStr = b.booking_date;
          if (bookingDateStr.includes('T')) {
            bookingDateStr = bookingDateStr.split('T')[0];
          }
          const [year, month, day] = bookingDateStr.split('-').map(Number);
          const bookingDate = new Date(year, month - 1, day, 0, 0, 0, 0);
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
        const upcomingBookings = getUpcomingBookings();

        return (
          <div className={styles.statsContent} key={`bookings-${trafficPeriod}`}>
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

            <div className={styles.bookingStatsGrid} key={`bookings-grid-${trafficPeriod}`}>
              <div className={styles.statCardCompact}>
                <FaCalendarAlt className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{bookingStats.total}</div>
                  <div className={styles.statLabelCompact}>Total ({getPeriodDisplayLabel(trafficPeriod)})</div>
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaClock className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{upcomingBookings.length}</div>
                  <div className={styles.statLabelCompact}>Upcoming</div>
                </div>
              </div>

              <div className={styles.statCardCompact}>
                <FaCheckCircle className={styles.statIcon} />
                <div className={styles.statCardContentCompact}>
                  <div className={styles.statValueCompact}>{bookingStats.completed}</div>
                  <div className={styles.statLabelCompact}>Completed ({getPeriodDisplayLabel(trafficPeriod)})</div>
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
