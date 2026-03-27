import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Tag,
  MoreVertical,
  Search,
  Bell,
  Settings,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { CalendarEvent, CalendarView, EventCategory } from './types';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: CalendarEvent) => void;
}

const CATEGORY_COLORS: Record<EventCategory, string> = {
  work: 'bg-blue-100 text-blue-700 border-blue-200',
  personal: 'bg-green-100 text-green-700 border-green-200',
  meeting: 'bg-purple-100 text-purple-700 border-purple-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
};

export const Calendar: React.FC<CalendarProps> = ({ events, onAddEvent, onEditEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.start, day));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Calendar Header */}
      <header className="flex items-center justify-between px-6 py-4 border-bottom border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium hover:bg-slate-100 rounded-md transition-colors text-slate-600 border-x border-slate-100"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                  view === v 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <button 
            onClick={() => onAddEvent(new Date())}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md shadow-blue-100 active:scale-95"
          >
            <Plus size={18} />
            <span>Add Event</span>
          </button>
        </div>
      </header>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-slate-50/20">
        <div className="grid grid-cols-7 grid-rows-5 h-full min-h-[600px]">
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDay = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[120px] p-2 border-r border-b border-slate-100 transition-colors group relative",
                  !isCurrentMonth ? "bg-slate-50/50" : "bg-white hover:bg-slate-50/30",
                  idx % 7 === 6 ? "border-r-0" : ""
                )}
                onClick={() => onAddEvent(day)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all",
                    isTodayDay 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : isCurrentMonth ? "text-slate-700" : "text-slate-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                      {dayEvents.length} {dayEvents.length === 1 ? 'Event' : 'Events'}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                  {dayEvents.slice(0, 3).map((event) => (
                    <motion.div
                      layoutId={event.id}
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(event);
                      }}
                      className={cn(
                        "px-2 py-1 text-xs rounded-md border truncate cursor-pointer transition-all hover:brightness-95 active:scale-[0.98]",
                        CATEGORY_COLORS[event.category]
                      )}
                    >
                      {event.title}
                    </motion.div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-400 font-medium pl-1">
                      + {dayEvents.length - 3} more
                    </div>
                  )}
                </div>
                
                {/* Hover Quick Add */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="p-1 bg-blue-50 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100">
                      <Plus size={14} />
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
