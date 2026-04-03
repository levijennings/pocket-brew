/**
 * Tests for Zod validation schemas
 */

import {
  tastingNoteSchema,
  collectionSchema,
  collectionUpdateSchema,
  profileUpdateSchema,
  beerSearchSchema,
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
} from '../../lib/validations'

describe('Validation Schemas', () => {
  describe('tastingNoteSchema', () => {
    it('should validate a valid tasting note', () => {
      const validData = {
        beer_id: '123e4567-e89b-12d3-a456-426614174000',
        rating: 4,
        aroma: 8,
        appearance: 9,
        taste: 8,
        mouthfeel: 7,
        overall_impression: 'Great beer!',
        flavor_notes: ['hoppy', 'citrus'],
        serving_type: 'draft',
        location: 'Local Brewery',
        photo_url: 'https://example.com/photo.jpg',
      }

      const result = tastingNoteSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid rating', () => {
      const invalidData = {
        beer_id: '123e4567-e89b-12d3-a456-426614174000',
        rating: 6, // Invalid: max is 5
        aroma: 8,
        appearance: 9,
        taste: 8,
        mouthfeel: 7,
        overall_impression: 'Great beer!',
        flavor_notes: [],
        serving_type: 'draft',
      }

      const result = tastingNoteSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid aroma score', () => {
      const invalidData = {
        beer_id: '123e4567-e89b-12d3-a456-426614174000',
        rating: 4,
        aroma: 11, // Invalid: max is 10
        appearance: 9,
        taste: 8,
        mouthfeel: 7,
        overall_impression: 'Great beer!',
        flavor_notes: [],
        serving_type: 'draft',
      }

      const result = tastingNoteSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject too many flavor notes', () => {
      const invalidData = {
        beer_id: '123e4567-e89b-12d3-a456-426614174000',
        rating: 4,
        aroma: 8,
        appearance: 9,
        taste: 8,
        mouthfeel: 7,
        overall_impression: 'Great beer!',
        flavor_notes: Array(11).fill('note'), // Invalid: max is 10
        serving_type: 'draft',
      }

      const result = tastingNoteSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid serving type', () => {
      const invalidData = {
        beer_id: '123e4567-e89b-12d3-a456-426614174000',
        rating: 4,
        aroma: 8,
        appearance: 9,
        taste: 8,
        mouthfeel: 7,
        overall_impression: 'Great beer!',
        flavor_notes: [],
        serving_type: 'keg', // Invalid
      }

      const result = tastingNoteSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('collectionSchema', () => {
    it('should validate a valid collection', () => {
      const validData = {
        name: 'My Favorite IPAs',
        description: 'Collection of my favorite IPAs',
        is_public: true,
      }

      const result = collectionSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        description: 'Collection of my favorite IPAs',
        is_public: true,
      }

      const result = collectionSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject name exceeding 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        description: 'Collection of my favorite IPAs',
        is_public: true,
      }

      const result = collectionSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('collectionUpdateSchema', () => {
    it('should allow partial updates', () => {
      const validData = {
        name: 'Updated Name',
      }

      const result = collectionUpdateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should allow empty object', () => {
      const validData = {}

      const result = collectionUpdateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('profileUpdateSchema', () => {
    it('should validate a valid profile update', () => {
      const validData = {
        display_name: 'John Doe',
        bio: 'Beer enthusiast',
        avatar_url: 'https://example.com/avatar.jpg',
        favorite_styles: ['IPA', 'Stout'],
      }

      const result = profileUpdateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid avatar URL', () => {
      const invalidData = {
        display_name: 'John Doe',
        avatar_url: 'not-a-url',
      }

      const result = profileUpdateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject too many favorite styles', () => {
      const invalidData = {
        display_name: 'John Doe',
        favorite_styles: Array(11).fill('style'),
      }

      const result = profileUpdateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('beerSearchSchema', () => {
    it('should validate a valid search query', () => {
      const validData = {
        query: 'IPA',
        sort: 'rating',
        limit: 50,
        offset: 0,
      }

      const result = beerSearchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should use default values', () => {
      const validData = {}

      const result = beerSearchSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sort).toBe('popularity')
        expect(result.data.limit).toBe(50)
        expect(result.data.offset).toBe(0)
      }
    })

    it('should reject invalid sort option', () => {
      const invalidData = {
        sort: 'invalid',
      }

      const result = beerSearchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject query exceeding 100 characters', () => {
      const invalidData = {
        query: 'a'.repeat(101),
      }

      const result = beerSearchSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('signUpSchema', () => {
    it('should validate a valid sign up request', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        display_name: 'John Doe',
      }

      const result = signUpSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'SecurePassword123!',
        display_name: 'John Doe',
      }

      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        display_name: 'John Doe',
      }

      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty display name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        display_name: '',
      }

      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('signInSchema', () => {
    it('should validate a valid sign in request', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      }

      const result = signInSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'SecurePassword123!',
      }

      const result = signInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }

      const result = signInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('resetPasswordSchema', () => {
    it('should validate a valid reset password request', () => {
      const validData = {
        email: 'test@example.com',
      }

      const result = resetPasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
      }

      const result = resetPasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
