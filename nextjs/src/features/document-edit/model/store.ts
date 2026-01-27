import { useCallback } from 'react';
import { documentApi, useDocumentStore } from '@/entities/document';
import type { DocumentWithRelations, DocumentInput } from '@/entities/document';

// API 호출과 전역 상태 관리를 통합하는 훅
export const useDocumentEditStore = () => {
  const entityStore = useDocumentStore.getState();

  const readDocuments = useCallback(async () => {
    entityStore.setLoading(true);
    try {
      entityStore.readDocuments(await documentApi.getDocuments());
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const readDocument = useCallback(async (documentId: string) => {
    entityStore.setLoading(true);
    try {
      const document = await documentApi.getDocument(documentId);
      entityStore.setCurrentDocument(document);
      return document;
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const createDocument = useCallback(async (newDocument: DocumentInput) => {
    entityStore.setLoading(true);
    try {
      const created = await documentApi.createDocument(newDocument);
      entityStore.createDocument(created as DocumentWithRelations);
      return created;
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const updateDocument = useCallback(async (documentId: string, updateData: Partial<DocumentWithRelations>) => {
    entityStore.setLoading(true);
    try {
      const updated = await documentApi.updateDocument(documentId, updateData);
      entityStore.updateDocument(updated as DocumentWithRelations);
      return updated;
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const deleteDocument = useCallback(async (documentId: string) => {
    entityStore.setLoading(true);
    try {
      await documentApi.deleteDocument(documentId);
      entityStore.deleteDocument(documentId);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  return {
    readDocuments,
    readDocument,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};

