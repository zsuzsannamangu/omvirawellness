// Unified service categories used throughout the application
// This ensures consistency across provider signup, client preferences, search filters, and homepage

export interface Category {
  id: string;
  name: string;
  displayName: string; // For display purposes (may differ from name)
  description?: string;
}

// Main categories - used for provider signup, client preferences, and search filters
export const SERVICE_CATEGORIES: Category[] = [
  {
    id: 'private-yoga',
    name: 'Private Yoga',
    displayName: 'Private Yoga',
    description: 'Personalized one-on-one yoga sessions tailored to your unique needs, goals, and schedule'
  },
  {
    id: 'yoga-therapy',
    name: 'Yoga Therapy',
    displayName: 'Yoga Therapy',
    description: 'Empowering individuals to progress toward improved health through the application of the teachings and practices of Yoga'
  },
  {
    id: 'somatic-practices',
    name: 'Somatic Practices',
    displayName: 'Somatic Practices',
    description: 'Body-centered therapeutic practices that integrate mind and body for healing and awareness'
  },
  {
    id: 'massage-therapy',
    name: 'Massage Therapy',
    displayName: 'Massage Therapy',
    description: 'Therapeutic bodywork designed to relieve tension, reduce stress, and promote healing'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    displayName: 'Meditation',
    description: 'Mindfulness, guided meditation, and stress reduction techniques'
  },
  {
    id: 'reiki-energy-work',
    name: 'Reiki & Energy Work',
    displayName: 'Reiki & Energy Work',
    description: 'Energy healing techniques that promote relaxation, reduce stress, and restore balance'
  },
  {
    id: 'sound-healing',
    name: 'Sound Healing',
    displayName: 'Sound Healing',
    description: 'Therapeutic use of sound and vibration for healing and relaxation'
  },
  {
    id: 'craniosacral-therapy',
    name: 'Craniosacral Therapy',
    displayName: 'Craniosacral Therapy',
    description: 'Gentle hands-on therapy focusing on the craniosacral system'
  },
  {
    id: 'reflexology',
    name: 'Reflexology',
    displayName: 'Reflexology',
    description: 'Pressure point therapy on feet, hands, and ears to promote healing'
  },
  {
    id: 'life-coaching',
    name: 'Life Coaching',
    displayName: 'Life Coaching',
    description: 'Personal development and goal achievement support'
  },
  {
    id: 'health-coaching',
    name: 'Health Coaching',
    displayName: 'Health Coaching',
    description: 'Holistic health guidance and support for wellness goals'
  },
  {
    id: 'breathwork',
    name: 'Breathwork',
    displayName: 'Breathwork',
    description: 'Conscious breathing techniques for healing, transformation, and well-being'
  },
  {
    id: 'nutrition-counseling',
    name: 'Nutrition Counseling',
    displayName: 'Nutrition Counseling',
    description: 'Diet and nutrition guidance for optimal health and wellness'
  },
  {
    id: 'ayurveda',
    name: 'Ayurveda',
    displayName: 'Ayurveda',
    description: 'Ancient Indian system of medicine focusing on natural healing through personalized diet and lifestyle'
  },
  {
    id: 'herbalist',
    name: 'Herbalist',
    displayName: 'Herbalist',
    description: 'Natural healing through the use of medicinal plants and herbs'
  },
  {
    id: 'personal-training',
    name: 'Personal Training',
    displayName: 'Personal Training',
    description: 'One-on-one fitness coaching with customized workout plans'
  },
  {
    id: 'doula-care',
    name: 'Doula Care',
    displayName: 'Doula Care',
    description: 'Compassionate birth and postpartum support during pregnancy, labor, and beyond'
  },
  {
    id: 'skincare-esthetics',
    name: 'Skincare / Esthetics',
    displayName: 'Skincare / Esthetics',
    description: 'Professional facial treatments and skincare services to cleanse, nourish, and rejuvenate your skin'
  },
  {
    id: 'hair-styling',
    name: 'Hair Styling',
    displayName: 'Hair Styling',
    description: 'Professional hair services including cuts, styling, and coloring'
  },
  {
    id: 'nail-care',
    name: 'Nail Care',
    displayName: 'Nail Care',
    description: 'Expert nail care services including manicures, pedicures, and nail art'
  },
  {
    id: 'makeup',
    name: 'Makeup',
    displayName: 'Makeup',
    description: 'Professional makeup application for various occasions'
  },
  {
    id: 'cacao-facilitation',
    name: 'Cacao Facilitation',
    displayName: 'Cacao Facilitation',
    description: 'Ceremonial cacao experiences for heart-opening, connection, and transformation'
  }
];

// Get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return SERVICE_CATEGORIES.find(cat => cat.id === id);
};

// Get category by name (for backward compatibility)
export const getCategoryByName = (name: string): Category | undefined => {
  return SERVICE_CATEGORIES.find(cat => 
    cat.name.toLowerCase() === name.toLowerCase() || 
    cat.displayName.toLowerCase() === name.toLowerCase()
  );
};

// Get all category names as array (for filters, dropdowns, etc.)
export const getCategoryNames = (): string[] => {
  return SERVICE_CATEGORIES.map(cat => cat.displayName);
};

// Get category IDs as array
export const getCategoryIds = (): string[] => {
  return SERVICE_CATEGORIES.map(cat => cat.id);
};
