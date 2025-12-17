// Editor related types
import type { DocumentListItem } from './document';

export interface RichTextEditorProps {
  content?: any;
  onChange?: (content: any) => void;
  placeholder?: string;
  editable?: boolean;
  readOnly?: boolean;
  availableDocuments?: DocumentListItem[];
}

export interface DocumentSidebarProps {
  content: any;
  title: string;
  lastSaved?: Date;
  wordCount: number;
  documentId?: string;
  published?: boolean;
  onShare?: () => void;
  onUnshare?: () => void;
  onCreateTemplate?: (templateData: any) => void | Promise<void>;
  onApplyTemplate?: (template: any) => void;
}

export interface NotionBlockSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (blockType: string) => void;
  position: { x: number; y: number };
}

export interface NotionFloatingToolbarProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onFormat: (format: string) => void;
  onClose: () => void;
  activeFormats: string[];
  onSetTextColor?: (color: string) => void;
  onSetFontFamily?: (fontFamily: string) => void;
}

