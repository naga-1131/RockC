export type EventCategory = 'work' | 'personal' | 'meeting' | 'urgent';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  category: EventCategory;
  color?: string;
}

export type CalendarView = 'month' | 'week' | 'day';
