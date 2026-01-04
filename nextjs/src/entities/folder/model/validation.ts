import { z } from 'zod';

// Folder validation schemas
export const folderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  icon: z.string().optional(),
  color: z.string().optional(),
  isArchived: z.boolean().default(false),
  parentId: z.string().optional(),
});

export type FolderInput = z.infer<typeof folderSchema>;

