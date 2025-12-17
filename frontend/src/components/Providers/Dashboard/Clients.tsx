'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { FaEnvelope, FaCalendarAlt, FaStickyNote, FaTimes, FaSort, FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface ClientsProps {
  activeSubmenu: string;
}

interface Client {
  client_profile_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  pronoun: string;
  date_of_birth: string;
  wellness_goals: string;
  city: string;
  state: string;
}

interface ClientNote {
  note: string;
  created_at: string;
  updated_at: string;
}

// Helper to generate UUIDs
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function Clients({ activeSubmenu }: ClientsProps) {
  const params = useParams();
  const userId = params.userId as string;
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<{ [clientId: string]: ClientNote }>({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'first_name' | 'last_name'>('first_name');
  
  // Appointment modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [locationType, setLocationType] = useState('provider_location');
  const [locationDetails, setLocationDetails] = useState('');
  const [savingAppointment, setSavingAppointment] = useState(false);
  const isMountedRef = useRef(true);

  // Cleanup SweetAlert on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Close any open SweetAlert instances
      try {
        if (Swal.isVisible()) {
          Swal.close();
        }
      } catch (e) {
        // Ignore errors during cleanup
        console.warn('Error closing SweetAlert on unmount:', e);
      }
    };
  }, []);

  // Helper function to safely show SweetAlert
  const safeSwalFire = async (options: any) => {
    if (!isMountedRef.current) return;
    try {
      return await Swal.fire(options);
    } catch (error) {
      console.error('SweetAlert error:', error);
      return null;
    }
  };

  // Helper function to format location display
  const formatLocationDisplay = (locationType: string) => {
    const locationMap: { [key: string]: string } = {
      'provider_location': 'At Provider\'s Location',
      'client_location': 'At Client\'s Location',
      'virtual': 'Virtual/Online',
      'other': 'Other'
    };
    return locationMap[locationType] || locationType;
  };

  // Calculate total price from selected service
  const getSelectedServicePrice = (): number => {
    if (!selectedService || !services.length) return 0;
    const service = services.find(s => String(s?.id) === String(selectedService));
    const price = service?.price || 0;
    return typeof price === 'number' ? price : parseFloat(price) || 0;
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:4000/api/providers/${userId}/clients`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const response = await fetch(`http://localhost:4000/api/providers/${userId}/clients/notes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes || {});
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    if (userId && activeSubmenu === 'directory') {
      fetchClients();
      fetchNotes();
    }
    
    if (userId && activeSubmenu === 'notes') {
      fetchNotes();
      fetchClients(); // Need clients to display names
    }
  }, [userId, activeSubmenu]);

  const formatDateOfBirth = (dob: string | null) => {
    if (!dob) return 'N/A';
    try {
      const date = new Date(dob);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch (e) {
      return dob;
    }
  };

  const formatWellnessGoals = (goals: string | null) => {
    if (!goals) return 'N/A';
    try {
      // If it's a JSON string, parse it
      if (typeof goals === 'string' && goals.startsWith('[')) {
        const parsed = JSON.parse(goals);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        }
      }
      // If it's already an array
      if (Array.isArray(goals)) {
        return goals.join(', ');
      }
      return goals;
    } catch (e) {
      return goals;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleMessage = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement message functionality
    console.log('Message client:', client);
  };

  const handleAddAppointment = async (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedClient(client);
    
    // Fetch provider's services
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        alert('Please log in again');
        return;
      }
      
      console.log('Fetching services for provider:', userId);
      const url = `http://localhost:4000/api/providers/${userId}`;
      console.log('Fetch URL:', url);
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Provider data:', data);
        console.log('Raw services:', data.services);
        
        // Clean up services: remove empty objects and assign UUIDs
        let allServices = data.services || [];
        console.log('Total services fetched:', allServices.length);
        
        if (allServices.length === 0) {
          console.warn('No services found for this provider');
          alert('No services found. Please add services to your profile first.');
          setServices([]);
          return;
        }
        
        // Filter out empty objects and services without name/price
        let cleanedServices = allServices.filter((service: any, index: number) => {
          if (!service || Object.keys(service).length === 0) {
            console.warn(`Service at index ${index} is empty object, removing`);
            return false;
          }
          if (!service.name || service.price === undefined || service.price === null) {
            console.warn(`Service at index ${index} missing name or price:`, service);
            return false;
          }
          return true;
        });
        
        console.log(`Cleaned services: ${cleanedServices.length} out of ${allServices.length}`);
        
        // Check if any services are missing IDs and assign them
        let needsSave = false;
        cleanedServices = cleanedServices.map((service: any, index: number) => {
          if (!service.id) {
            console.log(`Assigning UUID to service: ${service.name}`);
            needsSave = true;
            return { ...service, id: generateUUID() };
          }
          return service;
        });
        
        // Auto-save if we made changes
        if (needsSave || cleanedServices.length !== allServices.length) {
          console.log('Services were cleaned/fixed. Auto-saving...');
          try {
            await fetch(`http://localhost:4000/api/providers/${userId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ services: cleanedServices })
            });
            console.log('✅ Services auto-saved successfully with UUIDs!');
          } catch (saveError) {
            console.error('Failed to auto-save cleaned services:', saveError);
          }
        }
        
        console.log('Final valid services:', cleanedServices.length);
        cleanedServices.forEach((service: any, index: number) => {
          console.log(`Service ${index}:`, {
            id: service.id,
            name: service.name,
            price: service.price,
            duration: service.duration
          });
        });
        
        setServices(cleanedServices);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch provider services');
        console.error('Status:', response.status);
        console.error('Response:', errorText);
        alert(`Failed to fetch services: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      console.error('Error fetching services:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Network error: ${error.message}. Is the backend running?`);
      setServices([]);
    }
    
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedClient(null);
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setLocationType('provider_location');
    setLocationDetails('');
  };

  const handleSaveAppointment = async () => {
    if (!selectedClient || !selectedService || !selectedDate || !selectedTime) {
      await safeSwalFire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#8B7355'
      });
      return;
    }

    setSavingAppointment(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Not authenticated');
        setSavingAppointment(false);
        return;
      }

      // Find the selected service details
      console.log('Selected service ID:', selectedService, 'Type:', typeof selectedService);
      console.log('Available services:', services);
      
      const service = services.find(s => {
        if (!s || !s.id) return false;
        // Compare as strings to handle both string and number IDs
        return String(s.id) === String(selectedService);
      });
      
      if (!service) {
        console.error('Service not found. Selected:', selectedService);
        console.error('Available service IDs:', services.map(s => ({ id: s?.id, name: s?.name })));
        await safeSwalFire({
          icon: 'error',
          title: 'Service Not Found',
          text: 'Please select a valid service from the list',
          confirmButtonColor: '#8B7355'
        });
        setSavingAppointment(false);
        return;
      }
      
      console.log('Found service:', service);

      const bookingData = {
        provider_id: userId,
        client_id: selectedClient.user_id,
        service_id: service.id,
        service_name: service.name || 'Service',
        date: selectedDate,
        time: selectedTime,
        duration: service.duration || 60,
        price: service.price,
        total_amount: service.price,
        status: 'confirmed', // Provider is creating it, so auto-confirm
        location_type: formatLocationDisplay(locationType),
        location_details: locationDetails || ''
      };

      console.log('Creating booking with data:', bookingData);

      // Create booking
      const response = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Booking created:', result);
        
        // Show success message with SweetAlert
        await safeSwalFire({
          icon: 'success',
          title: 'Appointment Created!',
          text: `Successfully scheduled ${service.name} with ${selectedClient.first_name} ${selectedClient.last_name}`,
          confirmButtonColor: '#8B7355',
          confirmButtonText: 'Great!',
          timer: 3000,
          timerProgressBar: true
        });
        
        handleCloseAppointmentModal();
        // Trigger a refresh of bookings
        window.dispatchEvent(new CustomEvent('refreshBookings'));
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText };
        }
        await safeSwalFire({
          icon: 'error',
          title: 'Failed to Create Appointment',
          text: error.message || 'Please try again later',
          confirmButtonColor: '#8B7355'
        });
      }
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      await safeSwalFire({
        icon: 'error',
        title: 'Error',
        text: `Failed to create appointment: ${error.message || 'Unknown error'}`,
        confirmButtonColor: '#8B7355'
      });
    } finally {
      setSavingAppointment(false);
    }
  };

  const handleAddNote = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedClient(client);
    // Load existing note if any
    const existingNote = notes[client.client_profile_id];
    setNoteText(existingNote?.note || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!selectedClient || !noteText.trim()) return;
    
    setSavingNote(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `http://localhost:4000/api/providers/${userId}/clients/${selectedClient.client_profile_id}/notes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ note: noteText })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || {});
        setShowNoteModal(false);
        setSelectedClient(null);
        setNoteText('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        await safeSwalFire({
          icon: 'error',
          title: 'Failed to Save Note',
          text: errorData.error || 'Please try again later',
          confirmButtonColor: '#8B7355'
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      await safeSwalFire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save note. Please try again.',
        confirmButtonColor: '#8B7355'
      });
    } finally {
      setSavingNote(false);
    }
  };

  const handleCloseModal = () => {
    setShowNoteModal(false);
    setSelectedClient(null);
    setNoteText('');
  };

  const toggleClientExpansion = (clientId: string) => {
    setExpandedClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'directory':
        if (loading) {
          return (
            <div className={styles.clientsContent}>
              <h2 className={styles.sectionTitle}>Clients</h2>
              <div className={styles.placeholderText}>
                <p>Loading clients...</p>
              </div>
            </div>
          );
        }

        if (clients.length === 0) {
          return (
            <div className={styles.clientsContent}>
              <h2 className={styles.sectionTitle}>Clients</h2>
              <div className={styles.placeholderText}>
                <p>No clients yet.</p>
              </div>
            </div>
          );
        }

        return (
          <div className={styles.clientsContent}>
            <h2 className={styles.sectionTitle}>Clients</h2>
            <div className={styles.bookingsTableWrapper}>
              <table className={styles.bookingsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Pronoun</th>
                    <th>DOB</th>
                    <th>Goals</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr key={client.client_profile_id}>
                      <td>{index + 1}</td>
                      <td>{client.first_name} {client.last_name}</td>
                      <td>{client.phone_number || 'N/A'}</td>
                      <td>{client.email}</td>
                      <td>{client.pronoun || 'N/A'}</td>
                      <td>{formatDateOfBirth(client.date_of_birth)}</td>
                      <td>{formatWellnessGoals(client.wellness_goals)}</td>
                      <td>
                        {client.city && client.state 
                          ? `${client.city}, ${client.state}`
                          : client.city || client.state || 'N/A'}
                      </td>
                      <td>
                        <div className={styles.clientActions}>
                          <button 
                            type="button"
                            className={`${styles.actionButton} ${styles.messageButton}`}
                            onClick={(e) => handleMessage(e, client)}
                          >
                            <FaEnvelope />
                          </button>
                          <button 
                            type="button"
                            className={`${styles.actionButton} ${styles.appointmentButton}`}
                            onClick={(e) => handleAddAppointment(e, client)}
                          >
                            <FaCalendarAlt />
                          </button>
                          <button 
                            type="button"
                            className={`${styles.actionButton} ${styles.noteButton}`}
                            onClick={(e) => handleAddNote(e, client)}
                          >
                            <FaStickyNote />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Note Modal */}
            {showNoteModal && selectedClient && (
              <div className={styles.modalOverlay} onClick={handleCloseModal}>
                <div className={styles.noteModal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3>Add Note for {selectedClient.first_name} {selectedClient.last_name}</h3>
                    <button 
                      type="button"
                      className={styles.closeButton}
                      onClick={handleCloseModal}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className={styles.modalBody}>
                    <textarea
                      className={styles.noteTextarea}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Your note..."
                      rows={12}
                    />
                  </div>
                  <div className={styles.modalFooter}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={handleCloseModal}
                      disabled={savingNote}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className={styles.saveBtn}
                      onClick={handleSaveNote}
                      disabled={savingNote || !noteText.trim()}
                    >
                      {savingNote ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Appointment Modal */}
            {showAppointmentModal && selectedClient && (
              <div className={styles.modalOverlay} onClick={handleCloseAppointmentModal}>
                <div className={styles.appointmentModal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3>Schedule Appointment for {selectedClient.first_name} {selectedClient.last_name}</h3>
                    <button 
                      type="button"
                      className={styles.closeButton}
                      onClick={handleCloseAppointmentModal}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className={styles.modalBody}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Service *</label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="">Select a service...</option>
                        {services && services.length > 0 ? (
                          services.map((service, index) => (
                            <option key={service.id || `service-${index}`} value={service.id}>
                              {service.name || 'Unnamed Service'} - ${service.price || 0} ({service.duration || 60} min)
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No services available</option>
                        )}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Date *</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={styles.formInput}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Time *</label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Location *</label>
                      <select
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="provider_location">At Provider's Location</option>
                        <option value="client_location">At Client's Location</option>
                        <option value="virtual">Virtual/Online</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {locationType === 'other' && (
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Location Details</label>
                        <input
                          type="text"
                          value={locationDetails}
                          onChange={(e) => setLocationDetails(e.target.value)}
                          className={styles.formInput}
                          placeholder="Enter location details..."
                        />
                      </div>
                    )}
                    {selectedService && (
                      <div className={styles.totalPriceDisplay}>
                        <span className={styles.totalLabel}>Total:</span>
                        <span className={styles.totalAmount}>${getSelectedServicePrice().toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.modalFooter}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={handleCloseAppointmentModal}
                      disabled={savingAppointment}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className={styles.saveBtn}
                      onClick={handleSaveAppointment}
                      disabled={savingAppointment || !selectedService || !selectedDate || !selectedTime}
                    >
                      {savingAppointment ? 'Creating...' : 'Create Appointment'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'notes':
        const clientsWithNotes = clients.filter(client => 
          notes[client.client_profile_id]
        );

        // Sort clients based on selected sort option
        const sortedClients = [...clientsWithNotes].sort((a, b) => {
          const aValue = (a[sortBy] || '').toLowerCase();
          const bValue = (b[sortBy] || '').toLowerCase();
          return aValue.localeCompare(bValue);
        });

        if (loading) {
          return (
            <div className={styles.notesContent}>
              <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
              <div className={styles.placeholderText}>
                <p>Loading notes...</p>
              </div>
            </div>
          );
        }

        if (clientsWithNotes.length === 0) {
          return (
            <div className={styles.notesContent}>
              <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
              <div className={styles.placeholderText}>
                <p>No notes or preferences saved yet.</p>
              </div>
            </div>
          );
        }

        return (
          <div className={styles.notesContent}>
            <div className={styles.notesHeader}>
              <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
              <div className={styles.sortControls}>
                <label className={styles.sortLabel}>Sort by:</label>
                <button
                  type="button"
                  className={`${styles.sortButton} ${sortBy === 'first_name' ? styles.sortButtonActive : ''}`}
                  onClick={() => setSortBy('first_name')}
                >
                  <FaSortAlphaDown /> First Name
                </button>
                <button
                  type="button"
                  className={`${styles.sortButton} ${sortBy === 'last_name' ? styles.sortButtonActive : ''}`}
                  onClick={() => setSortBy('last_name')}
                >
                  <FaSortAlphaDown /> Last Name
                </button>
              </div>
            </div>
            <div className={styles.notesList}>
              {sortedClients.map((client, index) => {
                const note = notes[client.client_profile_id];
                const isExpanded = expandedClients.has(client.client_profile_id);
                return (
                  <div key={client.client_profile_id} className={`${styles.noteCard} ${!isExpanded ? styles.collapsed : ''}`}>
                    <div 
                      className={`${styles.noteHeader} ${styles.collapsible} ${isExpanded ? styles.expanded : ''}`}
                      onClick={() => toggleClientExpansion(client.client_profile_id)}
                    >
                      <h3>
                        <span className={styles.clientNumber}>{index + 1}.</span> {client.first_name} {client.last_name}
                      </h3>
                      {isExpanded && (
                        <span className={styles.noteDate}>
                          {note.updated_at ? formatDate(note.updated_at) : formatDate(note.created_at)}
                        </span>
                      )}
                    </div>
                    {isExpanded && (
                      <>
                        <div className={styles.noteContent}>
                          <p>{note.note}</p>
                        </div>
                        <button
                          type="button"
                          className={styles.editNoteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddNote(e, client);
                          }}
                        >
                          <FaStickyNote /> Edit Note
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Note Modal */}
            {showNoteModal && selectedClient && (
              <div className={styles.modalOverlay} onClick={handleCloseModal}>
                <div className={styles.noteModal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3>Add Note for {selectedClient.first_name} {selectedClient.last_name}</h3>
                    <button 
                      type="button"
                      className={styles.closeButton}
                      onClick={handleCloseModal}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className={styles.modalBody}>
                    <textarea
                      className={styles.noteTextarea}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Your note..."
                      rows={12}
                    />
                  </div>
                  <div className={styles.modalFooter}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={handleCloseModal}
                      disabled={savingNote}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className={styles.saveBtn}
                      onClick={handleSaveNote}
                      disabled={savingNote || !noteText.trim()}
                    >
                      {savingNote ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </div>
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
