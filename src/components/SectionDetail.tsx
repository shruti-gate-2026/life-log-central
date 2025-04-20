
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracker } from '../contexts/TrackerContext';
import { SectionForm } from './SectionForm';
import { EntryCard } from './EntryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

export function SectionDetail() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const { sections, getEntriesBySectionAndDate, getCurrentDateString } = useTracker();
  
  const section = sections.find(s => s.id === sectionId);
  const [showForm, setShowForm] = React.useState(false);
  
  if (!section) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">Section not found</h2>
        <Button 
          variant="link" 
          className="mt-4"
          onClick={() => navigate('/daily')}
        >
          Go back to daily view
        </Button>
      </div>
    );
  }
  
  const currentDate = getCurrentDateString();
  const todayEntries = getEntriesBySectionAndDate(section.id, currentDate);
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };
  
  const handleFormSuccess = () => {
    setShowForm(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={() => navigate('/daily')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{section.name}</CardTitle>
          <CardDescription>{section.description}</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Today's Entries</h2>
        <Button onClick={toggleForm}>
          {showForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-1" /> Add Entry</>}
        </Button>
      </div>
      
      {showForm && (
        <SectionForm section={section} onSuccess={handleFormSuccess} />
      )}
      
      <div className="mt-4 space-y-4">
        {todayEntries.length === 0 ? (
          <div className="text-center p-6 bg-secondary/30 rounded-lg">
            <p className="text-muted-foreground">No entries for today</p>
            {!showForm && (
              <Button variant="outline" className="mt-2" onClick={toggleForm}>
                <Plus className="h-4 w-4 mr-1" /> Add your first entry
              </Button>
            )}
          </div>
        ) : (
          todayEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} section={section} />
          ))
        )}
      </div>
    </div>
  );
}
