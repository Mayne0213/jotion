import { z } from 'zod';

// Document validation schemas
export const documentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.any().optional(),
  icon: z.string().optional(),
  cover: z.string().optional(),
  isPublished: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  type: z.enum(['PAGE', 'CODE_FILE']).default('PAGE'),
  filePath: z.string().optional(),
  fileContent: z.string().optional(),
  language: z.string().optional(),
  fileSize: z.number().optional(),
  parentId: z.string().optional(),
  folderId: z.string().optional(),
});

export type DocumentInput = z.infer<typeof documentSchema>;

