import { useState, useEffect, useCallback } from "react";
import { documentApi } from "@/entities/document/api";
import type { DocumentWithRelations } from "@/entities/document/model";

interface UseDocumentSaveProps {
  documentId: string;
  title: string;
  content: any;
  onSaveSuccess?: (document: DocumentWithRelations) => void;
}

/**
 * 문서 저장 로직 (수동 저장, 자동 저장)
 */
export const useDocumentSave = ({ 
  documentId, 
  title, 
  content,
  onSaveSuccess 
}: UseDocumentSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save document
  const saveDocument = useCallback(async () => {
    try {
      setIsSaving(true);
      const updatedDocument = await documentApi.updateDocument(documentId, {
        title: title || "Untitled",
        content: content,
      });
      setLastSaved(new Date());
      onSaveSuccess?.(updatedDocument as DocumentWithRelations);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  }, [documentId, title, content, onSaveSuccess]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!title.trim() && !content) return;
    
    try {
      setIsAutoSaving(true);
      await documentApi.updateDocument(documentId, {
        title: title || "Untitled",
        content: content,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error auto-saving document:", error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [documentId, title, content]);

  // Auto-save effect
  useEffect(() => {
    if (!title.trim() && !content) return;
    
    const timeoutId = setTimeout(() => {
      autoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [title, content, autoSave]);

  return {
    saveDocument,
    isSaving,
    isAutoSaving,
    lastSaved,
  };
};

