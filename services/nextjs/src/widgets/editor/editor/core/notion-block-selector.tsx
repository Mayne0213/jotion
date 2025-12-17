"use client";

import { useState, useEffect } from 'react';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Code2, 
  Image as ImageIcon, 
  Table as TableIcon,
  FileText,
  Calendar,
  Database,
  Link as LinkIcon,
  Video,
  Music,
  File,
  Star,
  Minus,
  FileCheck
} from 'lucide-react';
import type { NotionBlockSelectorProps } from '@/shared/types';

type BlockSelectorProps = NotionBlockSelectorProps;

const blockTypes = [
  {
    category: "Text blocks",
    blocks: [
      { type: "text", label: "Text", icon: FileText, description: "Just start writing with plain text." },
      { type: "heading1", label: "Heading 1", icon: Heading1, description: "Big section heading." },
      { type: "heading2", label: "Heading 2", icon: Heading2, description: "Medium section heading." },
      { type: "heading3", label: "Heading 3", icon: Heading3, description: "Small section heading." },
      { type: "blockquote", label: "Quote", icon: Quote, description: "Capture a quote." },
      { type: "codeBlock", label: "Code", icon: Code2, description: "Capture a code snippet." },
      { type: "divider", label: "Divider", icon: Minus, description: "Add a horizontal divider." },
    ]
  },
  {
    category: "List blocks",
    blocks: [
      { type: "bulletList", label: "Bulleted list", icon: List, description: "Create a simple bulleted list." },
      { type: "orderedList", label: "Numbered list", icon: ListOrdered, description: "Create a list with numbering." },
      { type: "taskList", label: "To-do list", icon: CheckSquare, description: "Track tasks with a to-do list." },
    ]
  },
  {
    category: "Media",
    blocks: [
      { type: "image", label: "Image", icon: ImageIcon, description: "Upload or embed with a link." },
      { type: "video", label: "Video", icon: Video, description: "Embed from YouTube, Vimeo, etc." },
      { type: "audio", label: "Audio", icon: Music, description: "Upload or embed with a link." },
      { type: "file", label: "File", icon: File, description: "Upload any type of file." },
    ]
  },
  {
    category: "Advanced",
    blocks: [
      { type: "table", label: "Table", icon: TableIcon, description: "Add a simple table." },
      { type: "calendar", label: "Calendar", icon: Calendar, description: "Create a calendar view." },
      { type: "documentLink", label: "Document Link", icon: FileCheck, description: "Link to another document." },
      { type: "bookmark", label: "Bookmark", icon: Star, description: "Save a link as a bookmark." },
    ]
  },
];

export const NotionBlockSelector = ({ isOpen, onClose, onSelect, position }: BlockSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredBlocks = blockTypes.flatMap(category => 
    category.blocks.filter(block => 
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredBlocks.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredBlocks.length) % filteredBlocks.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredBlocks[selectedIndex]) {
            onSelect(filteredBlocks[selectedIndex].type);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredBlocks, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999]" onClick={onClose}>
      <div 
        className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-72 sm:w-80 max-h-80 sm:max-h-96 overflow-hidden"
        style={{
          left: Math.min(position?.x || 0, window.innerWidth - 320),
          top: (() => {
            const menuHeight = 320; // max-h-80 = 20rem = 320px on mobile
            const viewportHeight = window.innerHeight;
            const menuTop = position?.y || 0;
            
            // If menu would go below viewport, show it above the cursor
            if (menuTop + menuHeight > viewportHeight) {
              return Math.max(0, menuTop - menuHeight - 10);
            }
            return menuTop;
          })(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="px-2 py-1 mb-2">
          <input
            type="text"
            placeholder="Search for a block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Block list */}
        <div className="overflow-y-auto max-h-64 sm:max-h-80">
          {blockTypes.map((category, categoryIndex) => {
            const categoryBlocks = category.blocks.filter(block => 
              block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              block.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (categoryBlocks.length === 0) return null;

            return (
              <div key={categoryIndex} className="mb-2">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {category.category}
                </div>
                {categoryBlocks.map((block, blockIndex) => {
                  const globalIndex = blockTypes
                    .slice(0, categoryIndex)
                    .reduce((acc, cat) => acc + cat.blocks.length, 0) + blockIndex;
                  
                  const isSelected = globalIndex === selectedIndex;
                  const Icon = block.icon;

                  return (
                    <button
                      key={block.type}
                      onClick={() => onSelect(block.type)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-2 py-1 sm:py-2 text-left hover:bg-gray-100 rounded ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {block.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate hidden sm:block">
                          {block.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-2 py-1 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
