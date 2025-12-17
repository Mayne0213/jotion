import { useState, useCallback } from "react";
import { FolderWithRelations } from "@/entities/folder/model";

export const useFolderNavigation = () => {
  const [currentFolder, setCurrentFolder] = useState<FolderWithRelations | null>(null);
  const [folderHistory, setFolderHistory] = useState<string[]>([]);

  const navigateToFolder = useCallback((folder: FolderWithRelations | null) => {
    if (folder) {
      setFolderHistory(prev => [...prev, folder.id]);
    } else {
      setFolderHistory([]);
    }
    setCurrentFolder(folder);
  }, []);

  const goBack = useCallback(() => {
    if (currentFolder?.parentId) {
      // Will navigate to parent, component will handle fetching
      return currentFolder.parentId;
    } else {
      // Go to root
      setCurrentFolder(null);
      setFolderHistory([]);
      return null;
    }
  }, [currentFolder]);

  const goToRoot = useCallback(() => {
    setCurrentFolder(null);
    setFolderHistory([]);
  }, []);

  return {
    currentFolder,
    folderHistory,
    navigateToFolder,
    goBack,
    goToRoot,
  };
};

