
import React, { useState } from 'react';
import { useTracker } from '../contexts/TrackerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionList } from './SectionList';
import { SectionForm } from './SectionForm';

export function DailySummary() {
  const { 
    getCurrentDateString, 
    getFormattedDate, 
    getSectionCompletionForDate 
  } = useTracker();
  
  const [selectedDate, setSelectedDate] = useState(getCurrentDateString());
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  
  // Calculate completion stats
  const { completed, missing } = getSectionCompletionForDate(selectedDate);
  const totalSections = completed.length + missing.length;
  const completionPercentage = totalSections === 0 
    ? 0 
    : Math.round((completed.length / totalSections) * 100);
  
  // Date navigation
  const changeDate = (delta: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + delta);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
    setSelectedSectionId(null);
  };
  
  // Handle go to today
  const goToToday = () => {
    setSelectedDate(getCurrentDateString());
    setSelectedSectionId(null);
  };
  
  // Handle section selection
  const handleSectionClick = (sectionId: string) => {
    setSelectedSectionId(sectionId === selectedSectionId ? null : sectionId);
  };
  
  const selectedSection = [...completed, ...missing].find(s => s.id === selectedSectionId);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daily Summary</CardTitle>
              <CardDescription>Track your daily progress</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              <Calendar className="h-4 w-4 mr-1" /> Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => changeDate(-1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Day
            </Button>
            <h3 className="text-lg font-medium">{getFormattedDate(selectedDate)}</h3>
            <Button variant="ghost" size="sm" onClick={() => changeDate(1)}>
              Next Day <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {/* Completion Stats */}
          <div className="bg-secondary/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Completion Progress</h4>
              <span className="text-lg font-semibold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{completed.length} completed</span>
              <span>{missing.length} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Section Form */}
      {selectedSection && (
        <div className="mt-4">
          <SectionForm 
            section={selectedSection} 
            onSuccess={() => setSelectedSectionId(null)} 
          />
        </div>
      )}
      
      {/* Section Lists */}
      {!selectedSection && (
        <>
          {missing.length > 0 && (
            <SectionList 
              title="Sections To Complete" 
              sections={missing}
              date={selectedDate}
              onSectionClick={(section) => handleSectionClick(section.id)}
            />
          )}
          
          {completed.length > 0 && (
            <SectionList 
              title="Completed Sections" 
              sections={completed}
              date={selectedDate}
              onSectionClick={(section) => handleSectionClick(section.id)}
            />
          )}
        </>
      )}
    </div>
  );
}
