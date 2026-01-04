"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, Folder as FolderIcon, Plus } from "lucide-react";
import { FolderWithRelations } from "@/shared/types/folder";
import { DocumentWithRelations } from "@/shared/types/document";
import { useDocumentManagementStore } from "@/features/document-management/model/store";
import { useFolderManagementStore } from "@/features/folder-management/model/store";
import { Folder } from "./folder";
import { Document } from "./document";
import { CreateInput } from "./create-input";
import { EmptyState } from "./empty-state";
import { FolderViewSkeleton } from "@/shared/ui/skeleton";

interface FolderViewProps {
  folderId: string;
  onBack: () => void;
  onFolderDeleted?: () => void;
  variant?: "desktop" | "mobile";
}

export const FolderView = ({
  folderId,
  onBack,
  onFolderDeleted,
  variant = "desktop",
}: FolderViewProps) => {
  const router = useRouter();
  const documentManagement = useDocumentManagementStore();
  const folderManagement = useFolderManagementStore();
  
  const { fetchDocumentsInFolder, createDocument, deleteDocumentFromFolder } = documentManagement;
  const { fetchFolder, createFolder, deleteFolderFromList } = folderManagement;
  
  const [folder, setFolder] = useState<FolderWithRelations | null>(null);
  const [documents, setDocuments] = useState<DocumentWithRelations[]>([]);
  const [subfolders, setSubfolders] = useState<FolderWithRelations[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creatingSubFolder, setCreatingSubFolder] = useState(false);
  const [newSubFolderName, setNewSubFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const gridCols = variant === "mobile" ? "grid-cols-5" : "grid-cols-7";

  // Load folder data
  useEffect(() => {
    const loadFolderData = async () => {
      setIsLoading(true);
      
      // Fetch folder details
      const folderData = await fetchFolder(folderId);
      if (folderData) {
        setFolder(folderData);
        
        // Process children to include _count information
        if (folderData.children) {
          const childrenWithCount = await Promise.all(
            folderData.children.map(async (child: any) => {
              try {
                const childData = await fetchFolder(child.id);
                return childData || child;
              } catch (error) {
                console.error(`Error fetching child folder ${child.id}:`, error);
                return child;
              }
            })
          );
          setSubfolders(childrenWithCount);
        }
      }

      // Fetch documents
      const docs = await fetchDocumentsInFolder(folderId);
      setDocuments(docs);
      
      setIsLoading(false);
    };

    loadFolderData();
  }, [folderId, fetchFolder, fetchDocumentsInFolder]);

  const handleCreateDocument = async () => {
    setIsCreating(true);
    await createDocument(folderId);
    setIsCreating(false);
  };

  const handleCreateSubfolder = async () => {
    if (!newSubFolderName.trim()) return;
    
    const newFolder = await createFolder(newSubFolderName, folderId);
    if (newFolder) {
      setNewSubFolderName('');
      setCreatingSubFolder(false);
      // Refresh folder data
      const folderData = await fetchFolder(folderId);
      if (folderData) {
        setFolder(folderData);
        setSubfolders(folderData.children || []);
      }
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    await deleteDocumentFromFolder(documentId);
    // Refresh documents
    const docs = await fetchDocumentsInFolder(folderId);
    setDocuments(docs);
  };

  const handleDeleteFolder = async (deleteFolderId: string, folderName: string) => {
    if (window.confirm(`정말로 "${folderName}" 폴더를 삭제하시겠습니까?`)) {
      const success = await deleteFolderFromList(deleteFolderId);
      if (success) {
        // Refresh subfolders
        const folderData = await fetchFolder(folderId);
        if (folderData) {
          setSubfolders(folderData.children || []);
        }
        if (onFolderDeleted) {
          onFolderDeleted();
        }
      }
    }
  };

  if (isLoading) {
    return <FolderViewSkeleton />;
  }

  if (!folder) {
    return <div className="p-6">Folder not found</div>;
  }

  return (
    <>
      {/* Folder header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <FolderIcon className="h-5 w-5 text-black dark:text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {folder.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {documents.length} pages • {subfolders.length} subfolders
          </p>
        </div>
      </div>

      {/* Create subfolder input */}
      {creatingSubFolder && (
        <div className="mb-6">
          <CreateInput
            value={newSubFolderName}
            onChange={setNewSubFolderName}
            onSubmit={handleCreateSubfolder}
            onCancel={() => {
              setCreatingSubFolder(false);
              setNewSubFolderName('');
            }}
            placeholder="Enter subfolder name..."
          />
        </div>
      )}

      {/* Subfolders */}
      {subfolders.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Subfolders
          </h3>
          <div className={`grid ${gridCols} gap-4`}>
            {subfolders.map((subfolder) => (
              <Folder
                key={subfolder.id}
                id={subfolder.id}
                name={subfolder.name}
                icon={subfolder.icon}
                onClick={() => router.push(`/documents?folder=${subfolder.id}`)}
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Documents in folder */}
      {documents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Pages
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {documents.map((document) => (
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

      {/* Empty state - show only when both documents and subfolders are empty */}
      {documents.length === 0 && subfolders.length === 0 && (
        <EmptyState
          variant="folder"
          isCreating={isCreating}
          onCreateFolder={() => setCreatingSubFolder(true)}
          onCreateDocument={handleCreateDocument}
        />
      )}
    </>
  );
};
