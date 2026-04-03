/**
 * Tests for API layer functions
 */

import {
  getBeers,
  searchBeers,
  createTastingNote,
  getUserStats,
  createCollection,
  addBeerToCollection,
  getUserTastingNotes,
  getUserCollections,
  getUserWishlist,
} from '../../lib/api'
import { supabase } from '../../lib/supabase'
import type { Beer } from '../../types/index'
import {
  createMockBeer,
  createMockTastingNote,
  createMockCollection,
  createMockSession,
} from '../../test/helpers'

jest.mock('../../lib/supabase')

// Helper to create a complete mock query builder
function createMockQueryBuilder() {
  const mockQuery: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    then: jest.fn(),
  }
  return mockQuery
}

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set up the default mock for supabase.from()
    ;(supabase.from as jest.Mock).mockImplementation(() => createMockQueryBuilder())
  })

  describe('getBeers', () => {
    it('should fetch beers with default sorting', async () => {
      const mockBeers = [createMockBeer(), createMockBeer()]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockBeers, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const result = await getBeers()

      expect(result).toEqual(mockBeers)
      expect(supabase.from).toHaveBeenCalledWith('beers')
    })

    it('should apply rating sort when specified', async () => {
      const mockBeers = [createMockBeer({ avg_rating: 5 })]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockBeers, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      await getBeers({ sortBy: 'rating' })

      expect(mockQuery.order).toHaveBeenCalledWith('avg_rating', {
        ascending: false,
      })
    })

    it('should apply limit and offset', async () => {
      const mockBeers = [createMockBeer()]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockBeers, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      await getBeers({ limit: 10, offset: 20 })

      expect(mockQuery.limit).toHaveBeenCalledWith(10)
      expect(mockQuery.range).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({
          data: null,
          error: { message: 'Database error' },
        })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      await expect(getBeers()).rejects.toThrow('Failed to fetch beers')
    })
  })

  describe('searchBeers', () => {
    it('should search beers by query', async () => {
      const mockBeers = [createMockBeer({ name: 'IPA Supreme' })]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockBeers, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const result = await searchBeers('IPA')

      expect(result).toEqual(mockBeers)
      expect(mockQuery.or).toHaveBeenCalled()
    })

    it('should handle empty query', async () => {
      const mockBeers: Beer[] = []
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockBeers, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const result = await searchBeers('')

      expect(result).toEqual([])
    })

    it('should apply style filter', async () => {
      const mockBeers = [createMockBeer({ style: 'IPA' })]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockBeers, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const styleId = 'test-style-id'
      await searchBeers('beer', { style_id: styleId, sort: 'popularity', limit: 50, offset: 0 })

      expect(mockQuery.eq).toHaveBeenCalledWith('style', styleId)
    })

    it('should apply rating filters', async () => {
      const mockBeers = [createMockBeer({ avg_rating: 4.5 })]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockBeers, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      await searchBeers('beer', { min_rating: 4, max_rating: 5, sort: 'popularity', limit: 50, offset: 0 })

      expect(mockQuery.gte).toHaveBeenCalledWith('avg_rating', 4)
      expect(mockQuery.lte).toHaveBeenCalledWith('avg_rating', 5)
    })
  })

  describe('createTastingNote', () => {
    it('should create a tasting note for authenticated user', async () => {
      const mockSession = createMockSession()
      const mockTastingNote = createMockTastingNote()

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
      })

      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockTastingNote, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const result = await createTastingNote({
        beer_id: 'test-beer-id',
        rating: 4,
        aroma: 8,
        appearance: 9,
        taste: 8,
        mouthfeel: 7,
        overall_impression: 'Great beer!',
        flavor_notes: ['hoppy', 'citrus'],
        serving_type: 'draft',
      })

      expect(result).toEqual(mockTastingNote)
      expect(mockQuery.insert).toHaveBeenCalled()
    })

    it('should throw error if user not authenticated', async () => {
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      await expect(
        createTastingNote({
          beer_id: 'test-beer-id',
          rating: 4,
          aroma: 8,
          appearance: 9,
          taste: 8,
          mouthfeel: 7,
          overall_impression: 'Great beer!',
          flavor_notes: [],
          serving_type: 'draft',
        })
      ).rejects.toThrow('User not authenticated')
    })

    it('should handle database errors', async () => {
      const mockSession = createMockSession()

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
      })

      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({
          data: null,
          error: { message: 'Insert failed' },
        })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      await expect(
        createTastingNote({
          beer_id: 'test-beer-id',
          rating: 4,
          aroma: 8,
          appearance: 9,
          taste: 8,
          mouthfeel: 7,
          overall_impression: 'Great beer!',
          flavor_notes: [],
          serving_type: 'draft',
        })
      ).rejects.toThrow('Failed to create tasting note')
    })
  })

  describe('getUserStats', () => {
    it('should calculate user statistics correctly', async () => {
      const mockTastingNotes = [
        createMockTastingNote({ rating: 4 }),
        createMockTastingNote({ rating: 5 }),
        createMockTastingNote({ rating: 3 }),
      ]
      const mockCollections = [
        createMockCollection(),
        createMockCollection(),
      ]
      const mockWishlist: Beer[] = [createMockBeer()]

      ;(supabase.from as jest.Mock).mockImplementation((table: string) => {
        const mockQuery = createMockQueryBuilder()
        mockQuery.then.mockImplementation(async (onFulfilled: any) => {
          let data: any = null
          if (table === 'tasting_notes') {
            data = mockTastingNotes
          } else if (table === 'collections') {
            data = mockCollections
          } else if (table === 'wishlist') {
            data = [{ beer_id: mockWishlist[0].id }]
          } else if (table === 'beers') {
            data = mockWishlist
          }
          return onFulfilled({ data, error: null })
        })
        return mockQuery
      })

      const result = await getUserStats('test-user-id')

      expect(result.beers_logged).toBe(3)
      expect(result.avg_rating).toBe(4) // (4 + 5 + 3) / 3 = 4
      expect(result.collections_count).toBe(2)
      expect(result.wishlist_count).toBe(1)
    })
  })

  describe('createCollection', () => {
    it('should create a collection for authenticated user', async () => {
      const mockSession = createMockSession()
      const mockCollection = createMockCollection()

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
      })

      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockCollection, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const result = await createCollection({
        name: 'My IPAs',
        description: 'Collection of IPA beers',
        is_public: false,
      })

      expect(result).toEqual(mockCollection)
      expect(mockQuery.insert).toHaveBeenCalled()
    })
  })

  describe('addBeerToCollection', () => {
    it('should add beer to collection', async () => {
      const mockCollection = {
        ...createMockCollection(),
        beer_ids: ['beer-1', 'beer-2'],
      }

      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockCollection, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      await addBeerToCollection('collection-id', 'beer-3')

      expect(mockQuery.update).toHaveBeenCalled()
    })

    it('should not add duplicate beer', async () => {
      const mockCollection = {
        ...createMockCollection(),
        beer_ids: ['beer-1', 'beer-2'],
      }

      let updateCalled = false
      const mockQuery = createMockQueryBuilder()
      mockQuery.update = jest.fn(() => {
        updateCalled = true
        return mockQuery
      })
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockCollection, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      await addBeerToCollection('collection-id', 'beer-1')

      expect(updateCalled).toBe(false)
    })
  })

  describe('getUserTastingNotes', () => {
    it('should fetch user tasting notes', async () => {
      const mockTastingNotes = [
        createMockTastingNote(),
        createMockTastingNote(),
      ]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockTastingNotes, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const result = await getUserTastingNotes('test-user-id')

      expect(result).toEqual(mockTastingNotes)
    })
  })

  describe('getUserCollections', () => {
    it('should fetch user collections', async () => {
      const mockCollections = [
        createMockCollection(),
        createMockCollection(),
      ]
      const mockQuery = createMockQueryBuilder()
      mockQuery.then.mockImplementation(async (onFulfilled: any) => {
        return onFulfilled({ data: mockCollections, error: null })
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockQuery)

      const result = await getUserCollections('test-user-id')

      expect(result).toEqual(mockCollections)
    })
  })

  describe('getUserWishlist', () => {
    it('should fetch user wishlist', async () => {
      const mockBeers: Beer[] = [createMockBeer(), createMockBeer()]
      const mockWishlistItems: Array<{ beer_id: string }> = [
        { beer_id: mockBeers[0].id },
        { beer_id: mockBeers[1].id },
      ]

      ;(supabase.from as jest.Mock).mockImplementation((table: string) => {
        const mockQuery = createMockQueryBuilder()
        mockQuery.then.mockImplementation(async (onFulfilled: any) => {
          const data = table === 'wishlist' ? mockWishlistItems : mockBeers
          return onFulfilled({ data, error: null })
        })
        return mockQuery
      })

      const result = await getUserWishlist('test-user-id')

      expect(result).toEqual(mockBeers)
    })

    it('should return empty array if wishlist is empty', async () => {
      const mockWishlistItems: Array<{ beer_id: string }> = []

      ;(supabase.from as jest.Mock).mockImplementation((table: string) => {
        const mockQuery = createMockQueryBuilder()
        mockQuery.then.mockImplementation(async (onFulfilled: any) => {
          const data = table === 'wishlist' ? mockWishlistItems : []
          return onFulfilled({ data, error: null })
        })
        return mockQuery
      })

      const result = await getUserWishlist('test-user-id')

      expect(result).toEqual([])
    })
  })
})
