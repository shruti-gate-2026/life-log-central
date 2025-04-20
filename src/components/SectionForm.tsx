
import React, { useState } from 'react';
import { FieldType, SectionType, useTracker } from '../contexts/TrackerContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface SectionFormProps {
  section: SectionType;
  onSuccess?: () => void;
}

export function SectionForm({ section, onSuccess }: SectionFormProps) {
  const { createEntry } = useTracker();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: FieldType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check required fields
    const missingFields = section.fields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.name);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Create the entry
    createEntry(section.id, formData);
    
    // Reset form
    setFormData({});
    
    // Show success message
    toast({
      title: "Entry Added",
      description: `Successfully added entry to ${section.name}`,
    });

    setIsSubmitting(false);
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  const renderField = (field: FieldType) => {
    switch (field.type) {
      case 'text':
        return (
          <div className="form-group" key={field.id}>
            <Label htmlFor={field.id}>{field.name}</Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="form-group" key={field.id}>
            <Label htmlFor={field.id}>{field.name}</Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
            />
          </div>
        );
      case 'number':
        return (
          <div className="form-group" key={field.id}>
            <Label htmlFor={field.id}>{field.name}</Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || '')}
            />
          </div>
        );
      case 'boolean':
        return (
          <div className="form-group flex items-center justify-between" key={field.id}>
            <Label htmlFor={field.id}>{field.name}</Label>
            <Switch
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field, checked)}
            />
          </div>
        );
      case 'rating':
        return (
          <div className="form-group" key={field.id}>
            <Label htmlFor={field.id}>{field.name}</Label>
            <div className="flex justify-between mt-2">
              {field.options?.map((option) => (
                <Button
                  key={option.value.toString()}
                  type="button"
                  variant={formData[field.id] === option.value ? "default" : "outline"}
                  className="h-10 w-10 p-0 rounded-full"
                  onClick={() => handleInputChange(field, option.value)}
                >
                  {option.value}
                </Button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{section.name}</CardTitle>
          <CardDescription>{section.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {section.fields.map(renderField)}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
