"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCalendar: (config: { title: string; view: 'month' | 'week' }) => void;
}

export const CalendarModal = ({ isOpen, onClose, onCreateCalendar }: CalendarModalProps) => {
  const [title, setTitle] = useState('Calendar');
  const [view, setView] = useState<'month' | 'week'>('month');

  if (!isOpen) return null;

  const handleCreate = () => {
    onCreateCalendar({ title, view });
    onClose();
    // Reset
    setTitle('Calendar');
    setView('month');
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setTitle('Calendar');
      setView('month');
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Calendar</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calendar Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter calendar title..."
            />
          </div>

          {/* View Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default View
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setView('month')}
                className={`
                  px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all
                  ${
                    view === 'month'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">📅</div>
                  <div>Month View</div>
                </div>
              </button>
              <button
                onClick={() => setView('week')}
                className={`
                  px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all
                  ${
                    view === 'week'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">📆</div>
                  <div>Week View</div>
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 You can add events by clicking on any date in the calendar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Create Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

