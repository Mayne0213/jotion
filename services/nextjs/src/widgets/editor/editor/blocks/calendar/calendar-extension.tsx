import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CalendarComponent } from './calendar-component';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  color?: string;
  description?: string;
}

export interface CalendarAttributes {
  events: CalendarEvent[];
  title?: string;
  view: 'month' | 'week';
  selectedDate?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    calendar: {
      setCalendar: (attributes: CalendarAttributes) => ReturnType;
    };
  }
}

export const CalendarExtension = Node.create({
  name: 'calendar',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      events: {
        default: [],
        parseHTML: element => {
          const data = element.getAttribute('data-events');
          return data ? JSON.parse(data) : [];
        },
        renderHTML: attributes => {
          return {
            'data-events': JSON.stringify(attributes.events),
          };
        },
      },
      title: {
        default: 'Calendar',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          return {
            'data-title': attributes.title,
          };
        },
      },
      view: {
        default: 'month',
        parseHTML: element => element.getAttribute('data-view') as 'month' | 'week',
        renderHTML: attributes => {
          return {
            'data-view': attributes.view,
          };
        },
      },
      selectedDate: {
        default: new Date().toISOString(),
        parseHTML: element => element.getAttribute('data-selected-date'),
        renderHTML: attributes => {
          return {
            'data-selected-date': attributes.selectedDate,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="calendar"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': 'calendar' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalendarComponent);
  },

  addCommands() {
    return {
      setCalendar:
        (attributes: CalendarAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});

