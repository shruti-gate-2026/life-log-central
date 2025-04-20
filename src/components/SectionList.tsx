
import React from 'react';
import { SectionType, useTracker } from '../contexts/TrackerContext';
import { SectionCard } from './SectionCard';

interface SectionListProps {
  title: string;
  sections: SectionType[];
  date?: string;
  onSectionClick?: (section: SectionType) => void;
}

export function SectionList({ title, sections, date, onSectionClick }: SectionListProps) {
  const { getEntriesBySectionAndDate, getCurrentDateString } = useTracker();
  const currentDate = date || getCurrentDateString();

  return (
    <div className="mt-4">
      <h2 className="section-title font-medium text-lg mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(section => {
          const sectionEntries = getEntriesBySectionAndDate(section.id, currentDate);
          return (
            <SectionCard 
              key={section.id} 
              section={section} 
              entryCount={sectionEntries.length}
              onClick={() => onSectionClick && onSectionClick(section)}
            />
          );
        })}
      </div>
    </div>
  );
}
