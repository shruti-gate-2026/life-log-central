
import React, { useMemo } from 'react';
import { useTracker } from '../contexts/TrackerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function WeeklyDashboard() {
  const { entries, sections, getCurrentDateString } = useTracker();
  
  // Calculate the date range for the past week
  const pastWeekDates = useMemo(() => {
    const dates = [];
    const today = new Date(getCurrentDateString());
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }, [getCurrentDateString]);
  
  // Filter entries for the past week
  const weekEntries = useMemo(() => {
    return entries.filter(entry => pastWeekDates.includes(entry.date));
  }, [entries, pastWeekDates]);
  
  // GATE study hours chart data
  const gateStudyData = useMemo(() => {
    const data = pastWeekDates.map(date => {
      const dayEntries = weekEntries.filter(
        entry => entry.date === date && entry.sectionId === 'gate'
      );
      
      const totalHours = dayEntries.reduce((sum, entry) => {
        return sum + (entry.data.time || 0);
      }, 0);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        hours: totalHours
      };
    });
    
    return data;
  }, [weekEntries, pastWeekDates]);
  
  // Job applications chart data
  const jobAppsData = useMemo(() => {
    const data = pastWeekDates.map(date => {
      const dayEntries = weekEntries.filter(
        entry => entry.date === date && entry.sectionId === 'jobs'
      );
      
      const totalApps = dayEntries.reduce((sum, entry) => {
        return sum + (entry.data.count || 0);
      }, 0);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        applications: totalApps
      };
    });
    
    return data;
  }, [weekEntries, pastWeekDates]);
  
  // Section completion pie chart data
  const sectionCompletionData = useMemo(() => {
    const sectionCounts = new Map();
    
    weekEntries.forEach(entry => {
      const sectionId = entry.sectionId;
      sectionCounts.set(sectionId, (sectionCounts.get(sectionId) || 0) + 1);
    });
    
    return Array.from(sectionCounts.entries()).map(([sectionId, count]) => {
      const section = sections.find(s => s.id === sectionId);
      return {
        name: section?.name || sectionId,
        value: count
      };
    }).sort((a, b) => b.value - a.value);
  }, [weekEntries, sections]);
  
  // Sugar-free days streak
  const sugarFreeData = useMemo(() => {
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (const date of pastWeekDates) {
      const dayEntries = weekEntries.filter(
        entry => entry.date === date && entry.sectionId === 'diet'
      );
      
      const stuckToGoal = dayEntries.some(entry => entry.data.stuck === true);
      
      if (stuckToGoal) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (dayEntries.length > 0) {
        currentStreak = 0;
      }
    }
    
    return { currentStreak, maxStreak };
  }, [weekEntries, pastWeekDates]);
  
  // Expense tracking
  const expenseData = useMemo(() => {
    const data = {
      totalSpent: 0,
      totalIncome: 0,
      expenseByDay: pastWeekDates.map(date => {
        const dayEntries = weekEntries.filter(
          entry => entry.date === date && entry.sectionId === 'money'
        );
        
        const spent = dayEntries.reduce((sum, entry) => sum + (entry.data.spent || 0), 0);
        const income = dayEntries.reduce((sum, entry) => {
          return entry.data.income ? sum + (entry.data.income_amount || 0) : sum;
        }, 0);
        
        return {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          spent,
          income
        };
      })
    };
    
    data.totalSpent = data.expenseByDay.reduce((sum, day) => sum + day.spent, 0);
    data.totalIncome = data.expenseByDay.reduce((sum, day) => sum + day.income, 0);
    
    return data;
  }, [weekEntries, pastWeekDates]);
  
  // COLORS for charts
  const COLORS = ['#14b8a6', '#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#f59e0b'];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Dashboard</CardTitle>
          <CardDescription>Your progress over the past 7 days</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GATE Study Hours */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">GATE Study Hours</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gateStudyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Job Applications */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Job Applications</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobAppsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Section Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Section Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectionCompletionData.slice(0, 7)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sectionCompletionData.slice(0, 7).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Sugar Free Challenge */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">No Sugar/Maida Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-6xl font-bold text-primary mb-2">
                {sugarFreeData.currentStreak}
              </div>
              <div className="text-lg text-muted-foreground">Current Streak (days)</div>
              <div className="mt-4 text-sm">
                Longest streak this week: <span className="font-medium">{sugarFreeData.maxStreak} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
