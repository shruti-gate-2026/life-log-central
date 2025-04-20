
import React from 'react';
import { EntryType, SectionType, FieldType, useTracker } from '../contexts/TrackerContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EntryCardProps {
  entry: EntryType;
  section: SectionType;
}

export function EntryCard({ entry, section }: EntryCardProps) {
  const { deleteEntry } = useTracker();
  const { toast } = useToast();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDelete = () => {
    deleteEntry(entry.id);
    toast({
      title: "Entry Deleted",
      description: `Entry from ${section.name} has been deleted`,
    });
  };

  const renderFieldValue = (field: FieldType, value: any) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }

    switch (field.type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'rating':
        if (field.options) {
          const option = field.options.find(opt => opt.value === value);
          return `${value} - ${option?.label || ''}`;
        }
        return value;
      default:
        return value;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium">{section.name}</CardTitle>
          <div className="flex items-center text-muted-foreground text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(entry.createdAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-1">
        <div className="space-y-2">
          {section.fields.map(field => (
            <div key={field.id} className="text-sm">
              <span className="font-medium text-foreground">{field.name}: </span>
              <span className="text-muted-foreground">
                {renderFieldValue(field, entry.data[field.id])}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
