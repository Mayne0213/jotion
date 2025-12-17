import { create } from 'zustand';
import { FolderWithRelations, FolderState, FolderActions } from './types';

// Folder state management store
export const useFolderStore = create<FolderState & FolderActions>((set) => ({
  folders: [],
  currentFolder: null,
  isLoading: true,

  readFolders: (folders: FolderWithRelations[]) => set({ folders }),

  setCurrentFolder: (folder: FolderWithRelations | null) => set({ currentFolder: folder }),

  createFolder: (newFolder: FolderWithRelations) => set((state) => ({
    folders: [newFolder, ...state.folders]
  })),

  updateFolder: (updatedFolder: FolderWithRelations) => set((state) => ({
    folders: state.folders.map(folder =>
      folder.id === updatedFolder.id ? updatedFolder : folder
    ),
    currentFolder: state.currentFolder?.id === updatedFolder.id 
      ? updatedFolder 
      : state.currentFolder
  })),

  deleteFolder: (folderId: string) => set((state) => ({
    folders: state.folders.filter(folder => folder.id !== folderId),
    currentFolder: state.currentFolder?.id === folderId 
      ? null 
      : state.currentFolder
  })),

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

