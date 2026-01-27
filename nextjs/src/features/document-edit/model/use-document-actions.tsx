import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { documentApi } from "@/entities/document";

interface UseDocumentActionsProps {
  documentId: string;
  onPublishChange?: (isPublished: boolean) => void;
  /** Optional custom confirm function (for using ConfirmDialog instead of window.confirm) */
  onConfirmDelete?: () => Promise<boolean>;
}

/**
 * 문서 액션 (공유, 삭제 등)
 */
export const useDocumentActions = ({
  documentId,
  onPublishChange,
  onConfirmDelete,
}: UseDocumentActionsProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete document
  const deleteDocument = useCallback(async () => {
    const confirmed = onConfirmDelete
      ? await onConfirmDelete()
      : confirm("Are you sure you want to delete this document?");

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await documentApi.deleteDocument(documentId);
      router.push("/documents");
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [documentId, router, onConfirmDelete]);

  // Share document
  const shareDocument = useCallback(async () => {
    try {
      await documentApi.updateDocument(documentId, {
        isPublished: true,
      });

      const shareUrl = `${window.location.origin}/share/${documentId}`;
      
      alert('문서가 공개되었습니다!\n\n공유 링크:\n' + shareUrl);
      
      onPublishChange?.(true);
    } catch (error) {
      console.error('Error sharing document:', error);
      alert('문서 공유에 실패했습니다');
    }
  }, [documentId, onPublishChange]);

  // Unshare document
  const unshareDocument = useCallback(async () => {
    try {
      await documentApi.updateDocument(documentId, {
        isPublished: false,
      });

      alert('Document is no longer shared!');
      onPublishChange?.(false);
    } catch (error) {
      console.error('Error unsharing document:', error);
      alert('Failed to unshare document');
    }
  }, [documentId, onPublishChange]);

  return {
    deleteDocument,
    shareDocument,
    unshareDocument,
    isDeleting,
  };
};

