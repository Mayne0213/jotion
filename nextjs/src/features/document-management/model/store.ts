import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { documentApi } from '@/entities/document/api';
import { useDocumentStore } from '@/entities/document/model/store';
import type { DocumentWithRelations, DocumentInput } from '@/entities/document/model';

// Document management feature store
export const useDocumentManagementStore = () => {
  const entityStore = useDocumentStore.getState();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const fetchDocuments = useCallback(async () => {
    entityStore.setLoading(true);
    try {
      const data = await documentApi.getDocuments();
      entityStore.readDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const fetchDocumentsInFolder = useCallback(async (folderId: string) => {
    try {
      const data = await documentApi.getDocuments();
      // Filter by folder and code files
      return data.filter((doc: any) => 
        doc.folderId === folderId && doc.type !== 'CODE_FILE'
      );
    } catch (error) {
      console.error("Error fetching documents in folder:", error);
      return [];
    }
  }, []);

  const createDocument = useCallback(async (folderId?: string | null) => {
    if (isCreating) {
      console.log("Document creation already in progress");
      return;
    }
    
    try {
      setIsCreating(true);
      const newDocument: DocumentInput = {
        title: "Untitled",
        type: 'PAGE',
        isPublished: false,
        isArchived: false,
        folderId: folderId || undefined,
      };
      const created = await documentApi.createDocument(newDocument);
      await fetchDocuments();
      router.push(`/documents/${created.id}`);
      return created;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [router, fetchDocuments, isCreating]);

  const deleteDocumentFromFolder = useCallback(async (documentId: string) => {
    try {
      await documentApi.deleteDocument(documentId);
      await fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }, [fetchDocuments]);

  const updateDocumentInStore = useCallback((documentId: string, updates: Partial<DocumentWithRelations>) => {
    entityStore.updateDocument({
      ...entityStore.documents.find(d => d.id === documentId)!,
      ...updates
    } as DocumentWithRelations);
  }, [entityStore]);

  const searchDocuments = useCallback(async (query: string) => {
    entityStore.setLoading(true);
    try {
      const documents = await documentApi.getDocuments();
      // Filter documents by query
      const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase())
      );
      entityStore.readDocuments(filtered);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const archiveDocument = useCallback(async (documentId: string) => {
    entityStore.setLoading(true);
    try {
      await documentApi.updateDocument(documentId, { isArchived: true });
      const documents = await documentApi.getDocuments();
      entityStore.readDocuments(documents);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const restoreDocument = useCallback(async (documentId: string) => {
    entityStore.setLoading(true);
    try {
      await documentApi.updateDocument(documentId, { isArchived: false });
      const documents = await documentApi.getDocuments();
      entityStore.readDocuments(documents);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const duplicateDocument = useCallback(async (documentId: string) => {
    entityStore.setLoading(true);
    try {
      const original = await documentApi.getDocument(documentId);
      const newDocument: DocumentInput = {
        title: `${original.title} (Copy)`,
        content: original.content,
        icon: original.icon,
        cover: original.cover,
        type: original.type,
        isPublished: false,
        isArchived: false,
        folderId: original.folderId,
      };
      const created = await documentApi.createDocument(newDocument);
      entityStore.createDocument(created as DocumentWithRelations);
      return created;
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  return {
    fetchDocuments,
    fetchDocumentsInFolder,
    createDocument,
    deleteDocumentFromFolder,
    updateDocumentInStore,
    searchDocuments,
    archiveDocument,
    restoreDocument,
    duplicateDocument,
    isCreating,
  };
};

