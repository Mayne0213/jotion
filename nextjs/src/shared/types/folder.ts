// Folder related types
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

