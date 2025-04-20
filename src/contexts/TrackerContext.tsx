
import React, { createContext, useContext, useState, useEffect } from 'react';

// Section types
export type SectionType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: FieldType[];
  frequency?: string;
};

export type FieldType = {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'rating';
  placeholder?: string;
  required: boolean;
  options?: { value: string | number; label: string }[];
};

// Entry types
export type EntryType = {
  id: string;
  sectionId: string;
  date: string;
  data: Record<string, any>;
  createdAt: string;
};

// Context type
type TrackerContextType = {
  sections: SectionType[];
  entries: EntryType[];
  createEntry: (sectionId: string, data: Record<string, any>) => void;
  deleteEntry: (entryId: string) => void;
  getEntriesByDate: (date: string) => EntryType[];
  getEntriesBySection: (sectionId: string) => EntryType[];
  getEntriesBySectionAndDate: (sectionId: string, date: string) => EntryType[];
  getSectionCompletionForDate: (date: string) => { 
    completed: SectionType[], 
    missing: SectionType[] 
  };
  getCurrentDateString: () => string;
  getFormattedDate: (dateString: string) => string;
};

// Create context
const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

// Sample sections data
const sectionData: SectionType[] = [
  {
    id: 'gate',
    name: 'GATE 2026 Preparation',
    description: 'Track your GATE exam preparation progress',
    icon: 'book',
    fields: [
      { id: 'studied', name: 'Did you study?', type: 'boolean', required: true },
      { id: 'details', name: 'What was done?', type: 'textarea', placeholder: 'Describe what you studied', required: false },
      { id: 'time', name: 'Time spent (hours)', type: 'number', required: true },
      { id: 'topics', name: 'Topics covered', type: 'text', required: false }
    ]
  },
  {
    id: 'jobs',
    name: 'Job Applications',
    description: 'Track your job application progress',
    icon: 'briefcase',
    fields: [
      { id: 'status', name: 'Updated status?', type: 'boolean', required: true },
      { id: 'count', name: 'No. of applications', type: 'number', required: true },
      { id: 'where', name: 'Where applied', type: 'textarea', placeholder: 'List companies and positions', required: false },
      { id: 'feedback', name: 'Feedback', type: 'textarea', placeholder: 'Any feedback received', required: false }
    ]
  },
  {
    id: 'work',
    name: 'Office Work',
    description: 'Track your daily work activities',
    icon: 'clipboard',
    fields: [
      { id: 'summary', name: 'Work summary', type: 'textarea', placeholder: 'Summarize your day at work', required: true },
      { id: 'satisfaction', name: 'Satisfaction rating', type: 'rating', required: true, options: [
        { value: 1, label: 'Very Unsatisfied' },
        { value: 2, label: 'Unsatisfied' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Satisfied' },
        { value: 5, label: 'Very Satisfied' }
      ]}
    ]
  },
  {
    id: 'peace',
    name: 'Geeta/Book for Peace',
    description: 'Track your reading for mental peace',
    icon: 'book-open',
    frequency: '2x/week',
    fields: [
      { id: 'did', name: 'Did something peaceful?', type: 'boolean', required: true },
      { id: 'what', name: 'What was it?', type: 'text', placeholder: 'Describe your peaceful activity', required: false }
    ]
  },
  {
    id: 'dsa',
    name: 'DSA/Leetcode/GFG',
    description: 'Track your coding practice',
    icon: 'code',
    frequency: '2x/week',
    fields: [
      { id: 'platform', name: 'Platform', type: 'text', placeholder: 'Which platform did you use?', required: true },
      { id: 'problems', name: 'Problems solved', type: 'number', required: true },
      { id: 'topics', name: 'Topics', type: 'text', placeholder: 'What topics did you cover?', required: false }
    ]
  },
  {
    id: 'content',
    name: 'Content Posting',
    description: 'Track your social media content',
    icon: 'edit',
    fields: [
      { id: 'posted', name: 'Posted something?', type: 'boolean', required: true },
      { id: 'topic', name: 'Topic', type: 'text', placeholder: 'What did you post about?', required: false }
    ]
  },
  {
    id: 'diet',
    name: 'No Sugar/Maida Goal',
    description: 'Track your diet restriction goals',
    icon: 'utensils',
    fields: [
      { id: 'stuck', name: 'Stuck to goal?', type: 'boolean', required: true },
      { id: 'eaten', name: 'What was eaten?', type: 'textarea', placeholder: 'List what you ate today', required: false }
    ]
  },
  {
    id: 'money',
    name: 'Money Tracking',
    description: 'Track your expenses and income',
    icon: 'money',
    fields: [
      { id: 'spent', name: 'Money spent', type: 'number', required: true },
      { id: 'on', name: 'Spent on', type: 'text', placeholder: 'What did you spend on?', required: true },
      { id: 'income', name: 'Any income?', type: 'boolean', required: true },
      { id: 'source', name: 'Source', type: 'text', placeholder: 'Source of income', required: false }
    ]
  },
  {
    id: 'satisfaction',
    name: 'Whole Day Satisfaction',
    description: 'Rate your overall day',
    icon: 'smile',
    fields: [
      { id: 'rating', name: 'Rating', type: 'rating', required: true, options: [
        { value: 1, label: 'Terrible' },
        { value: 2, label: 'Bad' },
        { value: 3, label: 'Poor' },
        { value: 4, label: 'Fair' },
        { value: 5, label: 'Average' },
        { value: 6, label: 'Good' },
        { value: 7, label: 'Very Good' },
        { value: 8, label: 'Great' },
        { value: 9, label: 'Excellent' },
        { value: 10, label: 'Perfect' }
      ]},
      { id: 'improve', name: 'How to improve?', type: 'textarea', placeholder: 'What would make tomorrow better?', required: false }
    ]
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'Practice daily gratitude',
    icon: 'heart',
    fields: [
      { id: 'thankful', name: 'One thing you\'re thankful for', type: 'textarea', required: true }
    ]
  },
  {
    id: 'offchest',
    name: 'Off the Chest',
    description: 'Write anything on your mind',
    icon: 'feather',
    fields: [
      { id: 'anything', name: 'Anything to write?', type: 'textarea', placeholder: 'Get it off your chest', required: true }
    ]
  },
  {
    id: 'ai',
    name: 'AI Learning',
    description: 'Track your AI learning progress',
    icon: 'code',
    fields: [
      { id: 'activity', name: 'Any AI-related activity?', type: 'textarea', placeholder: 'What did you learn about AI today?', required: true }
    ]
  }
];

// Provider component
export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections] = useState<SectionType[]>(sectionData);
  const [entries, setEntries] = useState<EntryType[]>([]);

  // Load entries from localStorage on initialization
  useEffect(() => {
    const savedEntries = localStorage.getItem('lifeTrackerEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lifeTrackerEntries', JSON.stringify(entries));
  }, [entries]);

  // Get current date in YYYY-MM-DD format
  const getCurrentDateString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Format date for display
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Create a new entry
  const createEntry = (sectionId: string, data: Record<string, any>) => {
    const newEntry: EntryType = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sectionId,
      date: getCurrentDateString(),
      data,
      createdAt: new Date().toISOString(),
    };
    
    setEntries(prevEntries => [...prevEntries, newEntry]);
  };

  // Delete an entry
  const deleteEntry = (entryId: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
  };

  // Get entries by date
  const getEntriesByDate = (date: string) => {
    return entries.filter(entry => entry.date === date);
  };

  // Get entries by section
  const getEntriesBySection = (sectionId: string) => {
    return entries.filter(entry => entry.sectionId === sectionId);
  };

  // Get entries by section and date
  const getEntriesBySectionAndDate = (sectionId: string, date: string) => {
    return entries.filter(entry => entry.sectionId === sectionId && entry.date === date);
  };

  // Get sections completed for a date
  const getSectionCompletionForDate = (date: string) => {
    const entriesForDate = getEntriesByDate(date);
    const sectionIdsWithEntries = new Set(entriesForDate.map(entry => entry.sectionId));
    
    const completed = sections.filter(section => sectionIdsWithEntries.has(section.id));
    const missing = sections.filter(section => !sectionIdsWithEntries.has(section.id));
    
    return { completed, missing };
  };

  return (
    <TrackerContext.Provider value={{
      sections,
      entries,
      createEntry,
      deleteEntry,
      getEntriesByDate,
      getEntriesBySection,
      getEntriesBySectionAndDate,
      getSectionCompletionForDate,
      getCurrentDateString,
      getFormattedDate
    }}>
      {children}
    </TrackerContext.Provider>
  );
};

// Custom hook to use the tracker context
export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (context === undefined) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
