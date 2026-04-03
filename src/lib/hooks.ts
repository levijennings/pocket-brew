import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import type { Beer, Brewery, TastingNote, BeerCollection, UserProfile } from '../types/index'
import * as API from './api'
import type {
  TastingNoteInput,
  CollectionInput,
  CollectionUpdateInput,
  ProfileUpdateInput,
} from './validations'

/**
 * Generic async data hook
 */
interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
  dependencies: any[] = []
): UseAsyncState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await asyncFunction()
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [asyncFunction])

  useEffect(() => {
    if (!immediate) return

    const executeAsync = async () => {
      try {
        const result = await asyncFunction()
        setState({ data: result, loading: false, error: null })
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error })
      }
    }

    executeAsync()
  }, dependencies)

  return { ...state, refetch }
}

/**
 * Beers Hooks
 */

export function useBeers(filters?: API.BeerFilters) {
  return useAsync(
    () => API.getBeers(filters),
    true,
    [filters?.limit, filters?.offset, filters?.sortBy]
  )
}

export function useBeer(id: string) {
  return useAsync(() => API.getBeerById(id), !!id, [id])
}

export function useSearchBeers(query: string, filters?: Omit<API.BeerSearchInput, 'query'>) {
  return useAsync(
    () => API.searchBeers(query, filters),
    !!query.trim(),
    [query, filters?.brewery_id, filters?.style_id, filters?.min_rating, filters?.max_rating]
  )
}

export function useBeersByBrewery(breweryId: string) {
  return useAsync(() => API.getBeersByBrewery(breweryId), !!breweryId, [breweryId])
}

export function useBeersByStyle(styleId: string) {
  return useAsync(() => API.getBeersByStyle(styleId), !!styleId, [styleId])
}

export function useTopRatedBeers(limit: number = 10) {
  return useAsync(() => API.getTopRatedBeers(limit), true, [limit])
}

export function useRecentlyLogged(userId?: string, limit: number = 10) {
  const [user, setUser] = useState<string | null>(userId || null)

  useEffect(() => {
    if (userId) {
      setUser(userId)
    } else {
      const getUser = async () => {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user?.id || null)
      }
      getUser()
    }
  }, [userId])

  return useAsync(() => (user ? API.getRecentlyLogged(user, limit) : Promise.resolve([])), !!user, [
    user,
    limit,
  ])
}

/**
 * Breweries Hooks
 */

export function useBreweries(filters?: API.BreweryFilters) {
  return useAsync(() => API.getBreweries(filters), true, [filters?.limit, filters?.offset])
}

export function useBrewery(id: string) {
  return useAsync(() => API.getBreweryById(id), !!id, [id])
}

export function useNearbyBreweries(lat?: number, lng?: number, radiusKm: number = 10) {
  return useAsync(
    () => (lat && lng ? API.getNearbyBreweries(lat, lng, radiusKm) : Promise.resolve([])),
    !!(lat && lng),
    [lat, lng, radiusKm]
  )
}

/**
 * Tasting Notes Hooks
 */

export function useTastingNotes(userId?: string, filters?: API.TastingNoteFilters) {
  const [user, setUser] = useState<string | null>(userId || null)

  useEffect(() => {
    if (userId) {
      setUser(userId)
    } else {
      const getUser = async () => {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user?.id || null)
      }
      getUser()
    }
  }, [userId])

  return useAsync(
    () => (user ? API.getUserTastingNotes(user, filters) : Promise.resolve([])),
    !!user,
    [user, filters?.limit, filters?.offset]
  )
}

export function useBeerTastingNotes(beerId: string) {
  return useAsync(() => API.getTastingNotesForBeer(beerId), !!beerId, [beerId])
}

export function useCreateTastingNote() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = useCallback(async (data: TastingNoteInput): Promise<TastingNote | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await API.createTastingNote(data)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading, error }
}

export function useUpdateTastingNote() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = useCallback(async (id: string, data: Partial<TastingNoteInput>): Promise<TastingNote | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await API.updateTastingNote(id, data)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading, error }
}

