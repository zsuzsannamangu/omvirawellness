'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaDownload, FaReceipt } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';
import { API_URL } from '@/config/api';

interface PaymentsProps {
  activeSubmenu: string;
}

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: string;
  total_amount: number;
  payment_status: string;
  provider_notes?: string;
  business_name?: string;
  contact_name?: string;
  created_at: string;
}

export default function Payments({ activeSubmenu }: PaymentsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        setBookings([]);
        setLoading(false);
        return;
      }
      const userData = JSON.parse(user);
      const clientId = userData.id;

      const response = await fetch(`${API_URL}/bookings/client/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadBookings();
  }, [loadBookings]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${parseFloat(amount.toString()).toFixed(2)}`;
  };

  const getServiceName = (providerNotes: string | undefined) => {
    if (!providerNotes) return 'Service';
    try {
      const info = JSON.parse(providerNotes);
      return info?.name || 'Service';
    } catch {
      return 'Service';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || 'unpaid';
    switch (statusLower) {
      case 'paid':
        return <span className={`${styles.paymentStatus} ${styles.paid}`}>Paid</span>;
      case 'unpaid':
        return <span className={`${styles.paymentStatus} ${styles.unpaid}`}>Unpaid</span>;
      case 'pending':
        return <span className={`${styles.paymentStatus} ${styles.pending}`}>Pending</span>;
      case 'refunded':
        return <span className={`${styles.paymentStatus} ${styles.refunded}`}>Refunded</span>;
      default:
        return <span className={`${styles.paymentStatus} ${styles.unpaid}`}>{status || 'Unpaid'}</span>;
    }
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'receipts':
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payment History</h2>
            {loading ? (
              <div className={styles.placeholderText}>Loading payment history...</div>
            ) : bookings.length === 0 ? (
              <div className={styles.placeholderText}>No payment history yet.</div>
            ) : (
              <div className={styles.paymentHistory}>
                <table className={styles.paymentsTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Service</th>
                      <th>Provider</th>
                      <th>Time</th>
                      <th>Amount</th>
                      <th>Payment Status</th>
                      <th>Booking Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .filter((booking) => booking.status !== 'cancelled' || booking.payment_status === 'paid')
                      .sort((a, b) => {
                        const dateA = new Date(a.booking_date);
                        const dateB = new Date(b.booking_date);
                        if (dateA.getTime() !== dateB.getTime()) {
                          return dateB.getTime() - dateA.getTime();
                        }
                        const timeA = a.start_time.split(':').map(Number);
                        const timeB = b.start_time.split(':').map(Number);
                        return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]);
                      })
                      .map((booking) => {
                        const serviceName = getServiceName(booking.provider_notes);
                        const providerName = booking.contact_name || booking.business_name || 'Provider';
                        const bookingDate = formatDate(booking.booking_date);
                        const bookingTime = `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`;
                        const amount = formatCurrency(parseFloat(booking.total_amount?.toString() || '0'));

                        return (
                          <tr key={booking.id}>
                            <td>{bookingDate}</td>
                            <td>{serviceName}</td>
                            <td>{providerName}</td>
                            <td>{bookingTime}</td>
                            <td className={styles.amountCell}>{amount}</td>
                            <td>{getPaymentStatusBadge(booking.payment_status)}</td>
                            <td>
                              <span className={`${styles.bookingStatus} ${styles[booking.status]}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              {booking.payment_status === 'paid' && (
                                <button className={styles.receiptBtn} title="Download Receipt">
                                  <FaDownload />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payments</h2>
            {loading ? (
              <div className={styles.placeholderText}>Loading payments...</div>
            ) : bookings.length === 0 ? (
              <div className={styles.placeholderText}>No payments data yet.</div>
            ) : (
              <div className={styles.paymentsOverview}>
                <div className={styles.overviewCard}>
                  <h3>Total Spent</h3>
                  <p className={styles.totalAmount}>
                    {formatCurrency(
                      bookings
                        .filter(b => b.payment_status === 'paid')
                        .reduce((sum, b) => sum + parseFloat(b.total_amount?.toString() || '0'), 0)
                    )}
                  </p>
                </div>
                <div className={styles.overviewCard}>
                  <h3>Pending Payments</h3>
                  <p className={styles.pendingAmount}>
                    {formatCurrency(
                      bookings
                        .filter(b => b.payment_status === 'unpaid' && b.status !== 'cancelled')
                        .reduce((sum, b) => sum + parseFloat(b.total_amount?.toString() || '0'), 0)
                    )}
                  </p>
                </div>
                <div className={styles.overviewCard}>
                  <h3>Total Bookings</h3>
                  <p className={styles.bookingCount}>
                    {bookings.filter(b => b.status !== 'cancelled').length}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
