"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link as LinkIcon, 
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
} from 'lucide-react';
import type { NotionFloatingToolbarProps } from '@/shared/types';

type FloatingToolbarProps = NotionFloatingToolbarProps;

export const NotionFloatingToolbar = ({ 
  isVisible, 
  position, 
  onFormat, 
  onClose, 
  activeFormats,
  onSetTextColor,
  onSetFontFamily
}: FloatingToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const formatButtons = [
    { format: 'bold', icon: Bold, label: 'Bold' },
    { format: 'italic', icon: Italic, label: 'Italic' },
    { format: 'underline', icon: Underline, label: 'Underline' },
    { format: 'strike', icon: Strikethrough, label: 'Strikethrough' },
    { format: 'code', icon: Code, label: 'Inline code' },
    { format: 'highlight', icon: Palette, label: 'Highlight' },
  ];

  const alignmentButtons = [
    { format: 'alignLeft', icon: AlignLeft, label: 'Align left' },
    { format: 'alignCenter', icon: AlignCenter, label: 'Align center' },
    { format: 'alignRight', icon: AlignRight, label: 'Align right' },
    { format: 'alignJustify', icon: AlignJustify, label: 'Justify' },
  ];

  const colors = [
    { name: 'default', color: '#000000', label: 'Default' },
    { name: 'gray', color: '#6b7280', label: 'Gray' },
    { name: 'red', color: '#dc2626', label: 'Red' },
    { name: 'orange', color: '#ea580c', label: 'Orange' },
    { name: 'yellow', color: '#ca8a04', label: 'Yellow' },
    { name: 'green', color: '#16a34a', label: 'Green' },
    { name: 'blue', color: '#2563eb', label: 'Blue' },
    { name: 'purple', color: '#9333ea', label: 'Purple' },
    { name: 'pink', color: '#db2777', label: 'Pink' },
    // Dark theme friendly colors
    { name: 'white', color: '#ffffff', label: 'White' },
    { name: 'light-gray', color: '#d1d5db', label: 'Light Gray' },
    { name: 'light-blue', color: '#60a5fa', label: 'Light Blue' },
    { name: 'light-green', color: '#4ade80', label: 'Light Green' },
  ];

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif', label: 'Inter' },
    { name: 'Arial', value: 'Arial, sans-serif', label: 'Arial' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { name: 'Times', value: 'Times New Roman, serif', label: 'Times' },
    { name: 'Georgia', value: 'Georgia, serif', label: 'Georgia' },
    { name: 'Courier', value: 'Courier New, monospace', label: 'Courier' },
    { name: 'Monaco', value: 'Monaco, monospace', label: 'Monaco' },
  ];

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[999999] bg-gray-900 text-white rounded-lg shadow-lg p-1 flex items-center gap-1"
      style={{
        left: position.x,
        top: (() => {
          const toolbarHeight = 50; // approximate toolbar height
          const viewportHeight = window.innerHeight;
          const toolbarTop = position.y - toolbarHeight;
          
          // If toolbar would go above viewport, show it below the cursor
          if (toolbarTop < 0) {
            return position.y + 20;
          }
          return toolbarTop;
        })(),
        transform: 'translateX(-50%)',
      }}
    >
      {/* Text formatting buttons */}
      {formatButtons.map(({ format, icon: Icon, label }) => (
        <button
          key={format}
          onClick={() => onFormat(format)}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            activeFormats.includes(format) ? 'bg-gray-700' : ''
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}

      <div className="w-px h-4 bg-gray-600 mx-1" />

      {/* Link button */}
      <button
        onClick={() => onFormat('link')}
        className="p-1.5 rounded hover:bg-gray-700 transition-colors"
        title="Add link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-4 bg-gray-600 mx-1" />

      {/* Color picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1.5 rounded hover:bg-gray-700 transition-colors"
          title="Text color"
        >
          <Palette className="h-4 w-4" />
        </button>

        {showColorPicker && (
          <div 
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48"
            style={{
              top: (() => {
                const pickerHeight = 200; // approximate height
                const viewportHeight = window.innerHeight;
                const pickerTop = 100; // top-full + mt-1
                
                // If picker would go below viewport, show it above
                if (pickerTop + pickerHeight > viewportHeight) {
                  return -pickerHeight - 10;
                }
                return pickerTop;
              })(),
              left: 0,
            }}
          >
            <div className="text-xs text-gray-500 mb-2">Text color</div>
            <div className="grid grid-cols-3 gap-1">
              {colors.map(({ name, color, label }) => (
                <button
                  key={name}
                  onClick={() => {
                    onSetTextColor?.(color);
                    setShowColorPicker(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-100 text-left"
                  title={label}
                >
                  <div 
                    className="w-4 h-4 rounded border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-700">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Font family picker */}
      <div className="relative">
        <button
          onClick={() => setShowFontPicker(!showFontPicker)}
          className="p-1.5 rounded hover:bg-gray-700 transition-colors"
          title="Font family"
        >
          <Type className="h-4 w-4" />
        </button>

        {showFontPicker && (
          <div 
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-40"
            style={{
              top: (() => {
                const pickerHeight = 200; // approximate height
                const viewportHeight = window.innerHeight;
                const pickerTop = 100; // top-full + mt-1
                
                // If picker would go below viewport, show it above
                if (pickerTop + pickerHeight > viewportHeight) {
                  return -pickerHeight - 10;
                }
                return pickerTop;
              })(),
              left: 0,
            }}
          >
            <div className="text-xs text-gray-500 mb-2">Font family</div>
            <div className="space-y-1">
              {fonts.map(({ name, value, label }) => (
                <button
                  key={name}
                  onClick={() => {
                    onSetFontFamily?.(value);
                    setShowFontPicker(false);
                  }}
                  className="w-full text-left p-1.5 rounded hover:bg-gray-100 text-xs"
                  style={{ fontFamily: value }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-gray-600 mx-1" />

      {/* Alignment buttons */}
      {alignmentButtons.map(({ format, icon: Icon, label }) => (
        <button
          key={format}
          onClick={() => onFormat(format)}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            activeFormats.includes(format) ? 'bg-gray-700' : ''
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};
