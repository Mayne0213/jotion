import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  image: z.string().url().optional(),
});

export type UserInput = z.infer<typeof userSchema>;

