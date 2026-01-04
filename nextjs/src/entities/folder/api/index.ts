import type { Folder, FolderWithRelations } from '../model/types';
import type { FolderInput } from '../model/validation';
import { apiGet, apiPost, apiPut, apiDelete } from '@/shared/api';

// Folder API functions
export const folderApi = {
  // Get all folders
  getFolders: async (): Promise<FolderWithRelations[]> => {
    try {
      return await apiGet<FolderWithRelations[]>('/api/folders');
    } catch (error) {
      console.error('Failed to fetch folders:', error);
      throw error;
    }
  },

  // Get a specific folder
  getFolder: async (id: string): Promise<FolderWithRelations> => {
    try {
      return await apiGet<FolderWithRelations>(`/api/folders/${id}`);
    } catch (error) {
      console.error('Failed to fetch folder:', error);
      throw error;
    }
  },

  // Create a new folder
  createFolder: async (newFolder: FolderInput): Promise<Folder> => {
    try {
      return await apiPost<Folder>('/api/folders', newFolder);
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  },

  // Update a folder
  updateFolder: async (id: string, updateData: Partial<Folder>): Promise<Folder> => {
    try {
      return await apiPut<Folder>(`/api/folders/${id}`, updateData);
    } catch (error) {
      console.error('Failed to update folder:', error);
      throw error;
    }
  },

  // Delete a folder
  deleteFolder: async (id: string): Promise<void> => {
    try {
      await apiDelete<void>(`/api/folders/${id}`);
    } catch (error) {
      console.error('Failed to delete folder:', error);
      throw error;
    }
  },
};

