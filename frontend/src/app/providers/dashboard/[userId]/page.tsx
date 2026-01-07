'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { 
  FaStar, FaReply, FaLink, FaEdit, FaCreditCard, 
  FaCalendarAlt, FaCalendar, FaUsers, FaDollarSign, 
  FaChartLine, FaEnvelope, FaUser, FaCog, FaSignOutAlt,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Providers/Dashboard.module.scss';

// Dashboard sections
import Bookings from '@/components/Providers/Dashboard/Bookings';
// SPACES FEATURE - COMMENTED OUT FOR MVP
// import Spaces from '@/components/Providers/Dashboard/Spaces';
import Calendar from '@/components/Providers/Dashboard/Calendar';
import Clients from '@/components/Providers/Dashboard/Clients';
import Payments from '@/components/Providers/Dashboard/Payments';
import Stats from '@/components/Providers/Dashboard/Stats';
import Messages from '@/components/Providers/Dashboard/Messages';
import Profile from '@/components/Providers/Dashboard/Profile';
import ChangePlanModal from '@/components/Providers/Dashboard/ChangePlanModal';
import UpdatePaymentMethodModal from '@/components/Providers/Dashboard/UpdatePaymentMethodModal';
import UpdatePaymentMethodModalStripe from '@/components/Providers/Dashboard/UpdatePaymentMethodModalStripe';
import UpdateBillingAddressModal from '@/components/Providers/Dashboard/UpdateBillingAddressModal';
import ChangePasswordModal from '@/components/Providers/Dashboard/ChangePasswordModal';
import UpdateEmailModal from '@/components/Providers/Dashboard/UpdateEmailModal';
import TwoFactorSettings from '@/components/Providers/Dashboard/TwoFactorSettings';

function ProvidersDashboardContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.userId as string;

  // Handle OAuth token from URL hash or query params (Google sign-in)
  useEffect(() => {
    // Check hash fragment first (new method to avoid HTTP 431)
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const hashData = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
        if (hashData.token) {
          localStorage.setItem('token', hashData.token);
          if (hashData.user) {
            localStorage.setItem('user', JSON.stringify(hashData.user));
          }
          // If profile needs completion, set URL params
          if (hashData.complete_profile) {
            const section = hashData.section || 'profile';
            router.replace(`/providers/dashboard/${userId}?complete_profile=true&section=${section}`);
          } else {
            // Remove hash from URL
            router.replace(`/providers/dashboard/${userId}`);
          }
          return;
        }
      } catch (error) {
        console.error('Error parsing hash data:', error);
      }
    }
    
    // Fallback to query params (old method)
    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    const completeProfile = searchParams.get('complete_profile');
    if (token) {
      localStorage.setItem('token', decodeURIComponent(token));
      if (userData) {
        localStorage.setItem('user', decodeURIComponent(userData));
      }
      // If profile needs completion, keep the section parameter
      if (completeProfile === 'true') {
        const section = searchParams.get('section') || 'profile';
        router.replace(`/providers/dashboard/${userId}?complete_profile=true&section=${section}`);
      } else {
        // Remove token from URL
        router.replace(`/providers/dashboard/${userId}`);
      }
    }
  }, [searchParams, userId, router]);
  
  // Check URL parameters for section
  const initialSection = searchParams.get('section') || 'bookings';
  const needsProfileCompletion = searchParams.get('complete_profile') === 'true';
  const [activeSection, setActiveSection] = useState(needsProfileCompletion ? 'profile' : initialSection);
  const [activeSubmenu, setActiveSubmenu] = useState(
    initialSection === 'profile' ? 'basic' : 
    initialSection === 'stats' ? 'traffic' :
    initialSection === 'messages' ? 'notifications' :
    initialSection === 'settings' ? 'account' :
    'requests'
  );
  const [activeCommunicationSubmenu, setActiveCommunicationSubmenu] = useState('inbox');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('Loading...');
  const [providerRating, setProviderRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [subscriptionData, setSubscriptionData] = useState<{
    plan: string;
    billingCycle: string;
    price: number;
    nextPaymentDate: string | null;
  } | null>(null);
  const [billingHistory, setBillingHistory] = useState<Array<{
    date: string;
    amount: number;
    plan: string;
    billingCycle: string;
    status: string;
  }>>([]);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [savedPaymentMethod, setSavedPaymentMethod] = useState<{
    cardNumber: string;
    expiryDate: string;
    last4?: string;
    cardType?: string;
    nameOnCard?: string;
    billingAddress?: {
      nameOnCard?: string;
      email?: string;
      address?: string;
      city?: string;
      stateProvince?: string;
      postalCode?: string;
      country?: string;
    };
  } | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showUpdateBillingAddressModal, setShowUpdateBillingAddressModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent password manager detection
  useEffect(() => {
    // Add attributes to prevent password managers from detecting forms
    const preventPasswordManager = () => {
      // Add data attributes to all input fields in subscription and billing sections
      const sections = document.querySelectorAll('[data-1p-ignore]');
      sections.forEach(section => {
        const inputs = section.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          if (!input.hasAttribute('data-1p-ignore')) {
            input.setAttribute('data-1p-ignore', 'true');
            input.setAttribute('data-lpignore', 'true');
            input.setAttribute('data-form-type', 'other');
            input.setAttribute('autocomplete', 'off');
          }
        });
      });
    };

    preventPasswordManager();
    // Re-run when section changes
    const interval = setInterval(preventPasswordManager, 1000);
    return () => clearInterval(interval);
  }, [activeSection, activeSubmenu]);

  useEffect(() => {
    const loadUserData = async () => {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        // Clear any remaining state and redirect
        setLoading(false);
        router.replace('/providers/login');
        return;
      }
      
      // Validate token with backend
      try {
        const verifyResponse = await fetch('http://localhost:4000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!verifyResponse.ok) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoading(false);
          router.replace('/providers/login');
          return;
        }
      } catch (verifyError) {
        // Network error or token validation failed
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        router.replace('/providers/login');
        return;
      }
      
      let handleProfileUpdate: (() => void) | null = null;
      
      try {
        const userData = JSON.parse(user);
        // Verify the userId matches the logged-in user
        if (userData.id !== userId) {
          console.error('User ID mismatch');
          router.push('/providers/login');
          return;
        }
        
        // Verify user is a provider
        if (userData.user_type !== 'provider') {
          router.push('/providers/login');
          return;
        }

      // Set provider name from profile
      const updateProviderName = () => {
        if (userData.profile?.contact_name) {
          setProviderName(userData.profile.contact_name);
        } else if (userData.profile?.business_name) {
          setProviderName(userData.profile.business_name);
        } else if (userData.email) {
          setProviderName(userData.email.split('@')[0]);
        }
      };
      
      updateProviderName();
      
      // Function to generate billing history
      // Only show today's payment since this function was just implemented
      const generateBillingHistory = (plan: string, billingCycle: string, price: number, nextPaymentDate: string) => {
        try {
          const history: Array<{
            date: string;
            amount: number;
            plan: string;
            billingCycle: string;
            status: string;
          }> = [];
          
          // Validate nextPaymentDate
          if (!nextPaymentDate) {
            console.warn('No nextPaymentDate provided for billing history');
            setBillingHistory([]);
            return;
          }
          
          // Show today's payment (the initial payment when subscription was created)
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to start of day
          
          // Add today's payment
          history.push({
            date: today.toISOString(),
            amount: price,
            plan: plan.charAt(0).toUpperCase() + plan.slice(1),
            billingCycle: billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1),
            status: 'Paid'
          });
          
          console.log('Generated billing history:', history);
          
          setBillingHistory(history);
        } catch (error) {
          console.error('Error generating billing history:', error);
          setBillingHistory([]);
        }
      };
      
      // Fetch subscription data from backend (always fetch to ensure it's up-to-date)
      try {
        const token = localStorage.getItem('token');
        const subscriptionResponse = await fetch(`http://localhost:4000/api/providers/${userId}/subscription`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (subscriptionResponse.ok) {
          const subscriptionResult = await subscriptionResponse.json();
          
          if (subscriptionResult.subscription) {
            const subscription = subscriptionResult.subscription;
            const plan = subscription.plan || 'essential';
            const billingCycle = subscription.billingCycle || 'monthly';
            const price = subscription.price !== undefined ? subscription.price : (plan === 'essential' ? 0 : 49);
            
            // Always recalculate next payment date from today (same day next month/year)
            // This ensures the date is always correct and up-to-date
            const today = new Date();
            const nextPaymentDateObj = new Date(today);
            
            if (billingCycle === 'yearly') {
              nextPaymentDateObj.setFullYear(nextPaymentDateObj.getFullYear() + 1);
            } else {
              nextPaymentDateObj.setMonth(nextPaymentDateObj.getMonth() + 1);
            }
            
            const nextPaymentDate = nextPaymentDateObj.toISOString();
            
            // Update localStorage with subscription data from database
            const updatedUser = {
              ...userData,
              subscription: {
                plan,
                billingCycle,
                price,
                nextPaymentDate: nextPaymentDate
              }
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setSubscriptionData({
              plan,
              billingCycle,
              price,
              nextPaymentDate,
            });
            
            // Generate billing history from subscription data
            generateBillingHistory(plan, billingCycle, price, nextPaymentDate);
          } else {
            // If no subscription data in database, check localStorage as fallback
            if (userData.subscription) {
              const plan = userData.subscription.plan || 'essential';
              const billingCycle = userData.subscription.billingCycle || 'monthly';
              const price = userData.subscription.price !== undefined ? userData.subscription.price : (plan === 'essential' ? 0 : 49);
              
              const today = new Date();
              const nextPaymentDateObj = new Date(today);
              
              if (billingCycle === 'yearly') {
                nextPaymentDateObj.setFullYear(nextPaymentDateObj.getFullYear() + 1);
              } else {
                nextPaymentDateObj.setMonth(nextPaymentDateObj.getMonth() + 1);
              }
              
              const nextPaymentDate = nextPaymentDateObj.toISOString();
              
              setSubscriptionData({
                plan,
                billingCycle,
                price,
                nextPaymentDate,
              });
              
              generateBillingHistory(plan, billingCycle, price, nextPaymentDate);
            } else {
              setBillingHistory([]);
            }
          }
        } else {
          // If API call fails, fall back to localStorage
          if (userData.subscription) {
            const plan = userData.subscription.plan || 'professional';
            const billingCycle = userData.subscription.billingCycle || 'monthly';
            const price = userData.subscription.price || 49;
            
            const today = new Date();
            const nextPaymentDateObj = new Date(today);
            
            if (billingCycle === 'yearly') {
              nextPaymentDateObj.setFullYear(nextPaymentDateObj.getFullYear() + 1);
            } else {
              nextPaymentDateObj.setMonth(nextPaymentDateObj.getMonth() + 1);
            }
            
            const nextPaymentDate = nextPaymentDateObj.toISOString();
            
            setSubscriptionData({
              plan,
              billingCycle,
              price,
              nextPaymentDate,
            });
            
            generateBillingHistory(plan, billingCycle, price, nextPaymentDate);
          } else {
            setBillingHistory([]);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        // Fall back to localStorage if API call fails
        if (userData.subscription) {
          const plan = userData.subscription.plan || 'professional';
          const billingCycle = userData.subscription.billingCycle || 'monthly';
          const price = userData.subscription.price || 49;
          
          const today = new Date();
          const nextPaymentDateObj = new Date(today);
          
          if (billingCycle === 'yearly') {
            nextPaymentDateObj.setFullYear(nextPaymentDateObj.getFullYear() + 1);
          } else {
            nextPaymentDateObj.setMonth(nextPaymentDateObj.getMonth() + 1);
          }
          
          const nextPaymentDate = nextPaymentDateObj.toISOString();
          
          setSubscriptionData({
            plan,
            billingCycle,
            price,
            nextPaymentDate,
          });
          
          generateBillingHistory(plan, billingCycle, price, nextPaymentDate);
        } else {
          setBillingHistory([]);
        }
      }
      
      // Load payment method if available
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const paymentResponse = await fetch(`http://localhost:4000/api/providers/${userId}/payment-method`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            if (paymentData.paymentMethod) {
              setSavedPaymentMethod({
                cardNumber: paymentData.paymentMethod.cardNumber || '',
                expiryDate: paymentData.paymentMethod.expiryDate || '',
                last4: paymentData.paymentMethod.last4 || '',
                cardType: paymentData.paymentMethod.cardType || 'Visa',
                nameOnCard: paymentData.paymentMethod.nameOnCard || '',
                billingAddress: paymentData.paymentMethod.billingAddress || {}
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading payment method:', error);
        // Don't block the page if payment method loading fails
      }
      
      // Load profile image if available
      if (userData.profile?.profile_photo_url) {
        setProfileImage(userData.profile.profile_photo_url);
      }

      // Listen for profile updates
      handleProfileUpdate = () => {
        const updatedUser = localStorage.getItem('user');
        if (updatedUser) {
          try {
            const updatedUserData = JSON.parse(updatedUser);
            if (updatedUserData.profile?.contact_name) {
              setProviderName(updatedUserData.profile.contact_name);
            } else if (updatedUserData.profile?.business_name) {
              setProviderName(updatedUserData.profile.business_name);
            }
            if (updatedUserData.profile?.profile_photo_url) {
              setProfileImage(updatedUserData.profile.profile_photo_url);
            }
          } catch (error) {
            console.error('Error updating provider name:', error);
          }
        }
      };

      window.addEventListener('profileUpdated', handleProfileUpdate);
      
      setLoading(false);

      // Cleanup listener on unmount
      return () => {
        if (handleProfileUpdate) {
          window.removeEventListener('profileUpdated', handleProfileUpdate);
        }
      };
      } catch (error) {
        console.error('Error parsing user data:', error);
        console.error('User data from localStorage:', user);
        // Clear potentially corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/providers/login');
        return;
      }
    };

    loadUserData();
  }, [userId, router]);

  // Load pending requests count
  useEffect(() => {
    let isMounted = true;
    
    const loadPending = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId || !isMounted) return;
        const resp = await fetch(`http://localhost:4000/api/bookings/provider/${userId}/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok && isMounted) {
          const data = await resp.json();
          setPendingRequests(Array.isArray(data) ? data.length : 0);
        }
      } catch (e) {
        if (isMounted) {
          setPendingRequests(0);
        }
      }
    };

    loadPending();

    const refresh = () => {
      if (isMounted) {
        loadPending();
      }
    };
    window.addEventListener('refreshBookings', refresh);
    return () => {
      isMounted = false;
      window.removeEventListener('refreshBookings', refresh);
    };
  }, [userId]);

  // Load unread notifications count
  useEffect(() => {
    let isMounted = true;
    
    const loadUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId || !isMounted) return;
        const resp = await fetch('http://localhost:4000/api/notifications/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok && isMounted) {
          const data = await resp.json();
          setUnreadNotifications(data.count || 0);
        }
      } catch (e) {
        if (isMounted) {
          setUnreadNotifications(0);
        }
      }
    };

    loadUnreadNotifications();

    // Refresh notifications when bookings are updated (might include notification triggers)
    const refresh = () => {
      if (isMounted) {
        loadUnreadNotifications();
      }
    };
    window.addEventListener('refreshBookings', refresh);
    
    // Also listen for notification updates
    const refreshNotifications = () => {
      if (isMounted) {
        loadUnreadNotifications();
      }
    };
    window.addEventListener('refreshNotifications', refreshNotifications);
    
    return () => {
      isMounted = false;
      window.removeEventListener('refreshBookings', refresh);
      window.removeEventListener('refreshNotifications', refreshNotifications);
    };
  }, [userId]);

  // Load provider stats (reviews, services, bookings)
  useEffect(() => {
    const loadProviderStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;
        
        // Load reviews for rating
        const reviewsResponse = await fetch(`http://localhost:4000/api/reviews/provider/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (reviewsResponse.ok) {
          const reviews = await reviewsResponse.json();
          if (Array.isArray(reviews) && reviews.length > 0) {
            const avg = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
            setProviderRating(avg);
            setTotalReviews(reviews.length);
          } else {
            setProviderRating(null);
            setTotalReviews(0);
          }
        }
        
        // Load provider profile to get services count
        const providerResponse = await fetch(`http://localhost:4000/api/providers/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (providerResponse.ok) {
          const providerData = await providerResponse.json();
          if (providerData.services && Array.isArray(providerData.services)) {
            // Filter out empty services
            const validServices = providerData.services.filter((s: any) => 
              s && s.name && s.name.trim() !== ''
            );
            setServicesCount(validServices.length);
          } else {
            setServicesCount(0);
          }
        }
        
        // Load bookings to get total count
        const bookingsResponse = await fetch(`http://localhost:4000/api/bookings/provider/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (bookingsResponse.ok) {
          const bookings = await bookingsResponse.json();
          if (Array.isArray(bookings)) {
            setTotalBookings(bookings.length);
          } else {
            setTotalBookings(0);
          }
        }
        
        // Set profile URL
        if (typeof window !== 'undefined') {
          const baseUrl = window.location.origin;
          setProfileUrl(`${baseUrl}/search/${userId}`);
        }
      } catch (error) {
        console.error('Error loading provider stats:', error);
      }
    };
    
    loadProviderStats();
  }, [userId]);

  // Load unread messages count
  useEffect(() => {
    let isMounted = true;
    
    const loadUnreadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId || !isMounted) return;
        const resp = await fetch('http://localhost:4000/api/messages/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok && isMounted) {
          const data = await resp.json();
          setUnreadMessages(data.count || 0);
        }
      } catch (e) {
        if (isMounted) {
          setUnreadMessages(0);
        }
      }
    };

    loadUnreadMessages();

    // Poll for unread messages every 10 seconds
    const pollInterval = setInterval(() => {
      if (isMounted) {
        loadUnreadMessages();
      }
    }, 10000); // Check every 10 seconds

    // Refresh messages when bookings are updated
    const refresh = () => {
      if (isMounted) {
        loadUnreadMessages();
      }
    };
    window.addEventListener('refreshBookings', refresh);

    // Also listen for message updates
    const refreshMessages = () => {
      if (isMounted) {
        loadUnreadMessages();
      }
    };
    window.addEventListener('refreshMessages', refreshMessages);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('refreshBookings', refresh);
      window.removeEventListener('refreshMessages', refreshMessages);
    };
  }, [userId]);

  // Allow children to request submenu switch (e.g., after accepting a booking)
  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.submenu) setActiveSubmenu(e.detail.submenu);
    };
    window.addEventListener('switchSubmenu', handler);
    return () => window.removeEventListener('switchSubmenu', handler);
  }, []);

  // Handle section switching (e.g., from bookings to messages)
  useEffect(() => {
    const sectionHandler = (e: any) => {
      if (e?.detail?.section) {
        setActiveSection(e.detail.section);
        if (e?.detail?.submenu) {
          setActiveSubmenu(e.detail.submenu);
        } else {
          // Get submenu items dynamically
          const submenuItems = {
            bookings: [{ id: 'requests' }],
            // SPACES FEATURE - COMMENTED OUT FOR MVP
            // spaces: [{ id: 'upcoming' }],
            calendar: [{ id: 'overview' }],
            clients: [{ id: 'directory' }],
            payments: [{ id: 'balance' }],
            stats: [{ id: 'traffic' }],
            messages: [{ id: 'notifications' }, { id: 'inbox' }, { id: 'starred' }, { id: 'sent' }, { id: 'trash' }],
            profile: [{ id: 'basic' }],
            settings: [{ id: 'account' }],
          };
          const firstSubmenu = submenuItems[e.detail.section as keyof typeof submenuItems]?.[0];
          setActiveSubmenu(firstSubmenu?.id || e.detail.section);
        }
      }
    };
    window.addEventListener('switchSection', sectionHandler);
    return () => window.removeEventListener('switchSection', sectionHandler);
  }, []);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        setProfileImage(imageDataUrl);
        
        // Save to localStorage
        try {
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            if (userData.profile) {
              userData.profile.profile_photo_url = imageDataUrl;
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        } catch (error) {
          console.error('Error saving profile image to localStorage:', error);
        }
        
        // Save to database
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                profile_photo_url: imageDataUrl
              })
            });
            
            if (!response.ok) {
              console.error('Failed to save profile image to database');
            } else {
              console.log('Profile image saved successfully to database');
            }
          }
        } catch (error) {
          console.error('Error saving profile image to database:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarItems = [
    { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
    // SPACES FEATURE - COMMENTED OUT FOR MVP
    // { id: 'spaces', label: 'Space Rentals' },
    { id: 'calendar', label: 'Calendar', icon: FaCalendar },
    { id: 'clients', label: 'Clients', icon: FaUsers },
    { id: 'payments', label: 'Payments & Earnings', icon: FaDollarSign },
    { id: 'stats', label: 'Stats', icon: FaChartLine },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
    { id: 'profile', label: 'Profile & Services', icon: FaUser },
    { id: 'settings', label: 'Account Settings', icon: FaCog },
  ];

  const signOutItem = { id: 'signout', label: 'Sign Out', icon: FaSignOutAlt };

  const submenuItems = {
    bookings: [
      { id: 'requests', label: 'Requests' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'past', label: 'Past' },
      { id: 'canceled', label: 'Canceled' },
    ],
    // SPACES FEATURE - COMMENTED OUT FOR MVP
    // spaces: [
    //   { id: 'upcoming', label: 'Upcoming Bookings' },
    //   { id: 'favorites', label: 'Saved Spaces' },
    //   { id: 'past', label: 'Past Bookings' },
    //   { id: 'request', label: 'Request a Space' },
    //   { id: 'find', label: 'Find a Space' },
    // ],
    calendar: [
      { id: 'overview', label: 'Calendar Overview' },
      { id: 'sync', label: 'Sync with Google/Apple Calendar' },
    ],
    clients: [
      { id: 'directory', label: 'Client Directory' },
      { id: 'notes', label: 'Notes & Preferences' },
    ],
    payments: [
      { id: 'balance', label: 'Balance Overview' },
      { id: 'payouts', label: 'Payouts' },
      { id: 'reports', label: 'Reports' },
      { id: 'statements', label: 'Monthly Statements' },
    ],
    stats: [
      { id: 'traffic', label: 'Traffic' },
      { id: 'bookings', label: 'Bookings' },
      { id: 'reviews', label: 'Reviews' },
    ],
    messages: [
      { id: 'notifications', label: 'Notifications' },
      { id: 'communication', label: 'Client Communication' },
    ],
    profile: [
      { id: 'basic', label: 'Basic Information' },
      { id: 'preferences', label: 'Preferences' },
      { id: 'services', label: 'Services' },
      { id: 'availability', label: 'Availability' },
      { id: 'certifications', label: 'Certifications' },
    ],
    settings: [
      { id: 'account', label: 'Account Information' },
      { id: 'subscription', label: 'Subscription' },
      { id: 'billing', label: 'Billing' },
    ],
  };

  // Helper function to get plan name - used in both subscription and billing sections
  const getPlanName = (plan: string) => {
    switch(plan) {
      case 'essential': return 'Essential Plan';
      case 'professional': return 'Professional Plan';
      case 'growth': return 'Growth+ Plan';
      default: return 'Professional Plan';
    }
  };

  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    const result = await Swal.fire({
      title: 'Cancel Subscription?',
      text: 'Are you sure you want to cancel your subscription? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it'
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsCancellingSubscription(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`http://localhost:4000/api/providers/${userId}/subscription`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to cancel subscription');
      }

      // Set subscription to Essential (free) plan
      const essentialPlanData = {
        plan: 'essential',
        billingCycle: 'monthly',
        price: 0,
        nextPaymentDate: null
      };
      setSubscriptionData(essentialPlanData);
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...userData,
        subscription: essentialPlanData
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      await Swal.fire({
        title: 'Cancelled!',
        text: 'Your subscription has been cancelled successfully.',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
      
      // Close the Change Plan modal
      setShowChangePlanModal(false);
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to cancel subscription',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'bookings':
        return <Bookings activeSubmenu={activeSubmenu} />;
      // SPACES FEATURE - COMMENTED OUT FOR MVP
      // case 'spaces':
      //   return <Spaces activeSubmenu={activeSubmenu} />;
      case 'calendar':
        return <Calendar activeSubmenu={activeSubmenu} />;
      case 'clients':
        return <Clients activeSubmenu={activeSubmenu} />;
      case 'payments':
        return <Payments activeSubmenu={activeSubmenu} />;
      case 'stats':
        return <Stats activeSubmenu={activeSubmenu} />;
      case 'messages':
        return <Messages activeSubmenu={activeSubmenu === 'communication' ? activeCommunicationSubmenu : activeSubmenu} userId={userId} />;
      case 'profile':
        return (
          <>
            {needsProfileCompletion && (
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                    Complete Your Profile
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    Please fill in your phone number, address, and business information to start accepting bookings.
                  </p>
                </div>
              </div>
            )}
            <Profile activeSubmenu={activeSubmenu} />
          </>
        );
      case 'settings':
        const user = localStorage.getItem('user');
        const userData = user ? JSON.parse(user) : null;
        const profile = userData?.profile || {};
        const email = userData?.email || '';
        
        // Render different settings submenus
        return (() => {
          switch (activeSubmenu) {
            case 'account':
              return (
              <div className={styles.dashboardSection} data-1p-ignore="true" data-lpignore="true" data-form-type="other" autoComplete="off">
                <h2 className={styles.sectionTitle}>Account Information</h2>
                
                <div className={styles.settingsForm} data-1p-ignore="true" data-lpignore="true">
                  <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Address</label>
                      <div className={`${styles.formRowFlex} ${styles.accountInfoRow}`} data-1p-ignore="true" data-lpignore="true">
                        <input 
                          type="text" 
                          className={`${styles.formInput} ${styles.formInputFlex} ${styles.formInputDisabled} ${styles.accountInfoInput}`} 
                          value={email} 
                          disabled
                          data-1p-ignore="true"
                          data-lpignore="true"
                          data-form-type="other"
                          autoComplete="off"
                          readOnly
                        />
                        <button 
                          className={styles.secondaryBtn}
                          onClick={() => setShowUpdateEmailModal(true)}
                        >
                          Update Email
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Password</label>
                      <div className={`${styles.formRowFlex} ${styles.accountInfoRow}`} data-1p-ignore="true" data-lpignore="true">
                        <input 
                          type="text" 
                          className={`${styles.formInput} ${styles.formInputFlex} ${styles.formInputDisabled} ${styles.accountInfoInput}`}
                          defaultValue="••••••••" 
                          disabled
                          data-1p-ignore="true"
                          data-lpignore="true"
                          data-form-type="other"
                          autoComplete="off"
                          readOnly
                        />
                        <button 
                          className={styles.secondaryBtn}
                          onClick={() => setShowChangePasswordModal(true)}
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Google Authenticator (2FA) Section */}
                  <div style={{ marginTop: '40px' }}>
                    <TwoFactorSettings userId={userId} />
                  </div>
                </div>
              </div>
            );

            case 'subscription': {
              const getPlanFeatures = (plan: string) => {
              switch(plan) {
                case 'essential':
                  return [
                    'Up to 50 clients',
                    'Basic scheduling',
                    'Client management',
                    'Email support'
                  ];
                case 'professional':
                  return [
                    'Up to 200 clients',
                    'Advanced scheduling',
                    'Staff management',
                    'Marketing tools',
                    'Priority support'
                  ];
                case 'growth':
                  return [
                    'Unlimited clients',
                    'All features',
                    'API access',
                    'Custom integrations',
                    'Dedicated support'
                  ];
                default:
                  return [];
              }
            };

              const formatDate = (dateString: string | null) => {
              if (!dateString) return '';
              try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              } catch {
                return '';
              }
            };

              return (
                <div className={styles.dashboardSection} data-1p-ignore="true" data-lpignore="true" data-form-type="other" autoComplete="off">
                  <h2 className={styles.sectionTitle}>Subscription</h2>
                
                <div className={styles.subscriptionContainer} data-1p-ignore="true" data-lpignore="true">
                  {/* Current Plan Card */}
                  <div className={styles.subscriptionCard}>
                    <div className={styles.subscriptionCardHeader}>
                      <div className={styles.subscriptionCardTitle}>
                        <h3>Current Plan</h3>
                        <span className={styles.activeBadge}>Active</span>
                      </div>
                    </div>
                    <div className={styles.subscriptionCardBody}>
                      <div className={styles.planDetails}>
                        <div className={styles.planNameLarge}>
                          {subscriptionData ? getPlanName(subscriptionData.plan) : 'Essential Plan'}
                        </div>
                        <div className={styles.planPriceLarge}>
                          {subscriptionData ? (
                            subscriptionData.price === 0 ? (
                              'Free'
                            ) : (
                              <>
                                ${subscriptionData.price}
                                <span className={styles.planPeriod}>
                                  /{subscriptionData.billingCycle === 'yearly' ? 'month' : 'month'}
                                </span>
                              </>
                            )
                          ) : (
                            'Free'
                          )}
                        </div>
                      </div>
                      <div className={styles.planFeatures}>
                        {subscriptionData && getPlanFeatures(subscriptionData.plan).map((feature, index) => (
                          <div key={index} className={styles.planFeature}>
                            <span className={styles.featureCheck}>✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Next Payment Card */}
                  <div className={styles.subscriptionCard}>
                    <div className={styles.subscriptionCardHeader}>
                      <h3>Next Payment</h3>
                    </div>
                    <div className={styles.subscriptionCardBody}>
                      <div className={styles.paymentInfo}>
                        <div className={styles.paymentDateLarge}>
                          {subscriptionData && subscriptionData.nextPaymentDate 
                            ? formatDate(subscriptionData.nextPaymentDate)
                            : '—'}
                        </div>
                        <div className={styles.paymentAmountLarge}>
                          {subscriptionData && subscriptionData.price > 0
                            ? `$${subscriptionData.price.toFixed(2)}`
                            : '—'}
                        </div>
                      </div>
                      <p className={styles.paymentDescription}>Your subscription will automatically renew on this date</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.subscriptionActions}>
                    <button 
                      className={styles.changePlanBtn}
                      onClick={() => setShowChangePlanModal(true)}
                    >
                      Change Plan
                    </button>
                  </div>
                </div>
              </div>
              );
            }
            
            case 'billing': {
              const formatBillingDate = (dateString: string | null) => {
                if (!dateString) return '';
                try {
                  const date = new Date(dateString);
                  return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                } catch {
                  return '';
                }
              };

              return (
                <div className={styles.dashboardSection}>
                  <h2 className={styles.sectionTitle}>Billing</h2>
                
                {/* Billing Address Section */}
                <div className={styles.billingAddressSection}>
                  <div className={styles.billingAddressHeader}>
                    <div className={styles.billingAddressTitle}>
                      <span className={styles.billingSectionLabel}>BILLING ADDRESS</span>
                      <button 
                        className={styles.editBillingBtn}
                        onClick={() => setShowUpdateBillingAddressModal(true)}
                        aria-label="Edit billing address"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                  <div className={styles.billingAddressContent}>
                    <div className={styles.billingAddressFields}>
                    <div className={styles.billingField}>
                      <span className={styles.billingFieldValue}>
                        {savedPaymentMethod?.nameOnCard || savedPaymentMethod?.billingAddress?.nameOnCard || ''}
                      </span>
                    </div>
                    <div className={styles.billingField}>
                      <span className={styles.billingFieldValue}>
                        {savedPaymentMethod?.billingAddress?.address || ''}
                      </span>
                    </div>
                    {savedPaymentMethod?.billingAddress?.addressLine2 && (
                      <div className={styles.billingField}>
                        <span className={styles.billingFieldValue}>
                          {savedPaymentMethod.billingAddress.addressLine2}
                        </span>
                      </div>
                    )}
                    <div className={styles.billingField}>
                      <span className={styles.billingFieldValue}>
                        {[
                          savedPaymentMethod?.billingAddress?.city || '',
                          savedPaymentMethod?.billingAddress?.stateProvince || '',
                          savedPaymentMethod?.billingAddress?.postalCode || ''
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div className={styles.billingField}>
                      <span className={styles.billingFieldValue}>
                        {savedPaymentMethod?.billingAddress?.country || ''}
                      </span>
                    </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className={styles.paymentMethodSection}>
                  <div className={styles.paymentMethodHeader}>
                    <span className={styles.billingSectionLabel}>PAYMENT</span>
                    <button 
                      className={styles.editPaymentBtn}
                      onClick={() => setShowUpdatePaymentModal(true)}
                      aria-label="Edit payment method"
                    >
                      <FaEdit />
                    </button>
                  </div>
                  <div className={styles.paymentMethodContent}>
                    {savedPaymentMethod ? (
                      <div className={styles.paymentMethodDisplay}>
                        <FaCreditCard className={styles.cardIcon} />
                        <span className={styles.cardType}>{savedPaymentMethod.cardType || 'Visa'}</span>
                        <span className={styles.cardEnding}>ending in</span>
                        <span className={styles.cardLast4}>{savedPaymentMethod.last4 || savedPaymentMethod.cardNumber.replace(/\D/g, '').slice(-4)}</span>
                        {savedPaymentMethod.expiryDate && (
                          <>
                            <span className={styles.cardSeparator}>•</span>
                            <span className={styles.cardExpiry}>Expires {savedPaymentMethod.expiryDate}</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className={styles.noPaymentMethod}>
                        No payment method on file
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment History Section */}
                <div className={styles.paymentHistorySection} data-1p-ignore="true" data-lpignore="true">
                  <div className={styles.paymentHistoryHeader}>
                    <span className={styles.billingSectionLabel}>PAYMENT HISTORY</span>
                  </div>
                  <div className={styles.paymentHistoryContent}>
                    <div className={styles.paymentHistoryList}>
                      {billingHistory.length > 0 ? (
                        billingHistory.map((payment, index) => (
                          <div key={index} className={styles.paymentHistoryItem}>
                            <div className={styles.paymentHistoryField}>
                              <span className={styles.paymentHistoryValue}>
                                <span className={`${styles.paymentStatusIndicator} ${payment.status === 'Paid' ? styles.paymentStatusPaid : styles.paymentStatusPending}`}></span>
                                {payment.status === 'Paid' ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                            <div className={styles.paymentHistoryField}>
                              <span className={styles.paymentHistoryValue}>
                                {formatBillingDate(payment.date)}
                              </span>
                            </div>
                            <div className={styles.paymentHistoryField}>
                              <span className={styles.paymentHistoryValue}>
                                {payment.billingCycle || 'Monthly'}
                              </span>
                            </div>
                            <div className={styles.paymentHistoryField}>
                              <span className={styles.paymentHistoryValue}>
                                ${payment.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={styles.noPaymentHistory}>No payment history available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              );
            }
            
            default:
              return (
                <div className={styles.dashboardSection}>
                  <h2 className={styles.sectionTitle}>Account Settings</h2>
                  <div className={styles.placeholderText}>
                    <p>Select a settings option from the submenu above.</p>
                  </div>
                </div>
              );
          }
        })();
      default:
        return <Bookings activeSubmenu={activeSubmenu} />;
    }
  };

  if (loading) {
    return (
      <div className={styles.centeredContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Left Sidebar */}
      <div className={`${styles.sidebar} ${sidebarExpanded ? styles.expanded : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <button 
            className={styles.toggleButton}
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label="Toggle sidebar"
          >
            {sidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        
        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`${styles.sidebarItem} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  const firstSubmenu = submenuItems[item.id as keyof typeof submenuItems]?.[0];
                  setActiveSubmenu(firstSubmenu?.id || item.id);
                }}
                title={sidebarExpanded ? '' : item.label}
              >
                <IconComponent className={styles.sidebarIcon} />
                {sidebarExpanded && (
                  <>
                    <span className={styles.sidebarLabel}>{item.label}</span>
                    {item.id === 'messages' && (unreadNotifications + unreadMessages) > 0 && (
                      <span className={styles.badge}>{unreadNotifications + unreadMessages}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Sign Out at Bottom */}
        <div className={styles.sidebarFooter}>
          <button
            className={`${styles.sidebarItem} ${styles.signOutButton}`}
            onClick={() => {
              // Clear authentication
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              // Stop loading state and redirect immediately
              setLoading(false);
              router.replace('/providers/login');
            }}
            title={sidebarExpanded ? '' : signOutItem.label}
          >
            <signOutItem.icon className={styles.sidebarIcon} />
            {sidebarExpanded && <span className={styles.sidebarLabel}>{signOutItem.label}</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent} style={{ marginLeft: sidebarExpanded ? '240px' : '80px' }}>
        {/* Top Navigation */}
        <div className={styles.topNav}>
          <div className={styles.greetingSection}>
            <div className={styles.profileImageContainer} onClick={handleImageClick}>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Provider Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileInitials}>
                  {getInitials(providerName)}
                </div>
              )}
            </div>
            <div className={styles.greetingInfo}>
              <h1 className={styles.greeting}>
                Hi there, {providerName}
                {providerRating !== null && totalReviews > 0 && (
                  <span className={styles.headerRating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className={(i + 1) <= Math.round(providerRating) ? styles.headerStarFilled : styles.headerStarEmpty} />
                    ))}
                    <strong>{providerRating.toFixed(1)}</strong>
                    <span className={styles.headerReviewCount}>({totalReviews})</span>
                  </span>
                )}
              </h1>
              <div className={styles.userStats}>
                {servicesCount > 0 && (
                  <>
                    <span className={styles.statItem}>{servicesCount} {servicesCount === 1 ? 'service' : 'services'}</span>
                    <span className={styles.statSeparator}>|</span>
                  </>
                )}
                {totalBookings > 0 && (
                  <>
                    <span className={styles.statItem}>{totalBookings} {totalBookings === 1 ? 'booking' : 'bookings'}</span>
                    <span className={styles.statSeparator}>|</span>
                  </>
                )}
                {profileUrl && (
                  <a href={profileUrl} className={styles.profileLink} target="_blank" rel="noopener noreferrer">
                    See your public profile on Omvira
                    <FaLink className={styles.linkIcon} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.topNavRight}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className={styles.hidden}
            />
          </div>
        </div>

        {/* Submenu Navigation */}
        <div className={styles.submenu}>
          {submenuItems[activeSection as keyof typeof submenuItems]?.map((item) => (
            <button
              key={item.id}
              className={`${styles.submenuItem} ${activeSubmenu === item.id ? styles.active : ''}`}
              onClick={() => {
                setActiveSubmenu(item.id);
                // If clicking on communication, set default submenu to inbox
                if (item.id === 'communication') {
                  setActiveCommunicationSubmenu('inbox');
                }
              }}
            >
              {item.label}
              {activeSection === 'bookings' && item.id === 'requests' && pendingRequests > 0 && (
                <span className={styles.badge}>{pendingRequests}</span>
              )}
              {activeSection === 'messages' && item.id === 'notifications' && unreadNotifications > 0 && (
                <span className={styles.badge}>{unreadNotifications}</span>
              )}
              {activeSection === 'messages' && item.id === 'communication' && unreadMessages > 0 && (
                <span className={styles.badge}>{unreadMessages}</span>
              )}
            </button>
          ))}
          {/* Nested submenu for Client Communication - appears below all main menu items */}
          {activeSection === 'messages' && activeSubmenu === 'communication' && (
            <div className={styles.nestedSubmenu}>
              {[
                { id: 'inbox', label: 'Inbox' },
                { id: 'starred', label: 'Starred' },
                { id: 'sent', label: 'Sent' },
                { id: 'trash', label: 'Trash' },
              ].map((nestedItem) => (
                <button
                  key={nestedItem.id}
                  className={`${styles.nestedSubmenuItem} ${activeCommunicationSubmenu === nestedItem.id ? styles.active : ''}`}
                  onClick={() => setActiveCommunicationSubmenu(nestedItem.id)}
                >
                  {nestedItem.label}
                  {nestedItem.id === 'inbox' && unreadMessages > 0 && (
                    <span className={styles.badge}>{unreadMessages}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {renderMainContent()}
        </div>
      </div>

      {/* Update Payment Method Modal - Stripe */}
      <UpdatePaymentMethodModalStripe
        isOpen={showUpdatePaymentModal}
        onClose={() => setShowUpdatePaymentModal(false)}
        existingPaymentMethod={savedPaymentMethod}
        userId={userId}
        userEmail={(() => {
          const user = localStorage.getItem('user');
          return user ? JSON.parse(user).email : '';
        })()}
        userName={(() => {
          const user = localStorage.getItem('user');
          return user ? JSON.parse(user).profile?.contact_name || '' : '';
        })()}
        onUpdate={async (paymentMethodId, billingAddress, nameOnCard) => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error('Not authenticated');
            }

            // Attach payment method to customer via Stripe API
            const response = await fetch(`http://localhost:4000/api/stripe/payment-method`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                paymentMethodId: paymentMethodId,
                billingAddress: billingAddress,
                nameOnCard: nameOnCard
              })
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || errorData.message || 'Failed to update payment method');
            }

            const result = await response.json();
            
            // Update saved payment method with Stripe data
            const paymentMethod = result.paymentMethod;
            setSavedPaymentMethod({
              cardNumber: `**** **** **** ${paymentMethod.last4}`,
              expiryDate: `${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}`,
              last4: paymentMethod.last4,
              cardType: paymentMethod.cardType,
              nameOnCard: paymentMethod.nameOnCard,
              billingAddress: paymentMethod.billingAddress || {}
            });
          } catch (error: any) {
            console.error('Error updating payment method:', error);
            throw error;
          }
        }}
      />

      {/* Update Billing Address Modal */}
      <UpdateBillingAddressModal
        isOpen={showUpdateBillingAddressModal}
        onClose={() => setShowUpdateBillingAddressModal(false)}
        existingAddress={savedPaymentMethod}
        onUpdate={async (addressData) => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error('Not authenticated');
            }

            // Update billing address via API (using payment method endpoint but only updating address)
            // Don't send card number if it's masked or doesn't exist - backend will treat as billing address only update
            const cardNumberToSend = savedPaymentMethod?.cardNumber && 
                                     !savedPaymentMethod.cardNumber.includes('*') &&
                                     savedPaymentMethod.cardNumber.replace(/\D/g, '').length >= 13
              ? savedPaymentMethod.cardNumber.replace(/\D/g, '')
              : undefined;
            
            const requestBody = {
              nameOnCard: addressData.nameOnCard,
              billingAddress: {
                nameOnCard: addressData.nameOnCard,
                address: addressData.address,
                addressLine2: addressData.addressLine2,
                city: addressData.city,
                stateProvince: addressData.stateProvince,
                postalCode: addressData.postalCode,
                country: addressData.country
              }
            };
            
            // Only include card fields if we have a valid card number
            if (cardNumberToSend) {
              requestBody.cardNumber = cardNumberToSend;
              requestBody.expiryDate = savedPaymentMethod?.expiryDate || '12/99';
            }
            
            const response = await fetch(`http://localhost:4000/api/providers/${userId}/payment-method`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || errorData.message || 'Failed to update billing address');
            }

            const result = await response.json();
            
            // Update saved payment method with new billing address
            setSavedPaymentMethod({
              ...savedPaymentMethod,
              nameOnCard: addressData.nameOnCard,
              billingAddress: result.paymentMethod?.billingAddress || {
                nameOnCard: addressData.nameOnCard,
                address: addressData.address,
                addressLine2: addressData.addressLine2,
                city: addressData.city,
                stateProvince: addressData.stateProvince,
                postalCode: addressData.postalCode,
                country: addressData.country
              }
            });
          } catch (error: any) {
            console.error('Error updating billing address:', error);
            throw error;
          }
        }}
      />

      {/* Change Plan Modal */}
        <ChangePlanModal
          isOpen={showChangePlanModal}
          onClose={() => setShowChangePlanModal(false)}
          currentPlan={subscriptionData?.plan || 'essential'}
          currentBillingCycle={subscriptionData?.billingCycle || 'monthly'}
          onCancelSubscription={handleCancelSubscription}
          isCancellingSubscription={isCancellingSubscription}
          onPlanChange={async (newPlan: string, newBillingCycle: string) => {
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                throw new Error('Not authenticated');
              }

              // Calculate new price
              let newPrice = 0;
              if (newPlan === 'professional') {
                newPrice = newBillingCycle === 'yearly' ? 47 : 49;
              } else if (newPlan === 'growth') {
                newPrice = newBillingCycle === 'yearly' ? 79 : 99;
              }

              // Calculate next payment date (same day next month for monthly, same day next year for yearly)
              const nextPaymentDate = new Date();
              if (newBillingCycle === 'yearly') {
                nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
              } else {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
              }

              // Update subscription via API
              const response = await fetch(`http://localhost:4000/api/providers/${userId}/subscription`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  plan: newPlan,
                  billingCycle: newBillingCycle,
                  price: newPrice,
                  nextPaymentDate: nextPaymentDate.toISOString()
                })
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Subscription update error:', errorData);
                const errorMessage = errorData.error || errorData.message || `Failed to update subscription (${response.status})`;
                throw new Error(errorMessage);
              }

              // Update local state
              setSubscriptionData({
                plan: newPlan,
                billingCycle: newBillingCycle,
                price: newPrice,
                nextPaymentDate: nextPaymentDate.toISOString(),
              });

              // Update localStorage
              const userData = JSON.parse(localStorage.getItem('user') || '{}');
              const updatedUser = {
                ...userData,
                subscription: {
                  plan: newPlan,
                  billingCycle: newBillingCycle,
                  price: newPrice,
                  nextPaymentDate: nextPaymentDate.toISOString(),
                }
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));

              await Swal.fire({
                title: 'Success!',
                text: 'Plan changed successfully!',
                icon: 'success',
                confirmButtonColor: '#3085d6'
              });
            } catch (error: any) {
              console.error('Error changing plan:', error);
              throw error;
            }
          }}
        />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      {/* Update Email Modal */}
      <UpdateEmailModal
        isOpen={showUpdateEmailModal}
        onClose={() => setShowUpdateEmailModal(false)}
        currentEmail={(() => {
          const user = localStorage.getItem('user');
          return user ? JSON.parse(user).email : '';
        })()}
        onSuccess={() => {
          // Reload user data to get updated email
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            // Email is already updated in localStorage by the modal
            // Just trigger a re-render if needed
          }
        }}
      />
    </div>
  );
}

export default function ProvidersDashboard() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    }>
      <ProvidersDashboardContent />
    </Suspense>
  );
}

