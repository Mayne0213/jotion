"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/src/app/providers/auth-provider";
import { useDocumentManagementStore } from "@/features/document-management/model/store";
import { useFolderManagementStore } from "@/features/folder-management/model/store";
import { useDocumentStore } from "@/entities/document/model/store";
import { useFolderStore } from "@/entities/folder/model/store";
import { Spinner } from "@/shared/ui/spinner";
import { Header, CreateInput, FolderView, RootView } from "@/widgets/documents";
import { Button } from "@/shared/ui/button";
import { Plus, Folder } from "lucide-react";
import { DocumentsPageSkeleton } from "@/shared/ui/skeleton";
import { useConfirm } from "@/shared/hooks";

const DocumentsPage = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams?.get('folder');

  // Use management stores for operations
  const documentManagement = useDocumentManagementStore();
  const folderManagement = useFolderManagementStore();

  // Use entity stores for state
  const documentStore = useDocumentStore();
  const folderStore = useFolderStore();

  const documents = documentStore.documents;
  const folders = folderStore.folders;
  const isLoading = documentStore.isLoading || folderStore.isLoading;

  // Destructure specific functions
  const { fetchDocuments, createDocument, fetchDocumentsInFolder, deleteDocumentFromFolder } = documentManagement;
  const { fetchFolders, createFolder, fetchFolder, deleteFolderFromList } = folderManagement;

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Use confirm dialog hook
  const { confirm, ConfirmationDialog } = useConfirm();

  // Confirmation handler for widgets
  const handleConfirmDelete = useCallback(async (message: string) => {
    return await confirm({
      title: "삭제 확인",
      description: message,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "destructive",
    });
  }, [confirm]);

  // Document management actions for widgets
  const documentActions = {
    fetchDocumentsInFolder,
    createDocument,
    deleteDocumentFromFolder,
  };

  // Folder management actions for widgets
  const folderActions = {
    fetchFolder,
    createFolder,
    deleteFolderFromList,
  };

  // Fetch initial data
  useEffect(() => {
    fetchDocuments();
    fetchFolders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = await createFolder(newFolderName, currentFolderId);
    if (newFolder) {
          setNewFolderName('');
          setIsCreatingFolder(false);
          // Refresh data to show the new folder
          fetchFolders();
          if (currentFolderId) {
            setRefreshKey(prev => prev + 1);
          }
    }
  };

  const handleCreateDocumentFromHeader = async () => {
    await createDocument(currentFolderId);
    if (currentFolderId) {
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleNavigateToFolder = (folderId: string) => {
    window.history.pushState({}, '', `/documents?folder=${folderId}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleFolderDeleted = () => {
    // Refresh folders list
    fetchFolders();
    fetchDocuments();
    // Force refresh if we're in a folder view
    if (currentFolderId) {
      setRefreshKey(prev => prev + 1);
    }
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-[#1F1F1F]">
        <Header
          userName={user?.name}
          documentsCount={documents.length}
          foldersCount={folders.length}
          isCreating={false}
          onCreateFolder={() => setIsCreatingFolder(true)}
          onCreateDocument={handleCreateDocumentFromHeader}
        />
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#1F1F1F] p-6">
          <DocumentsPageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1F1F1F]">
      {/* Header */}
      <Header
        userName={user?.name}
        documentsCount={documents.length}
        foldersCount={folders.length}
        isCreating={documentManagement.isCreating}
        onCreateFolder={() => setIsCreatingFolder(true)}
        onCreateDocument={handleCreateDocumentFromHeader}
      />

      {/* Create folder input - shown when creating from header */}
      {isCreatingFolder && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-secondary">
          <CreateInput
                value={newFolderName}
            onChange={setNewFolderName}
            onSubmit={handleCreateFolder}
            onCancel={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                }}
              />
        </div>
      )}

      {/* Main content - Desktop layout */}
      <div className="hidden lg:block flex-1 overflow-hidden bg-gray-50 dark:bg-[#1F1F1F]">
        <div className="flex h-full">
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {currentFolderId ? (
                <FolderView
                  key={`desktop-${currentFolderId}-${refreshKey}`}
                  folderId={currentFolderId}
                  onBack={handleGoBack}
                  onFolderDeleted={handleFolderDeleted}
                  variant="desktop"
                  documentActions={documentActions}
                  folderActions={folderActions}
                  onConfirmDelete={handleConfirmDelete}
                />
              ) : (
                <RootView
                  onCreateFolder={() => setIsCreatingFolder(true)}
                  onNavigateToFolder={handleNavigateToFolder}
                  onFolderDeleted={handleFolderDeleted}
                  variant="desktop"
                  createDocument={createDocument}
                  deleteDocumentFromFolder={deleteDocumentFromFolder}
                  deleteFolderFromList={deleteFolderFromList}
                  isCreating={documentManagement.isCreating}
                  onConfirmDelete={handleConfirmDelete}
                />
              )}
            </div>
            </div>
          </div>
        </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 overflow-auto">
          <div className="px-6 py-8 bg-gray-50 dark:bg-[#1F1F1F]">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Create folder input */}
                {isCreatingFolder && (
              <CreateInput
                        value={newFolderName}
                onChange={setNewFolderName}
                onSubmit={handleCreateFolder}
                onCancel={() => {
                            setIsCreatingFolder(false);
                            setNewFolderName('');
                }}
              />
            )}

            {/* Content */}
            {currentFolderId ? (
              <FolderView
                key={`mobile-${currentFolderId}-${refreshKey}`}
                folderId={currentFolderId}
                onBack={handleGoBack}
                onFolderDeleted={handleFolderDeleted}
                variant="mobile"
                documentActions={documentActions}
                folderActions={folderActions}
                onConfirmDelete={handleConfirmDelete}
              />
            ) : (
              <RootView
                onCreateFolder={() => setIsCreatingFolder(true)}
                onNavigateToFolder={handleNavigateToFolder}
                onFolderDeleted={handleFolderDeleted}
                variant="mobile"
                createDocument={createDocument}
                deleteDocumentFromFolder={deleteDocumentFromFolder}
                deleteFolderFromList={deleteFolderFromList}
                isCreating={documentManagement.isCreating}
                onConfirmDelete={handleConfirmDelete}
              />
            )}
          </div>
        </div>
      </div>
      <ConfirmationDialog />
    </div>
  );
};

export default DocumentsPage;
