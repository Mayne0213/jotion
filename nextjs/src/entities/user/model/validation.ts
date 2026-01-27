import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().optional(),
  image: z.string().url().optional(),
});

export type UserInput = z.infer<typeof userSchema>;