export function useDeleteTastingNote() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const delete_ = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await API.deleteTastingNote(id)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { delete: delete_, loading, error }
}

/**
 * Collections Hooks
 */

export function useCollections(userId?: string) {
  const [user, setUser] = useState<string | null>(userId || null)

  useEffect(() => {
    if (userId) {
      setUser(userId)
    } else {
      const getUser = async () => {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user?.id || null)
      }
      getUser()
    }
  }, [userId])

  return useAsync(() => (user ? API.getUserCollections(user) : Promise.resolve([])), !!user, [user])
}

export function useCreateCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = useCallback(async (data: CollectionInput): Promise<BeerCollection | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await API.createCollection(data)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading, error }
}

export function useUpdateCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = useCallback(async (id: string, data: CollectionUpdateInput): Promise<BeerCollection | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await API.updateCollection(id, data)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading, error }
}

export function useDeleteCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const delete_ = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await API.deleteCollection(id)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { delete: delete_, loading, error }
}

export function useAddBeerToCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const add = useCallback(async (collectionId: string, beerId: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await API.addBeerToCollection(collectionId, beerId)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { add, loading, error }
}

export function useRemoveBeerFromCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = useCallback(async (collectionId: string, beerId: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await API.removeBeerFromCollection(collectionId, beerId)
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { remove, loading, error }
}

/**
 * Wishlist Hooks
 */

export function useWishlist(userId?: string) {
  const [user, setUser] = useState<string | null>(userId || null)

  useEffect(() => {
    if (userId) {
      setUser(userId)
    } else {
      const getUser = async () => {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user?.id || null)
      }
      getUser()
    }
  }, [userId])

  return useAsync(() => (user ? API.getUserWishlist(user) : Promise.resolve([])), !!user, [user])
}

export function useToggleWishlist() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  const toggleWishlist = useCallback(async (beerId: string, isInWishlist: boolean): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      if (isInWishlist) {
        await API.removeFromWishlist(beerId)
        setWishlistItems(prev => {
          const next = new Set(prev)
          next.delete(beerId)
          return next
        })
      } else {
        await API.addToWishlist(beerId)
        setWishlistItems(prev => new Set(prev).add(beerId))
      }
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { toggleWishlist, loading, error, wishlistItems }
}

/**
 * Profile Hooks
 */

export function useProfile(userId?: string) {
  const [user, setUser] = useState<string | null>(userId || null)

  useEffect(() => {
    if (userId) {
      setUser(userId)
    } else {
      const getUser = async () => {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user?.id || null)
      }
      getUser()
    }
  }, [userId])

  return useAsync(() => (user ? API.getProfile(user) : Promise.resolve(null)), !!user, [user])
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = useCallback(async (data: ProfileUpdateInput): Promise<UserProfile | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await API.updateProfile(data)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading, error }
}

/**
 * User Stats Hook
 */

export interface UserStats {
  beers_logged: number
  avg_rating: number
  favorite_style: string | null
  collections_count: number
  wishlist_count: number
}

export function useUserStats(userId?: string) {
  const [user, setUser] = useState<string | null>(userId || null)

  useEffect(() => {
    if (userId) {
      setUser(userId)
    } else {
      const getUser = async () => {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user?.id || null)
      }
      getUser()
    }
  }, [userId])

  return useAsync<UserStats>(
    () => (user ? API.getUserStats(user) : Promise.resolve({
      beers_logged: 0,
      avg_rating: 0,
      favorite_style: null,
      collections_count: 0,
      wishlist_count: 0,
    })),
    !!user,
    [user]
  )
}

/**
 * Beer Styles Hook
 */

export interface BeerStyle {
  id: string
  name: string
  description?: string
}

export function useBeerStyles() {
  return useAsync(() => API.getAllStyles(), true, [])
}

/**
 * Search Hook
 */

export interface UnifiedSearchResult {
  beers: Beer[]
  breweries: Brewery[]
  styles: BeerStyle[]
}

export function useSearch(query: string) {
  return useAsync(
    () => API.unifiedSearch(query),
    !!query.trim(),
    [query]
  )
}
