import { useCallback, useState } from 'react';
import { folderApi, useFolderStore } from '@/entities/folder';
import type { FolderWithRelations, FolderInput } from '@/entities/folder';

// Folder management feature hook
export const useFolderManagementStore = () => {
  // Use the entity store as a hook to properly subscribe to state changes
  const {
    readFolders,
    setLoading,
    createFolder: createFolderInStore
  } = useFolderStore();

  const [isCreating, setIsCreating] = useState(false);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await folderApi.getFolders();
      readFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  }, [readFolders, setLoading]);

  const fetchFolder = useCallback(async (folderId: string) => {
    try {
      return await folderApi.getFolder(folderId);
    } catch (error) {
      console.error("Error fetching folder:", error);
      return null;
    }
  }, []);

  const createFolder = useCallback(async (name: string, parentId?: string | null) => {
    if (isCreating) {
      console.log("Folder creation already in progress, skipping duplicate call");
      return null;
    }

    try {
      setIsCreating(true);
      const newFolder: FolderInput = {
        name: name.trim(),
        icon: undefined,
        color: undefined,
        isArchived: false,
        parentId: parentId || undefined,
      };
      const created = await folderApi.createFolder(newFolder);
      // Refresh folders after creation
      const data = await folderApi.getFolders();
      readFolders(data);
      return created;
    } catch (error) {
      console.error("Error creating folder:", error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, readFolders]);

  const updateFolder = useCallback(async (folderId: string, name: string) => {
    try {
      await folderApi.updateFolder(folderId, { name: name.trim() });
      // Refresh folders after update
      const data = await folderApi.getFolders();
      readFolders(data);
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  }, [readFolders]);

  const deleteFolderFromList = useCallback(async (folderId: string) => {
    try {
      await folderApi.deleteFolder(folderId);
      // Refresh folders after deletion
      const data = await folderApi.getFolders();
      readFolders(data);
      return true;
    } catch (error) {
      console.error("Error deleting folder:", error);
      return false;
    }
  }, [readFolders]);

  const archiveFolder = useCallback(async (folderId: string) => {
    setLoading(true);
    try {
      await folderApi.updateFolder(folderId, { isArchived: true });
      const data = await folderApi.getFolders();
      readFolders(data);
    } finally {
      setLoading(false);
    }
  }, [readFolders, setLoading]);

  const restoreFolder = useCallback(async (folderId: string) => {
    setLoading(true);
    try {
      await folderApi.updateFolder(folderId, { isArchived: false });
      const data = await folderApi.getFolders();
      readFolders(data);
    } finally {
      setLoading(false);
    }
  }, [readFolders, setLoading]);

  const moveFolder = useCallback(async (folderId: string, parentId: string | undefined) => {
    setLoading(true);
    try {
      await folderApi.updateFolder(folderId, { parentId });
      const data = await folderApi.getFolders();
      readFolders(data);
    } finally {
      setLoading(false);
    }
  }, [readFolders, setLoading]);

  const duplicateFolder = useCallback(async (folderId: string) => {
    setLoading(true);
    try {
      const original = await folderApi.getFolder(folderId);
      const newFolder: FolderInput = {
        name: `${original.name} (Copy)`,
        icon: original.icon,
        color: original.color,
        isArchived: false,
        parentId: original.parentId,
      };
      const created = await folderApi.createFolder(newFolder);
      createFolderInStore(created as FolderWithRelations);
      return created;
    } finally {
      setLoading(false);
    }
  }, [createFolderInStore, setLoading]);

  return {
    fetchFolders,
    fetchFolder,
    createFolder,
    updateFolder,
    deleteFolderFromList,
    archiveFolder,
    restoreFolder,
    moveFolder,
    duplicateFolder,
    isCreating,
  };
};

