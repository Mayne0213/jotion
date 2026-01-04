import { z } from 'zod';

// Template validation schemas
export const templateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  description: z.string().optional(),
  category: z.string().default('General'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.any().optional(),
  isPublic: z.boolean().default(false),
});

export type TemplateInput = z.infer<typeof templateSchema>;

