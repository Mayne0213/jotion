import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { documentApi, useDocumentStore } from '@/entities/document';
import type { DocumentWithRelations, DocumentInput } from '@/entities/document';

// Document management feature hook
export const useDocumentManagementStore = () => {
  // Use the entity store as a hook to properly subscribe to state changes
  const {
    documents,
    readDocuments,
    setLoading,
    updateDocument,
    createDocument: createDocumentInStore
  } = useDocumentStore();

  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await documentApi.getDocuments();
      readDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, [readDocuments, setLoading]);

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
      readDocuments([...documents, created as DocumentWithRelations]);
      router.push(`/documents/${created.id}`);
      return created;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [router, documents, readDocuments, isCreating]);

  const deleteDocumentFromFolder = useCallback(async (documentId: string) => {
    try {
      await documentApi.deleteDocument(documentId);
      // Refresh documents after deletion
      const data = await documentApi.getDocuments();
      readDocuments(data);
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }, [readDocuments]);

  const updateDocumentInStore = useCallback((documentId: string, updates: Partial<DocumentWithRelations>) => {
    const existingDoc = documents.find(d => d.id === documentId);
    if (existingDoc) {
      updateDocument({
        ...existingDoc,
        ...updates
      } as DocumentWithRelations);
    }
  }, [documents, updateDocument]);

  const searchDocuments = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const allDocuments = await documentApi.getDocuments();
      // Filter documents by query
      const filtered = allDocuments.filter(doc =>
        doc.title.toLowerCase().includes(query.toLowerCase())
      );
      readDocuments(filtered);
    } finally {
      setLoading(false);
    }
  }, [readDocuments, setLoading]);

  const archiveDocument = useCallback(async (documentId: string) => {
    setLoading(true);
    try {
      await documentApi.updateDocument(documentId, { isArchived: true });
      const data = await documentApi.getDocuments();
      readDocuments(data);
    } finally {
      setLoading(false);
    }
  }, [readDocuments, setLoading]);

  const restoreDocument = useCallback(async (documentId: string) => {
    setLoading(true);
    try {
      await documentApi.updateDocument(documentId, { isArchived: false });
      const data = await documentApi.getDocuments();
      readDocuments(data);
    } finally {
      setLoading(false);
    }
  }, [readDocuments, setLoading]);

  const duplicateDocument = useCallback(async (documentId: string) => {
    setLoading(true);
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
      createDocumentInStore(created as DocumentWithRelations);
      return created;
    } finally {
      setLoading(false);
    }
  }, [createDocumentInStore, setLoading]);

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

