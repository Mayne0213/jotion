// Action interfaces for widget props injection (FSD compliance)
// Note: Using generic types to avoid importing from entities layer

// Document management actions interface
export interface DocumentManagementActions<TDocument = any> {
  fetchDocumentsInFolder: (folderId: string) => Promise<TDocument[]>;
  createDocument: (folderId?: string | null) => Promise<any>;
  deleteDocumentFromFolder: (documentId: string) => Promise<void>;
}

// Folder management actions interface
export interface FolderManagementActions<TFolder = any> {
  fetchFolder: (folderId: string) => Promise<TFolder | null>;
  createFolder: (name: string, parentId?: string | null) => Promise<any>;
  deleteFolderFromList: (folderId: string) => Promise<boolean>;
}
