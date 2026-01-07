'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaDollarSign, FaDownload, FaCalendarAlt, FaCreditCard, FaChartLine, FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaChevronDown, FaExchangeAlt, FaImage } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface PaymentsProps {
  activeSubmenu: string;
}

interface ServiceInfo {
  name?: string;
  duration?: number;
  price?: number;
  location_type?: string;
  location_details?: string;
  add_ons?: Array<{ name?: string; price?: number; description?: string }>;
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
  client_notes?: string;
  provider_notes?: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
}

interface EarningsSummary {
  totalEarnings: number;
  paidEarnings: number;
  pendingEarnings: number;
  totalBookings: number;
  paidBookings: number;
  pendingBookings: number;
}

export default function Payments({ activeSubmenu }: PaymentsProps) {
  const params = useParams();
  const userId = params.userId as string;
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState<'this_month' | 'last_month' | 'this_year' | 'last_year'>('this_month');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number } | null>(null);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    paidEarnings: 0,
    pendingEarnings: 0,
    totalBookings: 0,
    paidBookings: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:4000/api/bookings/provider/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
          
          // Calculate earnings summary
          const summary: EarningsSummary = {
            totalEarnings: 0,
            paidEarnings: 0,
            pendingEarnings: 0,
            totalBookings: data.length,
            paidBookings: 0,
            pendingBookings: 0
          };

          data.forEach((booking: Booking) => {
            const amount = parseFloat(String(booking.total_amount)) || 0;
            summary.totalEarnings += amount;
            
            if (booking.payment_status === 'paid') {
              summary.paidEarnings += amount;
              summary.paidBookings++;
            } else if (booking.payment_status === 'unpaid') {
              summary.pendingEarnings += amount;
              summary.pendingBookings++;
            }
          });

          setEarningsSummary(summary);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const parseServiceInfo = (providerNotes?: string): ServiceInfo | null => {
    if (!providerNotes) return null;
    try {
      return JSON.parse(providerNotes);
    } catch (e) {
      return null;
    }
  };

  const getServiceName = (booking: Booking): string => {
    const serviceInfo = parseServiceInfo(booking.provider_notes);
    return serviceInfo?.name || 'Service';
  };

  const getAddOns = (booking: Booking): Array<{ name?: string; price?: number; description?: string }> => {
    const serviceInfo = parseServiceInfo(booking.provider_notes);
    return serviceInfo?.add_ons || [];
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className={`${styles.statusBadge} ${styles.statusPaid}`}><FaCheckCircle /> Paid</span>;
      case 'unpaid':
        return <span className={`${styles.statusBadge} ${styles.statusUnpaid}`}><FaClock /> Unpaid</span>;
      case 'refunded':
        return <span className={`${styles.statusBadge} ${styles.statusRefunded}`}><FaTimesCircle /> Refunded</span>;
      case 'partial_refund':
        return <span className={`${styles.statusBadge} ${styles.statusPartial}`}><FaTimesCircle /> Partial Refund</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.statusUnpaid}`}><FaClock /> {status}</span>;
    }
  };

  const filterBookingsByPeriod = (bookingsList: Booking[], period: string): Booking[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return bookingsList.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      
      switch (period) {
        case 'this_month': {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return bookingDate >= startOfMonth && bookingDate <= today;
        }
        case 'last_month': {
          const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
        }
        case 'this_year': {
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          return bookingDate >= startOfYear && bookingDate <= today;
        }
        case 'last_year': {
          const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
          const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
          return bookingDate >= startOfLastYear && bookingDate <= endOfLastYear;
        }
        default:
          return true;
      }
    });
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'balance':
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Balance Overview</h2>
            {loading ? (
              <div className={styles.placeholderText}>
                <p>Loading earnings data...</p>
              </div>
            ) : (
              <>
                <div className={styles.earningsCards}>
                  <div className={styles.earningsCard}>
                    <div className={styles.earningsCardIcon}>
                      <FaDollarSign />
                    </div>
                    <div className={styles.earningsCardContent}>
                      <h3>Total Earnings</h3>
                      <p className={styles.earningsAmount}>{formatCurrency(earningsSummary.totalEarnings)}</p>
                      <span className={styles.earningsSubtext}>{earningsSummary.totalBookings} total bookings</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.earningsCard} ${styles.earningsCardSuccess}`}>
                    <div className={styles.earningsCardIcon}>
                      <FaCheckCircle />
                    </div>
                    <div className={styles.earningsCardContent}>
                      <h3>Paid Earnings</h3>
                      <p className={styles.earningsAmount}>{formatCurrency(earningsSummary.paidEarnings)}</p>
                      <span className={styles.earningsSubtext}>{earningsSummary.paidBookings} paid bookings</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.earningsCard} ${styles.earningsCardPending}`}>
                    <div className={styles.earningsCardIcon}>
                      <FaClock />
                    </div>
                    <div className={styles.earningsCardContent}>
                      <h3>Pending Earnings</h3>
                      <p className={styles.earningsAmount}>{formatCurrency(earningsSummary.pendingEarnings)}</p>
                      <span className={styles.earningsSubtext}>{earningsSummary.pendingBookings} unpaid bookings</span>
                    </div>
                  </div>
                </div>

                {earningsSummary.totalBookings === 0 && (
                  <div className={styles.placeholderText}>
                    <p>No bookings yet. Earnings will appear here once you have completed bookings.</p>
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 'payouts':
        const paidBookings = bookings.filter(b => b.payment_status === 'paid');
        
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payout History</h2>
            {loading ? (
              <div className={styles.placeholderText}>
                <p>Loading payout history...</p>
              </div>
            ) : paidBookings.length === 0 ? (
              <div className={styles.placeholderText}>
                <p>No payout history yet.</p>
              </div>
            ) : (
              <div className={styles.bookingsTableWrapper}>
                <table className={styles.bookingsTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Payment Status</th>
                      <th>Booking Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidBookings
                      .sort((a, b) => {
                        const dateA = new Date(`${a.booking_date}T${a.start_time}`);
                        const dateB = new Date(`${b.booking_date}T${b.start_time}`);
                        return dateB.getTime() - dateA.getTime();
                      })
                      .map((booking) => {
                        let serviceName = 'Service';
                        try {
                          if (booking.provider_notes) {
                            const serviceInfo = JSON.parse(booking.provider_notes);
                            serviceName = serviceInfo.name || 'Service';
                          }
                        } catch (e) {
                          // If parsing fails, use default
                        }
                        
                        return (
                          <tr key={booking.id}>
                            <td>{formatDateTime(booking.booking_date, booking.start_time)}</td>
                            <td>{booking.first_name} {booking.last_name}</td>
                            <td>{serviceName}</td>
                            <td className={styles.amountCell}>{formatCurrency(parseFloat(String(booking.total_amount)))}</td>
                            <td>{getPaymentStatusBadge(booking.payment_status)}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${styles[`status${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`]}`}>
                                {booking.status}
                              </span>
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
      
      case 'reports':
        const allBookingsForReport = bookings.filter(b => 
          b.status === 'completed' || b.status === 'confirmed'
        );
        
        const filteredBookings = filterBookingsByPeriod(allBookingsForReport, reportPeriod);
        
        // Calculate totals for the selected period
        const periodTotal = filteredBookings.reduce((sum, b) => sum + (parseFloat(String(b.total_amount)) || 0), 0);
        const periodCount = filteredBookings.length;
        
        // Group by month for display
        const monthlyData: { [key: string]: { count: number; total: number } } = {};
        filteredBookings.forEach(booking => {
          const date = new Date(booking.booking_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { count: 0, total: 0 };
          }
          monthlyData[monthKey].count++;
          monthlyData[monthKey].total += parseFloat(String(booking.total_amount)) || 0;
        });

        const monthlyEntries = Object.entries(monthlyData)
          .sort((a, b) => b[0].localeCompare(a[0]));

        const getPeriodLabel = () => {
          switch (reportPeriod) {
            case 'this_month': return 'This Month';
            case 'last_month': return 'Last Month';
            case 'this_year': return 'This Year';
            case 'last_year': return 'Last Year';
            default: return 'This Month';
          }
        };

        return (
          <div className={styles.paymentsContent}>
            <div className={styles.reportsHeader}>
              <h2 className={styles.sectionTitle}>Earnings Reports</h2>
              <div className={styles.periodFilters}>
                <button
                  className={`${styles.periodFilterBtn} ${reportPeriod === 'this_month' ? styles.periodFilterActive : ''}`}
                  onClick={() => setReportPeriod('this_month')}
                >
                  This Month
                </button>
                <button
                  className={`${styles.periodFilterBtn} ${reportPeriod === 'last_month' ? styles.periodFilterActive : ''}`}
                  onClick={() => setReportPeriod('last_month')}
                >
                  Last Month
                </button>
                <button
                  className={`${styles.periodFilterBtn} ${reportPeriod === 'this_year' ? styles.periodFilterActive : ''}`}
                  onClick={() => setReportPeriod('this_year')}
                >
                  This Year
                </button>
                <button
                  className={`${styles.periodFilterBtn} ${reportPeriod === 'last_year' ? styles.periodFilterActive : ''}`}
                  onClick={() => setReportPeriod('last_year')}
                >
                  Last Year
                </button>
              </div>
            </div>
            {loading ? (
              <div className={styles.placeholderText}>
                <p>Loading reports...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className={styles.placeholderText}>
                <p>No bookings found for {getPeriodLabel().toLowerCase()}.</p>
              </div>
            ) : (
              <>
                <div className={styles.reportsSummary}>
                  <div className={styles.reportSummaryCard}>
                    <div className={styles.reportSummaryItem}>
                      <span className={styles.reportSummaryLabel}>Total Earnings</span>
                      <span className={styles.reportSummaryValue}>{formatCurrency(periodTotal)}</span>
                    </div>
                    <div className={styles.reportSummaryItem}>
                      <span className={styles.reportSummaryLabel}>Total Bookings</span>
                      <span className={styles.reportSummaryValue}>{periodCount}</span>
                    </div>
                  </div>
                </div>
                {monthlyEntries.length > 0 && (
                  <div className={styles.reportCard}>
                    <h3>Monthly Breakdown</h3>
                    <div className={styles.monthlyBreakdown}>
                      {monthlyEntries.map(([month, data]) => {
                        const [year, monthNum] = month.split('-');
                        const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
                        return (
                          <div key={month} className={styles.monthlyItem}>
                            <div className={styles.monthlyHeader}>
                              <span className={styles.monthName}>{monthName}</span>
                              <span className={styles.monthCount}>{data.count}</span>
                            </div>
                            <div className={styles.monthlyAmount}>{formatCurrency(data.total)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 'statements':
        // Get all unique years and months from bookings
        const statementsData: { [key: string]: { year: number; month: number; bookings: Booking[]; total: number; fees: number } } = {};
        
        bookings.forEach(booking => {
          const date = new Date(booking.booking_date);
          const year = date.getFullYear();
          const month = date.getMonth();
          const key = `${year}-${month}`;
          
          if (!statementsData[key]) {
            statementsData[key] = {
              year,
              month,
              bookings: [],
              total: 0,
              fees: 0
            };
          }
          
          statementsData[key].bookings.push(booking);
          const amount = parseFloat(String(booking.total_amount)) || 0;
          statementsData[key].total += amount;
          // Calculate fee (assuming 6.5% platform fee)
          statementsData[key].fees += amount * 0.065;
        });
        
        const statementsList = Object.values(statementsData)
          .sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
          });
        
        const availableYears = Array.from(new Set(statementsList.map(s => s.year))).sort((a, b) => b - a);
        const filteredStatements = statementsList.filter(s => s.year === selectedYear);
        
        // If a month is selected, show detailed statement
        if (selectedMonth) {
          const monthStatements = statementsData[`${selectedMonth.year}-${selectedMonth.month}`];
          if (!monthStatements) {
            return (
              <div className={styles.paymentsContent}>
                <div className={styles.statementsBreadcrumb}>
                  <button onClick={() => setSelectedMonth(null)} className={styles.breadcrumbLink}>
                    Monthly statements
                  </button>
                </div>
                <div className={styles.placeholderText}>
                  <p>No statement found for this month.</p>
                </div>
              </div>
            );
          }
          
          const monthBookings = monthStatements.bookings.sort((a, b) => {
            const dateA = new Date(a.booking_date);
            const dateB = new Date(b.booking_date);
            return dateB.getTime() - dateA.getTime();
          });
          
          const netAmount = monthStatements.total - monthStatements.fees;
          
          // Build transaction rows in chronological order (oldest first)
          const transactions: Array<{
            date: Date;
            type: string;
            description: string;
            amount: string;
            fee: number;
            net: number;
            balance: number;
            bookingId?: string;
            serviceName?: string;
          }> = [];
          
          let runningBalance = 0;
          
          // Add fee transactions (oldest first)
          monthBookings.reverse().forEach((booking) => {
            const bookingAmount = parseFloat(String(booking.total_amount)) || 0;
            const fee = bookingAmount * 0.065;
            const net = -fee;
            
            let serviceName = 'Service';
            try {
              if (booking.provider_notes) {
                const serviceInfo = JSON.parse(booking.provider_notes);
                serviceName = serviceInfo.name || 'Service';
              }
            } catch (e) {}
            
            runningBalance += net; // Subtract fee from balance
            
            transactions.push({
              date: new Date(booking.booking_date),
              type: 'Fee',
              description: serviceName,
              amount: '--',
              fee: -fee,
              net: -fee,
              balance: runningBalance,
              bookingId: booking.id,
              serviceName: serviceName
            });
          });
          
          // Add deposit transaction at the end (last day of month)
          runningBalance = netAmount;
          transactions.push({
            date: new Date(selectedMonth.year, selectedMonth.month + 1, 0), // Last day of month
            type: 'Deposit',
            description: `${formatCurrency(netAmount)} sent to your bank account`,
            amount: '',
            fee: 0,
            net: 0,
            balance: runningBalance
          });
          
          // Reverse to show most recent first (deposit at top, then fees in reverse chronological order)
          transactions.reverse();
          
          return (
            <div className={styles.paymentsContent}>
              <div className={styles.statementsBreadcrumb}>
                <button onClick={() => setSelectedMonth(null)} className={styles.breadcrumbLink}>
                  Monthly statements
                </button>
                <span className={styles.breadcrumbSeparator}> &gt; </span>
                <span>{new Date(selectedMonth.year, selectedMonth.month).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              
              <h2 className={styles.sectionTitle}>Recent activities</h2>
              <p className={styles.currentBalance}>
                Your current balance is <span className={styles.balanceAmount}>{formatCurrency(runningBalance)}</span>.
              </p>
              
              <div className={styles.statementsTableWrapper}>
                <table className={styles.statementsTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Fee and tax</th>
                      <th>Net</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>
                          <div className={styles.statementDateCell}>
                            {transaction.type === 'Deposit' ? (
                              <FaExchangeAlt className={styles.statementIcon} />
                            ) : (
                              <FaImage className={styles.statementIcon} />
                            )}
                            <span>{transaction.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </td>
                        <td>{transaction.type}</td>
                        <td>
                          {transaction.type === 'Deposit' ? (
                            transaction.description
                          ) : (
                            <div className={styles.statementDescription}>
                              <div>Transaction fee: {transaction.serviceName}</div>
                              <a href="#" className={styles.orderLink}>Order #{transaction.bookingId?.slice(0, 10) || ''}</a>
                              <div>6.5% of item total</div>
                            </div>
                          )}
                        </td>
                        <td>{transaction.amount || '--'}</td>
                        <td className={transaction.fee < 0 ? styles.negativeAmount : ''}>
                          {transaction.fee !== 0 ? formatCurrency(transaction.fee) : ''}
                        </td>
                        <td className={transaction.net < 0 ? styles.negativeAmount : ''}>
                          {transaction.net !== 0 ? formatCurrency(transaction.net) : ''}
                        </td>
                        <td>{formatCurrency(transaction.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        
        // Monthly statements list view
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Monthly statements</h2>
            
            <div className={styles.statementsYearSelector}>
              <select 
                className={styles.yearDropdown}
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.statementsList}>
              <h3 className={styles.monthHeading}>Month</h3>
              {filteredStatements.length === 0 ? (
                <div className={styles.placeholderText}>
                  <p>No statements available for {selectedYear}.</p>
                </div>
              ) : (
                filteredStatements.map((statement, index) => {
                  const monthName = new Date(statement.year, statement.month).toLocaleString('en-US', { month: 'long', year: 'numeric' });
                  return (
                    <div key={`${statement.year}-${statement.month}`}>
                      <button
                        className={styles.statementMonthLink}
                        onClick={() => setSelectedMonth({ year: statement.year, month: statement.month })}
                      >
                        {monthName}
                      </button>
                      {index < filteredStatements.length - 1 && <hr className={styles.statementDivider} />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payments & Earnings</h2>
            {loading ? (
              <div className={styles.placeholderText}>
                <p>Loading payments data...</p>
              </div>
            ) : (
              <>
                <div className={styles.earningsCards}>
                  <div className={styles.earningsCard}>
                    <div className={styles.earningsCardIcon}>
                      <FaDollarSign />
                    </div>
                    <div className={styles.earningsCardContent}>
                      <h3>Total Earnings</h3>
                      <p className={styles.earningsAmount}>{formatCurrency(earningsSummary.totalEarnings)}</p>
                      <span className={styles.earningsSubtext}>{earningsSummary.totalBookings} total bookings</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.earningsCard} ${styles.earningsCardSuccess}`}>
                    <div className={styles.earningsCardIcon}>
                      <FaCheckCircle />
                    </div>
                    <div className={styles.earningsCardContent}>
                      <h3>Paid Earnings</h3>
                      <p className={styles.earningsAmount}>{formatCurrency(earningsSummary.paidEarnings)}</p>
                      <span className={styles.earningsSubtext}>{earningsSummary.paidBookings} paid bookings</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.earningsCard} ${styles.earningsCardPending}`}>
                    <div className={styles.earningsCardIcon}>
                      <FaClock />
                    </div>
                    <div className={styles.earningsCardContent}>
                      <h3>Pending Earnings</h3>
                      <p className={styles.earningsAmount}>{formatCurrency(earningsSummary.pendingEarnings)}</p>
                      <span className={styles.earningsSubtext}>{earningsSummary.pendingBookings} unpaid bookings</span>
                    </div>
                  </div>
                </div>

                {earningsSummary.totalBookings === 0 && (
                  <div className={styles.placeholderText}>
                    <p>No bookings yet. Earnings will appear here once you have completed bookings.</p>
                  </div>
                )}
              </>
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
