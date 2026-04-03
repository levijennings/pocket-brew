import { z } from 'zod'

/**
 * Tasting Note Validation Schema
 * Used for client-side validation before submitting to Supabase
 */
export const tastingNoteSchema = z.object({
  beer_id: z.string().uuid('Invalid beer ID'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  aroma: z.number().min(0).max(10, 'Aroma score must be between 0 and 10'),
  appearance: z.number().min(0).max(10, 'Appearance score must be between 0 and 10'),
  taste: z.number().min(0).max(10, 'Taste score must be between 0 and 10'),
  mouthfeel: z.number().min(0).max(10, 'Mouthfeel score must be between 0 and 10'),
  overall_impression: z.string().min(1).max(500, 'Overall impression must be between 1 and 500 characters'),
  flavor_notes: z.array(z.string()).min(0).max(10, 'Maximum 10 flavor notes'),
  serving_type: z.enum(['draft', 'bottle', 'can', 'cask']),
  location: z.string().optional(),
  photo_url: z.string().url('Invalid photo URL').optional().or(z.literal('')),
})

export type TastingNoteInput = z.infer<typeof tastingNoteSchema>

/**
 * Beer Collection Validation Schema
 */
export const collectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  is_public: z.boolean().default(false),
})

export type CollectionInput = z.infer<typeof collectionSchema>

/**
 * Collection Update Schema (all fields optional)
 */
export const collectionUpdateSchema = collectionSchema.partial()

export type CollectionUpdateInput = z.infer<typeof collectionUpdateSchema>

/**
 * Profile Update Validation Schema
 */
export const profileUpdateSchema = z.object({
  display_name: z.string().min(1).max(100, 'Display name must be 100 characters or less'),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  favorite_styles: z.array(z.string()).max(10, 'Maximum 10 favorite styles').default([]),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

/**
 * Beer Search Validation Schema
 */
export const beerSearchSchema = z.object({
  query: z.string().min(1).max(100, 'Search query must be 100 characters or less').optional(),
  style_id: z.string().uuid().optional(),
  brewery_id: z.string().uuid().optional(),
  min_rating: z.number().min(0).max(5).optional(),
  max_rating: z.number().min(0).max(5).optional(),
  sort: z.enum(['rating', 'name', 'recent', 'popularity']).default('popularity'),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})

export type BeerSearchInput = z.infer<typeof beerSearchSchema>

/**
 * Sign Up Validation Schema
 */
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  display_name: z.string().min(1).max(100, 'Display name is required'),
})

export type SignUpInput = z.infer<typeof signUpSchema>

/**
 * Sign In Validation Schema
 */
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SignInInput = z.infer<typeof signInSchema>

/**
 * Password Reset Validation Schema
 */
export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
