import z from 'zod';
import { NotificationCategories } from '../../types';

export const createSubscriptionInputSchema = z.object({
  category: z.nativeEnum(NotificationCategories),
  is_active: z.boolean().optional(),
  chain_id: z.string().optional(),
  thread_id: z.number().optional(),
  comment_id: z.number().optional(),
  snapshot_id: z.string().optional(),
});

export const createSubscriptionOutputSchema = z.object({});
