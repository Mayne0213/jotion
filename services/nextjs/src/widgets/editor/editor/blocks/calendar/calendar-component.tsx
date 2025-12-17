"use client";

import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Trash2,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import type { CalendarEvent } from './calendar-extension';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EVENT_COLORS = [
  { name: 'Blue', value: 'bg-blue-500', light: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  { name: 'Red', value: 'bg-red-500', light: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  { name: 'Green', value: 'bg-green-500', light: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  { name: 'Purple', value: 'bg-purple-500', light: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  { name: 'Yellow', value: 'bg-yellow-500', light: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
];

export const CalendarComponent = ({ node, updateAttributes, deleteNode, editor }: any) => {
  const { events, view, selectedDate } = node.attrs;
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate || new Date()));
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Check if editor is in read-only mode (e.g., shared document)
  const isEditable = editor?.isEditable ?? true;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((event: CalendarEvent) => event.date.startsWith(dateStr));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}`,
    };
    updateAttributes({ events: [...events, newEvent] });
    setShowEventModal(false);
    setSelectedDay(null);
    setEditingEvent(null);
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    const newEvents = events.map((e: CalendarEvent) =>
      e.id === eventId ? { ...e, ...updates } : e
    );
    updateAttributes({ events: newEvents });
  };

  const deleteEvent = (eventId: string) => {
    const newEvents = events.filter((e: CalendarEvent) => e.id !== eventId);
    updateAttributes({ events: newEvents });
  };

  const openEventModal = (date: Date) => {
    setSelectedDay(date);
    setShowEventModal(true);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <NodeViewWrapper className="my-4">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1F1F1F] shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-1">
            <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Calendar</span>
          </div>
          {isEditable && (
            <button
              onClick={deleteNode}
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
              title="Delete calendar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1F1F1F] border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4 bg-white dark:bg-[#1F1F1F]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isToday = day && day.getTime() === today.getTime();
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border rounded-lg transition-colors
                    ${day ? `bg-white dark:bg-gray-800 ${isEditable ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : 'cursor-default'}` : 'bg-gray-50 dark:bg-gray-900 cursor-default'}
                    ${isToday ? 'border-blue-500 dark:border-blue-400 border-2' : 'border-gray-200 dark:border-gray-700'}
                  `}
                  onClick={() => day && isEditable && openEventModal(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event: CalendarEvent) => {
                          const color = EVENT_COLORS.find(c => c.value === event.color) || EVENT_COLORS[0];
                          return (
                            <div
                              key={event.id}
                              className={`text-xs px-1.5 py-0.5 rounded truncate ${color.light} ${color.text} ${isEditable ? 'cursor-pointer' : 'cursor-default'}`}
                              onClick={(e) => {
                                if (isEditable) {
                                  e.stopPropagation();
                                  setEditingEvent(event);
                                  setShowEventModal(true);
                                }
                              }}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Modal - only show if editable */}
        {showEventModal && isEditable && (
          <EventModal
            isOpen={showEventModal}
            onClose={() => {
              setShowEventModal(false);
              setSelectedDay(null);
              setEditingEvent(null);
            }}
            onSave={addEvent}
            onUpdate={(updates) => {
              if (editingEvent) {
                updateEvent(editingEvent.id, updates);
                setShowEventModal(false);
                setEditingEvent(null);
              }
            }}
            onDelete={() => {
              if (editingEvent) {
                deleteEvent(editingEvent.id);
                setShowEventModal(false);
                setEditingEvent(null);
              }
            }}
            selectedDate={selectedDay}
            editingEvent={editingEvent}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (updates: Partial<CalendarEvent>) => void;
  onDelete: () => void;
  selectedDate: Date | null;
  editingEvent: CalendarEvent | null;
}

const EventModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate,
  onDelete,
  selectedDate,
  editingEvent 
}: EventModalProps) => {
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [date, setDate] = useState(
    editingEvent?.date || selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [color, setColor] = useState(editingEvent?.color || EVENT_COLORS[0].value);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editingEvent) {
      onUpdate({ title, description, date, color });
    } else {
      onSave({ title, description, date, color });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999999] bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1F1F1F] rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingEvent ? 'Edit Event' : 'New Event'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Event title..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              rows={3}
              placeholder="Event description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {EVENT_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`
                    w-8 h-8 rounded-full ${c.value}
                    ${color === c.value ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-400 dark:ring-gray-500' : ''}
                  `}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {editingEvent && (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
            >
              Delete
            </button>
          )}
          <div className={`flex gap-2 ${!editingEvent ? 'ml-auto' : ''}`}>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

