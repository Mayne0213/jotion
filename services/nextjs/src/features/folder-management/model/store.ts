import { useCallback, useState } from 'react';
import { folderApi } from '@/entities/folder/api';
import { useFolderStore } from '@/entities/folder/model/store';
import type { FolderWithRelations, FolderInput } from '@/entities/folder/model';

// Folder management feature store
export const useFolderManagementStore = () => {
  const entityStore = useFolderStore.getState();
  const [isCreating, setIsCreating] = useState(false);

  const fetchFolders = useCallback(async () => {
    entityStore.setLoading(true);
    try {
      const data = await folderApi.getFolders();
      entityStore.readFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

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
      await fetchFolders();
      return created;
    } catch (error) {
      console.error("Error creating folder:", error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, fetchFolders]);

  const updateFolder = useCallback(async (folderId: string, name: string) => {
    try {
      await folderApi.updateFolder(folderId, { name: name.trim() });
      await fetchFolders();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  }, [fetchFolders]);

  const deleteFolderFromList = useCallback(async (folderId: string) => {
    try {
      await folderApi.deleteFolder(folderId);
      await fetchFolders();
      return true;
    } catch (error) {
      console.error("Error deleting folder:", error);
      return false;
    }
  }, [fetchFolders]);

  const archiveFolder = useCallback(async (folderId: string) => {
    entityStore.setLoading(true);
    try {
      await folderApi.updateFolder(folderId, { isArchived: true });
      const folders = await folderApi.getFolders();
      entityStore.readFolders(folders);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const restoreFolder = useCallback(async (folderId: string) => {
    entityStore.setLoading(true);
    try {
      await folderApi.updateFolder(folderId, { isArchived: false });
      const folders = await folderApi.getFolders();
      entityStore.readFolders(folders);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const moveFolder = useCallback(async (folderId: string, parentId: string | undefined) => {
    entityStore.setLoading(true);
    try {
      await folderApi.updateFolder(folderId, { parentId });
      const folders = await folderApi.getFolders();
      entityStore.readFolders(folders);
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

  const duplicateFolder = useCallback(async (folderId: string) => {
    entityStore.setLoading(true);
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
      entityStore.createFolder(created as FolderWithRelations);
      return created;
    } finally {
      entityStore.setLoading(false);
    }
  }, [entityStore]);

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

