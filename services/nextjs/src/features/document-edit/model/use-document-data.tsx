import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { documentApi } from "@/entities/document/api";
import type { DocumentWithRelations, DocumentListItem } from "@/entities/document/model";

interface UseDocumentDataProps {
  documentId: string;
}

/**
 * 문서 데이터 조회 및 기본 상태 관리
 */
export const useDocumentData = ({ documentId }: UseDocumentDataProps) => {
  const router = useRouter();
  const [document, setDocument] = useState<DocumentWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [availableDocuments, setAvailableDocuments] = useState<DocumentListItem[]>([]);

  // Fetch document
  const fetchDocument = useCallback(async () => {
    try {
      const data = await documentApi.getDocument(documentId);
      setDocument(data);
      setTitle(data.title);
      setContent(data.content || {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Start writing...',
              },
            ],
          },
        ],
      });
    } catch (error: any) {
      console.error("Error fetching document:", error);
      if (error.message?.includes('404')) {
        router.push("/documents");
      }
    } finally {
      setIsLoading(false);
    }
  }, [documentId, router]);

  // Fetch available documents for linking
  const fetchAvailableDocuments = useCallback(async () => {
    try {
      const documents = await documentApi.getDocuments();
      const filteredDocs = documents
        .filter((doc: DocumentWithRelations) => doc.id !== documentId)
        .map((doc: DocumentWithRelations) => ({ 
          id: doc.id, 
          title: doc.title,
          updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : new Date(doc.updatedAt).toISOString()
        }));
      setAvailableDocuments(filteredDocs);
    } catch (error) {
      console.error("Error fetching available documents:", error);
    }
  }, [documentId]);

  // Refresh document data
  const refreshDocument = useCallback(() => {
    setIsLoading(true);
    fetchDocument();
  }, [fetchDocument]);

  // Update local document state
  const updateDocument = useCallback((updatedDoc: DocumentWithRelations) => {
    setDocument(updatedDoc);
  }, []);

  useEffect(() => {
    if (documentId) {
      fetchDocument();
      fetchAvailableDocuments();
    }
  }, [documentId, fetchDocument, fetchAvailableDocuments]);

  return {
    document,
    isLoading,
    title,
    setTitle,
    content,
    setContent,
    availableDocuments,
    refreshDocument,
    updateDocument,
  };
};

