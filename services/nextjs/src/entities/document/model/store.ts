import { create } from 'zustand';
import { DocumentWithRelations, DocumentState, DocumentActions } from './types';

// Document state management store
export const useDocumentStore = create<DocumentState & DocumentActions>((set) => ({
  documents: [],
  currentDocument: null,
  isLoading: true,

  readDocuments: (documents: DocumentWithRelations[]) => set({ documents }),

  setCurrentDocument: (document: DocumentWithRelations | null) => set({ currentDocument: document }),

  createDocument: (newDocument: DocumentWithRelations) => set((state) => ({
    documents: [newDocument, ...state.documents]
  })),

  updateDocument: (updatedDocument: DocumentWithRelations) => set((state) => ({
    documents: state.documents.map(doc =>
      doc.id === updatedDocument.id ? updatedDocument : doc
    ),
    currentDocument: state.currentDocument?.id === updatedDocument.id 
      ? updatedDocument 
      : state.currentDocument
  })),

  deleteDocument: (documentId: string) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== documentId),
    currentDocument: state.currentDocument?.id === documentId 
      ? null 
      : state.currentDocument
  })),

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

