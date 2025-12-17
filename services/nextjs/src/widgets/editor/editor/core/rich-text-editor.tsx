"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Highlight from '@tiptap/extension-highlight';
import { useState, useEffect, useRef } from 'react';
import { NotionBlockSelector } from './notion-block-selector';
import { NotionFloatingToolbar } from './notion-floating-toolbar';
import { DocumentLink } from '../blocks/document-link/document-link-extension';
import { HeadingId } from '../blocks/heading/heading-id-extension';
import { BookmarkExtension } from '../blocks/bookmark/bookmark-extension';
import { CalendarExtension } from '../blocks/calendar/calendar-extension';
import { BookmarkModal } from '../blocks/bookmark/bookmark-modal';
import { CalendarModal } from '../blocks/calendar/calendar-modal';
import { ImageUploadExtension } from '../blocks/image/image-upload-extension';
import { AudioExtension } from '../blocks/audio/audio-extension';
import { FileExtension } from '../blocks/file/file-extension';
import type { RichTextEditorProps } from '@/shared/types';

export const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  editable = true,
  readOnly = false,
  availableDocuments = []
}: RichTextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [hasSelectedText, setHasSelectedText] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            'data-block-id': () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
        },
        // Keep default codeBlock enabled
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      Highlight.configure({
        multicolor: true,
      }),
      DocumentLink,
      HeadingId,
      BookmarkExtension,
      CalendarExtension,
      ImageUploadExtension,
      AudioExtension,
      FileExtension,
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);
      setSelectedText(selectedText);
      setHasSelectedText(selectedText.trim().length > 0);
      
      if (selectedText.length > 0 && !readOnly) {
        const coords = editor.view.coordsAtPos(from);
        setToolbarPosition({ x: coords.left, y: coords.top });
        setShowFloatingToolbar(true);
      } else {
        setShowFloatingToolbar(false);
      }
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === '/' && !readOnly) {
          const { from } = view.state.selection;
          const coords = view.coordsAtPos(from);
          setToolbarPosition({ x: coords.left, y: coords.top + 20 });
          setShowBlockSelector(true);
          return true;
        }
        return false;
      },
    },
  });


  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    // Create a simple modal for link input
    const linkModal = document.createElement('div');
    linkModal.className = 'fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center';
    
    const linkContent = document.createElement('div');
    linkContent.className = 'bg-white rounded-lg p-6 w-96 max-w-md';
    linkContent.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">Add Link</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">URL or Document</label>
        <input type="text" id="linkInput" placeholder="Enter URL or search documents..." 
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      ${availableDocuments.length > 0 ? `
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Link to Document</label>
          <select id="documentSelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select a document...</option>
            ${availableDocuments.map(doc => `<option value="/documents/${doc.id}">${doc.title}</option>`).join('')}
          </select>
        </div>
      ` : ''}
      <div class="flex justify-end gap-2">
        <button id="cancelBtn" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
        <button id="addBtn" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Link</button>
      </div>
    `;
    
    linkModal.appendChild(linkContent);
    document.body.appendChild(linkModal);
    
    const linkInput = linkContent.querySelector('#linkInput') as HTMLInputElement;
    const documentSelect = linkContent.querySelector('#documentSelect') as HTMLSelectElement;
    const cancelBtn = linkContent.querySelector('#cancelBtn') as HTMLButtonElement;
    const addBtn = linkContent.querySelector('#addBtn') as HTMLButtonElement;
    
    // Focus on input
    linkInput.focus();
    
    // Handle document selection
    if (documentSelect) {
      documentSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        if (target.value) {
          linkInput.value = target.value;
        }
      });
    }
    
    // Handle cancel
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(linkModal);
    });
    
    // Handle add link
    addBtn.addEventListener('click', () => {
      const url = linkInput.value.trim();
      if (url) {
        let href = url;
        
        // If it's a document link, keep as is
        if (url.startsWith('/documents/')) {
          href = url;
        } else if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
          href = `https://${url}`;
        }
        
        editor.chain().focus().setLink({ href, target: url.startsWith('/documents/') ? '_self' : '_blank' }).run();
      }
      document.body.removeChild(linkModal);
    });
    
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(linkModal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  };

  const addDocumentLink = () => {
    // Create a modal for document link selection
    const linkModal = document.createElement('div');
    linkModal.className = 'fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center';
    
    const linkContent = document.createElement('div');
    linkContent.className = 'bg-white rounded-lg p-6 w-96 max-w-md';
    linkContent.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">Add Document Link</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Select Document</label>
        <select id="documentSelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a document...</option>
          ${availableDocuments.map(doc => `<option value="${doc.id}" data-title="${doc.title}">${doc.title}</option>`).join('')}
        </select>
      </div>
      <div class="flex justify-end gap-2">
        <button id="cancelBtn" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
        <button id="addBtn" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Document Link</button>
      </div>
    `;
    
    linkModal.appendChild(linkContent);
    document.body.appendChild(linkModal);
    
    const documentSelect = linkContent.querySelector('#documentSelect') as HTMLSelectElement;
    const cancelBtn = linkContent.querySelector('#cancelBtn') as HTMLButtonElement;
    const addBtn = linkContent.querySelector('#addBtn') as HTMLButtonElement;
    
    // Focus on select
    documentSelect.focus();
    
    // Handle cancel
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(linkModal);
    });
    
    // Handle add document link
    addBtn.addEventListener('click', () => {
      const selectedOption = documentSelect.options[documentSelect.selectedIndex];
      if (selectedOption.value) {
        const documentId = selectedOption.value;
        const documentTitle = selectedOption.getAttribute('data-title') || 'Untitled Document';
        
        editor.chain().focus().setDocumentLink({ 
          documentId, 
          documentTitle 
        }).run();
      }
      document.body.removeChild(linkModal);
    });
    
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(linkModal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addBookmark = (metadata: any) => {
    editor.chain().focus().insertContent({
      type: 'bookmark',
      attrs: {
        url: metadata.url,
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        domain: metadata.domain,
        author: metadata.author,
        loading: false,
      },
    }).run();
  };

  const addCalendar = (config: { title: string; view: 'month' | 'week' }) => {
    editor.chain().focus().insertContent({
      type: 'calendar',
      attrs: {
        title: config.title,
        view: config.view,
        events: [],
        selectedDate: new Date().toISOString(),
      },
    }).run();
    setShowCalendarModal(false);
  };

  const handleBlockSelect = (blockType: string) => {
    setShowBlockSelector(false);
    
    switch (blockType) {
      case 'text':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'taskList':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'image':
        editor.chain().focus().setImageUpload().run();
        break;
      case 'audio':
        editor.chain().focus().setAudio().run();
        break;
      case 'file':
        editor.chain().focus().setFile().run();
        break;
      case 'table':
        addTable();
        break;
      case 'documentLink':
        addDocumentLink();
        break;
      case 'divider':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'emoji':
        // Emoji picker will be handled by floating toolbar
        break;
      case 'bookmark':
        setShowBookmarkModal(true);
        break;
      case 'calendar':
        setShowCalendarModal(true);
        break;
    }
  };

  const handleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'highlight':
        editor.chain().focus().toggleHighlight().run();
        break;
      case 'link':
        addLink();
        break;
      case 'alignLeft':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'alignCenter':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'alignRight':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'alignJustify':
        editor.chain().focus().setTextAlign('justify').run();
        break;
      case 'indent':
        editor.chain().focus().sinkListItem('listItem').run();
        break;
      case 'outdent':
        editor.chain().focus().liftListItem('listItem').run();
        break;
    }
  };

  const setTextColor = (color: string) => {
    // For now, we'll use CSS styling since color extension is not available
    const selection = editor.state.selection;
    if (selection.empty) return;
    
    editor.chain().focus().setMark('highlight', { color }).run();
  };

  const setFontFamily = (fontFamily: string) => {
    // For now, we'll insert a span with font family
    editor.chain().focus().insertContent(`<span style="font-family: ${fontFamily}">${editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)}</span>`).run();
  };

  const getActiveFormats = () => {
    const formats = [];
    if (editor.isActive('bold')) formats.push('bold');
    if (editor.isActive('italic')) formats.push('italic');
    if (editor.isActive('underline')) formats.push('underline');
    if (editor.isActive('strike')) formats.push('strike');
    if (editor.isActive('code')) formats.push('code');
    if (editor.isActive('highlight')) formats.push('highlight');
    if (editor.isActive({ textAlign: 'left' })) formats.push('alignLeft');
    if (editor.isActive({ textAlign: 'center' })) formats.push('alignCenter');
    if (editor.isActive({ textAlign: 'right' })) formats.push('alignRight');
    if (editor.isActive({ textAlign: 'justify' })) formats.push('alignJustify');
    return formats;
  };

  return (
    <div className="notion-editor" ref={editorRef}>
      {/* Notion-style floating toolbar - only show when not read-only */}
      {!readOnly && (
        <NotionFloatingToolbar
          isVisible={showFloatingToolbar}
          position={toolbarPosition}
          onFormat={handleFormat}
          onClose={() => setShowFloatingToolbar(false)}
          activeFormats={getActiveFormats()}
          onSetTextColor={setTextColor}
          onSetFontFamily={setFontFamily}
        />
      )}

      {/* Notion-style block selector - only show when not read-only */}
      {!readOnly && (
        <NotionBlockSelector
          isOpen={showBlockSelector}
          onClose={() => setShowBlockSelector(false)}
          onSelect={handleBlockSelect}
          position={{
            x: Math.min(toolbarPosition.x, window.innerWidth - 320), // Ensure it fits on screen
            y: toolbarPosition.y
          }}
        />
      )}

      {/* Bookmark modal - only show when not read-only */}
      {!readOnly && (
        <BookmarkModal
          isOpen={showBookmarkModal}
          onClose={() => setShowBookmarkModal(false)}
          onAddBookmark={addBookmark}
        />
      )}

      {/* Calendar modal - only show when not read-only */}
      {!readOnly && (
        <CalendarModal
          isOpen={showCalendarModal}
          onClose={() => setShowCalendarModal(false)}
          onCreateCalendar={addCalendar}
        />
      )}

      {/* Editor Content - Notion style */}
      <div className="notion-content">
        <EditorContent 
          editor={editor} 
          className="prose prose-gray focus:outline-none notion-prose"
        />
      </div>

      <style jsx global>{`
        .notion-editor {
          position: relative;
        }

        .notion-content {
          min-height: 200px;
        }

        .notion-prose {
          font-size: 16px;
          line-height: 1.6;
        }

        .notion-prose p {
          margin: 0.5rem 0;
          color: #374151;
        }

        .notion-prose h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          color: #111827;
        }

        .notion-prose h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: #111827;
        }

        .notion-prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1.25rem 0 0.5rem 0;
          color: #111827;
        }

        .notion-prose ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          list-style-type: disc;
        }

        .notion-prose ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          list-style-type: decimal;
        }

        .notion-prose li {
          margin: 0.25rem 0;
          display: list-item;
        }

        .notion-prose ul ul {
          list-style-type: circle;
        }

        .notion-prose ul ul ul {
          list-style-type: square;
        }

        .notion-prose ol ol {
          list-style-type: lower-alpha;
        }

        .notion-prose ol ol ol {
          list-style-type: lower-roman;
        }

        .notion-prose blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .notion-prose code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .notion-prose pre {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
          color: #212529;
        }

        .notion-prose pre code {
          background-color: transparent;
          padding: 0;
          color: #212529;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }

        /* Dark mode support */
        .dark .notion-prose pre {
          background-color: #1f2937;
          border-color: #374151;
          color: #f9fafb;
        }

        .dark .notion-prose pre code {
          color: #f9fafb;
        }

        .notion-prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }

        .notion-prose th,
        .notion-prose td {
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          text-align: left;
        }

        .notion-prose th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .notion-prose a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }

        .notion-prose a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .notion-prose a:visited {
          color: #7c3aed;
        }

        .notion-prose img {
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        /* Notion-style block hover effects */
        .notion-prose > * {
          position: relative;
        }

        .notion-prose > *:hover::before {
          content: '';
          position: absolute;
          left: -1.5rem;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #e5e7eb;
          border-radius: 2px;
        }

        /* Task list styling */
        .notion-prose ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .notion-prose ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.25rem 0;
          min-height: 1.5rem;
        }

        .notion-prose ul[data-type="taskList"] li input[type="checkbox"] {
          margin: 0;
          width: 1rem;
          height: 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.25rem;
          background-color: white;
          cursor: pointer;
          flex-shrink: 0;
        }

        .notion-prose ul[data-type="taskList"] li input[type="checkbox"]:checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .notion-prose ul[data-type="taskList"] li[data-checked="true"] {
          text-decoration: line-through;
          color: #6b7280;
        }

        .notion-prose ul[data-type="taskList"] li[data-checked="true"] input[type="checkbox"] {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        /* Subscript and Superscript */
        .notion-prose sub {
          font-size: 0.75em;
          vertical-align: sub;
        }

        .notion-prose sup {
          font-size: 0.75em;
          vertical-align: super;
        }

        /* Highlight */
        .notion-prose mark {
          background-color: #fef08a;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }

        /* Horizontal rule */
        .notion-prose hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }

        /* Typography improvements */
        .notion-prose {
          font-variant-ligatures: common-ligatures;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }

        /* Font family support */
        .notion-prose [data-font-family] {
          font-family: var(--font-family);
        }

        /* Color support */
        .notion-prose [data-color] {
          color: var(--text-color);
        }

        /* TipTap specific list styling */
        .notion-prose .ProseMirror ul[data-type="bulletList"] {
          list-style-type: disc;
        }

        .notion-prose .ProseMirror ol[data-type="orderedList"] {
          list-style-type: decimal;
        }

        .notion-prose .ProseMirror li {
          display: list-item;
        }

        /* Ensure list markers are visible */
        .notion-prose .ProseMirror ul li::marker {
          content: "•";
          color: #374151;
        }

        .notion-prose .ProseMirror ol li::marker {
          color: #374151;
        }


        /* Nested list styling */
        .notion-prose .ProseMirror ul ul li::marker {
          content: "◦";
        }

        .notion-prose .ProseMirror ul ul ul li::marker {
          content: "▪";
        }

        /* TipTap task list specific styling */
        .notion-prose .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .notion-prose .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.25rem 0;
          min-height: 1.5rem;
        }

        .notion-prose .ProseMirror ul[data-type="taskList"] li input[type="checkbox"] {
          margin: 0;
          width: 1rem;
          height: 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.25rem;
          background-color: white;
          cursor: pointer;
          flex-shrink: 0;
        }

        .notion-prose .ProseMirror ul[data-type="taskList"] li input[type="checkbox"]:checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .notion-prose .ProseMirror ul[data-type="taskList"] li[data-checked="true"] {
          text-decoration: line-through;
          color: #6b7280;
        }

        .notion-prose .ProseMirror ul[data-type="taskList"] li[data-checked="true"] input[type="checkbox"] {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};
