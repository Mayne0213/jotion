// Document entity types
export type DocumentType = 'PAGE' | 'CODE_FILE';

export interface Document {
  id: string;
  title: string;
  content?: any; // JSON content for rich text
  icon?: string;
  cover?: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  type: DocumentType;
  filePath?: string;
  fileContent?: string;
  language?: string;
  fileSize?: number;
  parentId?: string;
  folderId?: string;
  userId: string;
}

export interface DocumentWithRelations extends Document {
  parent?: Document;
  children?: Document[];
  folder?: {
    id: string;
    name: string;
    icon?: string;
  };
  user?: any;
  _count?: {
    documents: number;
  };
}

export interface DocumentListItem {
  id: string;
  title: string;
  icon?: string;
  updatedAt: string;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
  children?: HeadingItem[];
  isExpanded?: boolean;
}

// Document state
export interface DocumentState {
  documents: DocumentWithRelations[];
  currentDocument: DocumentWithRelations | null;
  isLoading: boolean;
}

// Document actions
export interface DocumentActions {
  readDocuments: (documents: DocumentWithRelations[]) => void;
  setCurrentDocument: (document: DocumentWithRelations | null) => void;
  createDocument: (document: DocumentWithRelations) => void;
  updateDocument: (updatedDocument: DocumentWithRelations) => void;
  deleteDocument: (documentId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

