import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Bell, 
  Settings, 
  User, 
  MessageSquare, 
  Hash, 
  ChevronDown,
  Plus,
  LayoutDashboard,
  Users,
  FileText,
  MoreHorizontal,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Calendar } from './Calendar';
import { EventModal } from './EventModal';
import { CalendarEvent } from './types';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily sync with the engineering team',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 30, 0, 0)),
    category: 'work',
  },
  {
    id: '2',
    title: 'Project Review',
    description: 'Reviewing the new calendar module',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    category: 'meeting',
  },
  {
    id: '3',
    title: 'GSoC Proposal Deadline',
    description: 'Final submission for Rocket.Chat project',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    category: 'urgent',
  }
];

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (eventData.id) {
      // Update
      setEvents(prev => prev.map(e => e.id === eventData.id ? { ...e, ...eventData } as CalendarEvent : e));
    } else {
      // Create
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Math.random().toString(36).substr(2, 9),
      } as CalendarEvent;
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Rocket.Chat Sidebar Mock */}
      <aside className="w-64 bg-slate-800 text-slate-300 flex flex-col shrink-0">
        <div className="p-4 flex items-center gap-3 border-b border-slate-700/50">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <span className="font-bold text-white tracking-tight">Rocket.Chat</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <nav className="px-3 space-y-1">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarItem icon={<MessageSquare size={18} />} label="Messages" badge="12" />
            <SidebarItem icon={<CalendarIcon size={18} />} label="Calendar" active />
            <SidebarItem icon={<Users size={18} />} label="Teams" />
            <SidebarItem icon={<FileText size={18} />} label="Files" />
          </nav>

          <div className="px-3">
            <div className="flex items-center justify-between px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>Channels</span>
              <Plus size={14} className="cursor-pointer hover:text-white" />
            </div>
            <nav className="space-y-1">
              <SidebarItem icon={<Hash size={16} />} label="general" />
              <SidebarItem icon={<Hash size={16} />} label="engineering" />
              <SidebarItem icon={<Hash size={16} />} label="gsoc-2026" />
            </nav>
          </div>

          <div className="px-3">
            <div className="flex items-center justify-between px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>Direct Messages</span>
              <Plus size={14} className="cursor-pointer hover:text-white" />
            </div>
            <nav className="space-y-1">
              <SidebarItem icon={<div className="w-2 h-2 rounded-full bg-green-500" />} label="John Doe" />
              <SidebarItem icon={<div className="w-2 h-2 rounded-full bg-slate-500" />} label="Jane Smith" />
              <SidebarItem icon={<div className="w-2 h-2 rounded-full bg-yellow-500" />} label="Alex Mentor" />
            </nav>
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">PV</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Prince V.</p>
            <p className="text-xs text-slate-500 truncate">Online</p>
          </div>
          <Settings size={16} className="text-slate-500 cursor-pointer hover:text-white" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <CalendarIcon className="text-blue-600" />
            <h1 className="text-lg font-bold text-slate-800">Personal Calendar</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm w-64 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                <Settings size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                icon={<CheckCircle2 className="text-green-500" />} 
                label="Today's Tasks" 
                value="4 Completed" 
                subtext="2 remaining for today"
              />
              <StatCard 
                icon={<Clock className="text-blue-500" />} 
                label="Next Event" 
                value="Team Standup" 
                subtext="In 15 minutes"
              />
              <StatCard 
                icon={<Users className="text-purple-500" />} 
                label="Shared Calendars" 
                value="3 Active" 
                subtext="Engineering, GSoC, Marketing"
              />
            </div>

            {/* Calendar Module */}
            <div className="h-[calc(100vh-350px)] min-h-[600px]">
              <Calendar 
                events={events} 
                onAddEvent={handleAddEvent} 
                onEditEvent={handleEditEvent} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        initialDate={selectedDate}
      />
    </div>
  );
}

function SidebarItem({ icon, label, active = false, badge }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all group",
      active ? "bg-blue-600 text-white" : "hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
    )}>
      <div className="flex items-center gap-3">
        <span className={cn(active ? "text-white" : "text-slate-500 group-hover:text-slate-300")}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{badge}</span>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
    >
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtext}</p>
      </div>
    </motion.div>
  );
}
