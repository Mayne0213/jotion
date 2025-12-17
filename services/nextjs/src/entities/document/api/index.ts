import type { Document, DocumentWithRelations } from '../model/types';
import type { DocumentInput } from '../model/validation';
import { apiGet, apiPost, apiPut, apiDelete } from '@/shared/api';

// Document API functions
export const documentApi = {
  // Get all documents
  getDocuments: async (): Promise<DocumentWithRelations[]> => {
    try {
      return await apiGet<DocumentWithRelations[]>('/api/documents');
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw error;
    }
  },

  // Get a specific document
  getDocument: async (id: string): Promise<DocumentWithRelations> => {
    try {
      return await apiGet<DocumentWithRelations>(`/api/documents/${id}`);
    } catch (error) {
      console.error('Failed to fetch document:', error);
      throw error;
    }
  },

  // Create a new document
  createDocument: async (newDocument: DocumentInput): Promise<Document> => {
    try {
      return await apiPost<Document>('/api/documents', newDocument);
    } catch (error) {
      console.error('Failed to create document:', error);
      throw error;
    }
  },

  // Update a document
  updateDocument: async (id: string, updateData: Partial<Document>): Promise<Document> => {
    try {
      return await apiPut<Document>(`/api/documents/${id}`, updateData);
    } catch (error) {
      console.error('Failed to update document:', error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (id: string): Promise<void> => {
    try {
      await apiDelete<void>(`/api/documents/${id}`);
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  },

  // Get public document
  getPublicDocument: async (id: string): Promise<DocumentWithRelations> => {
    try {
      return await apiGet<DocumentWithRelations>(`/api/documents/${id}/public`);
    } catch (error) {
      console.error('Failed to fetch public document:', error);
      throw error;
    }
  },
};

