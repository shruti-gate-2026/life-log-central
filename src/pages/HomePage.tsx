
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from '../contexts/TrackerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionList } from '../components/SectionList';
import { CalendarCheck, BarChart2 } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { getSectionCompletionForDate, getCurrentDateString } = useTracker();
  
  const { completed, missing } = getSectionCompletionForDate(getCurrentDateString());
  const totalSections = completed.length + missing.length;
  const completionPercentage = totalSections === 0 
    ? 0 
    : Math.round((completed.length / totalSections) * 100);
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">LifeTracker</h1>
        <p className="text-muted-foreground mt-2">
          Track your daily activities, habits and progress
        </p>
      </div>
      
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-2">Today's Progress</h2>
            <div className="text-5xl font-bold my-3">{completionPercentage}%</div>
            <p className="mb-4">
              You've completed {completed.length} of {totalSections} sections
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="secondary" 
                className="text-primary"
                onClick={() => navigate('/daily')}
              >
                <CalendarCheck className="h-4 w-4 mr-2" />
                Daily View
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate('/dashboard')}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {missing.length > 0 && (
        <SectionList 
          title="Sections To Complete Today" 
          sections={missing}
          onSectionClick={(section) => navigate(`/section/${section.id}`)}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Why Track Your Life?</CardTitle>
          <CardDescription>Benefits of daily tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary p-1 rounded mr-2 mt-0.5">1</span>
              <span>
                <strong>Awareness</strong> - Understand how you spend your time and energy
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary p-1 rounded mr-2 mt-0.5">2</span>
              <span>
                <strong>Accountability</strong> - Hold yourself responsible for your goals
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary p-1 rounded mr-2 mt-0.5">3</span>
              <span>
                <strong>Progress</strong> - See your improvement over time with visual data
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary p-1 rounded mr-2 mt-0.5">4</span>
              <span>
                <strong>Motivation</strong> - Stay motivated by tracking your streaks
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
