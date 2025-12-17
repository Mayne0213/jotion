// Folder entity types
export interface Folder {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  parentId?: string;
  userId: string;
}

export interface FolderWithRelations extends Folder {
  documents: Array<{
    id: string;
    title: string;
    icon?: string;
    updatedAt: string;
  }>;
  children: FolderWithRelations[];
  _count: {
    documents: number;
    children: number;
  };
}

// Folder state
export interface FolderState {
  folders: FolderWithRelations[];
  currentFolder: FolderWithRelations | null;
  isLoading: boolean;
}

// Folder actions
export interface FolderActions {
  readFolders: (folders: FolderWithRelations[]) => void;
  setCurrentFolder: (folder: FolderWithRelations | null) => void;
  createFolder: (folder: FolderWithRelations) => void;
  updateFolder: (updatedFolder: FolderWithRelations) => void;
  deleteFolder: (folderId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

