
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionType, useTracker } from '../contexts/TrackerContext';
import { 
  Home, Briefcase, BookOpen, Code, Edit, Plus, Book, 
  ClipboardList, HeartHandshake, Utensils, DollarSign, Smile, Heart, Feather
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Map section IDs to icons
const getIconForSection = (iconName: string) => {
  switch (iconName) {
    case 'book': return <Book className="h-6 w-6" />;
    case 'briefcase': return <Briefcase className="h-6 w-6" />;
    case 'clipboard': return <ClipboardList className="h-6 w-6" />;
    case 'book-open': return <BookOpen className="h-6 w-6" />;
    case 'code': return <Code className="h-6 w-6" />;
    case 'edit': return <Edit className="h-6 w-6" />;
    case 'utensils': return <Utensils className="h-6 w-6" />;
    case 'money': return <DollarSign className="h-6 w-6" />;
    case 'smile': return <Smile className="h-6 w-6" />;
    case 'heart': return <Heart className="h-6 w-6" />;
    case 'feather': return <Feather className="h-6 w-6" />;
    default: return <Home className="h-6 w-6" />;
  }
};

interface SectionCardProps {
  section: SectionType;
  entryCount?: number;
  onClick?: () => void;
}

export function SectionCard({ section, entryCount = 0, onClick }: SectionCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/section/${section.id}`);
    }
  };

  return (
    <Card 
      className="card-shadow border border-border cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-md text-primary">
              {getIconForSection(section.icon)}
            </div>
            <CardTitle className="text-lg">{section.name}</CardTitle>
          </div>
          {section.frequency && (
            <Badge variant="outline" className="ml-2 text-xs">
              {section.frequency}
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {section.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-1 pb-3 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {entryCount} {entryCount === 1 ? 'entry' : 'entries'} today
        </div>
        <Button variant="outline" size="sm" className="text-primary">
          <Plus className="h-4 w-4 mr-1" /> Add Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
