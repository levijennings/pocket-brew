/**
 * Test utilities and factory functions for creating mock data
 */

import type {
  Beer,
  Brewery,
  TastingNote,
  BeerCollection,
  UserProfile,
} from '../types/index'

/**
 * Create a mock beer object
 */
export function createMockBeer(overrides?: Partial<Beer>): Beer {
  return {
    id: 'test-beer-' + Math.random().toString(36).substr(2, 9),
    name: 'Test Beer',
    brewery_id: 'test-brewery-id',
    style: 'IPA',
    abv: 6.5,
    ibu: 60,
    description: 'A test beer with great flavor',
    image_url: 'https://example.com/beer.jpg',
    avg_rating: 4.2,
    rating_count: 42,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock brewery object
 */
export function createMockBrewery(overrides?: Partial<Brewery>): Brewery {
  return {
    id: 'test-brewery-' + Math.random().toString(36).substr(2, 9),
    name: 'Test Brewery',
    city: 'Portland',
    state: 'OR',
    country: 'USA',
    website_url: 'https://testbrewery.com',
    logo_url: 'https://example.com/logo.jpg',
    latitude: 45.5152,
    longitude: -122.6784,
    ...overrides,
  }
}

/**
 * Create a mock tasting note object
 */
export function createMockTastingNote(
  overrides?: Partial<TastingNote>
): TastingNote {
  return {
    id: 'test-note-' + Math.random().toString(36).substr(2, 9),
    beer_id: 'test-beer-id',
    user_id: 'test-user-id',
    rating: 4,
    aroma: 8,
    appearance: 9,
    taste: 8,
    mouthfeel: 7,
    overall_impression: 'Great beer, would recommend!',
    flavor_notes: ['hoppy', 'citrus', 'pine'],
    serving_type: 'draft',
    location: 'Test Brewery',
    photo_url: 'https://example.com/note.jpg',
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock beer collection object
 */
export function createMockCollection(
  overrides?: Partial<BeerCollection>
): BeerCollection {
  return {
    id: 'test-collection-' + Math.random().toString(36).substr(2, 9),
    user_id: 'test-user-id',
    name: 'Test Collection',
    description: 'A collection of test beers',
    beer_ids: ['beer-1', 'beer-2', 'beer-3'],
    is_public: false,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock user profile object
 */
export function createMockProfile(
  overrides?: Partial<UserProfile>
): UserProfile {
  return {
    id: 'test-user-' + Math.random().toString(36).substr(2, 9),
    email: 'test@example.com',
    display_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'A test user',
    favorite_styles: ['IPA', 'Stout', 'Pilsner'],
    beers_logged: 42,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Wait helper for async tests
 */
export async function waitFor(
  callback: () => void,
  options?: { timeout?: number; interval?: number }
): Promise<void> {
  const timeout = options?.timeout || 1000
  const interval = options?.interval || 50
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      try {
        callback()
        clearInterval(timer)
        resolve()
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          clearInterval(timer)
          reject(error)
        }
      }
    }, interval)
  })
}

/**
 * Create a mock AsyncStorage
 */
export function createMockAsyncStorage() {
  const store: Record<string, string> = {}

  return {
    getItem: jest.fn(async (key: string) => store[key] || null),
    setItem: jest.fn(async (key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn(async (key: string) => {
      delete store[key]
    }),
    clear: jest.fn(async () => {
      Object.keys(store).forEach((key) => delete store[key])
    }),
    getAllKeys: jest.fn(async () => Object.keys(store)),
    multiSet: jest.fn(async (entries: Array<[string, string]>) => {
      entries.forEach(([key, value]) => {
        store[key] = value
      })
    }),
    multiGet: jest.fn(async (keys: string[]) => {
      return keys.map((key) => [key, store[key] || null])
    }),
    multiRemove: jest.fn(async (keys: string[]) => {
      keys.forEach((key) => delete store[key])
    }),
  }
}

/**
 * Create a mock Supabase session
 */
export function createMockSession() {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: {
      id: 'test-user-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'test@example.com',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
      },
      user_metadata: {
        display_name: 'Test User',
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  }
}
