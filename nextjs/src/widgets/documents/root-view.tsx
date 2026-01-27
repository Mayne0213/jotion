"use client";

import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/entities/document";
import { useFolderStore } from "@/entities/folder";
import type { DocumentWithRelations } from "@/entities/document";
import type { FolderWithRelations } from "@/entities/folder";
import { Folder } from "./folder";
import { Document } from "./document";
import { EmptyState } from "./empty-state";

interface RootViewProps {
  onCreateFolder: () => void;
  onNavigateToFolder: (folderId: string) => void;
  onFolderDeleted?: () => void;
  variant?: "desktop" | "mobile";
  /** Create document action (injected from page layer) */
  createDocument: (folderId?: string | null) => Promise<any>;
  /** Delete document action (injected from page layer) */
  deleteDocumentFromFolder: (documentId: string) => Promise<void>;
  /** Delete folder action (injected from page layer) */
  deleteFolderFromList: (folderId: string) => Promise<boolean>;
  /** Whether document creation is in progress */
  isCreating?: boolean;
  /** Confirm dialog function for delete confirmation */
  onConfirmDelete?: (message: string) => Promise<boolean>;
}

export const RootView = ({
  onCreateFolder,
  onNavigateToFolder,
  onFolderDeleted,
  variant = "desktop",
  createDocument,
  deleteDocumentFromFolder,
  deleteFolderFromList,
  isCreating = false,
  onConfirmDelete,
}: RootViewProps) => {
  const router = useRouter();
  const documentStore = useDocumentStore();
  const folderStore = useFolderStore();

  const documents = documentStore.documents;
  const folders = folderStore.folders;
  const isLoadingDocs = documentStore.isLoading;
  const isLoadingFolders = folderStore.isLoading;

  const rootFolders = folders.filter(f => !f.parentId);
  const rootDocuments = documents.filter(doc => !doc.folderId && doc.type !== 'CODE_FILE');

  const handleDeleteDocument = async (documentId: string) => {
    await deleteDocumentFromFolder(documentId);
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    const confirmed = onConfirmDelete
      ? await onConfirmDelete(`정말로 "${folderName}" 폴더를 삭제하시겠습니까?`)
      : window.confirm(`정말로 "${folderName}" 폴더를 삭제하시겠습니까?`);

    if (confirmed) {
      const success = await deleteFolderFromList(folderId);
      if (success && onFolderDeleted) {
        onFolderDeleted();
      }
    }
  };

  // Show empty state only if loading is complete and no folders/documents exist
  const isLoading = isLoadingDocs || isLoadingFolders;
  if (!isLoading && rootFolders.length === 0 && rootDocuments.length === 0) {
    return (
      <EmptyState
        variant="workspace"
        isCreating={isCreating}
        onCreateFolder={onCreateFolder}
        onCreateDocument={() => createDocument(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Root folders section */}
      {rootFolders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Folders
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {rootFolders.length} folders
            </span>
          </div>

          {/* Root folders grid */}
          <div className={`grid ${variant === "mobile" ? "grid-cols-1" : "grid-cols-7"} gap-4`}>
            {rootFolders.map((folder) => (
              <Folder
                key={folder.id}
                id={folder.id}
                name={folder.name}
                icon={folder.icon}
                documentsCount={folder._count?.documents || 0}
                subfoldersCount={folder._count?.children || 0}
                onClick={() => onNavigateToFolder(folder.id)}
                onDelete={handleDeleteFolder}
                variant={variant}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent documents not in folders */}
      {rootDocuments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent pages
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {rootDocuments.length} pages
            </span>
          </div>

          {/* Documents grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {rootDocuments.map((document) => (
              <Document
                key={document.id}
                id={document.id}
                title={document.title}
                icon={document.icon}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
