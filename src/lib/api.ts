import { supabase } from './supabase'
import type { Beer, Brewery, TastingNote, BeerCollection, UserProfile } from '../types/index'
import type { BeerSearchInput, TastingNoteInput, CollectionInput, CollectionUpdateInput, ProfileUpdateInput } from './validations'

/**
 * Beer API Functions
 */

export interface BeerFilters {
  limit?: number
  offset?: number
  sortBy?: 'rating' | 'name' | 'recent'
}

export async function getBeers(filters?: BeerFilters): Promise<Beer[]> {
  try {
    let query = supabase.from('beers').select('*')

    if (filters?.sortBy === 'rating') {
      query = query.order('avg_rating', { ascending: false })
    } else if (filters?.sortBy === 'name') {
      query = query.order('name', { ascending: true })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch beers: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getBeers error:', error)
    throw error
  }
}

export async function getBeerById(id: string): Promise<Beer | null> {
  try {
    const { data, error } = await supabase.from('beers').select('*').eq('id', id).single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch beer: ${error.message}`)
    }
    return data || null
  } catch (error) {
    console.error('getBeerById error:', error)
    throw error
  }
}

export async function searchBeers(query: string, filters?: Omit<BeerSearchInput, 'query'>): Promise<Beer[]> {
  try {
    let dbQuery = supabase.from('beers').select('*')

    if (query.trim()) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (filters?.style_id) {
      dbQuery = dbQuery.eq('style', filters.style_id)
    }
    if (filters?.brewery_id) {
      dbQuery = dbQuery.eq('brewery_id', filters.brewery_id)
    }
    if (filters?.min_rating) {
      dbQuery = dbQuery.gte('avg_rating', filters.min_rating)
    }
    if (filters?.max_rating) {
      dbQuery = dbQuery.lte('avg_rating', filters.max_rating)
    }

    const sortBy = filters?.sort || 'popularity'
    if (sortBy === 'rating') {
      dbQuery = dbQuery.order('avg_rating', { ascending: false })
    } else if (sortBy === 'name') {
      dbQuery = dbQuery.order('name', { ascending: true })
    } else if (sortBy === 'recent') {
      dbQuery = dbQuery.order('created_at', { ascending: false })
    }

    const limit = filters?.limit || 50
    const offset = filters?.offset || 0
    dbQuery = dbQuery.range(offset, offset + limit - 1)

    const { data, error } = await dbQuery

    if (error) throw new Error(`Failed to search beers: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('searchBeers error:', error)
    throw error
  }
}

export async function getBeersByBrewery(breweryId: string): Promise<Beer[]> {
  try {
    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .eq('brewery_id', breweryId)
      .order('name', { ascending: true })

    if (error) throw new Error(`Failed to fetch beers by brewery: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getBeersByBrewery error:', error)
    throw error
  }
}

export async function getBeersByStyle(styleId: string): Promise<Beer[]> {
  try {
    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .eq('style', styleId)
      .order('avg_rating', { ascending: false })

    if (error) throw new Error(`Failed to fetch beers by style: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getBeersByStyle error:', error)
    throw error
  }
}

export async function getTopRatedBeers(limit: number = 10): Promise<Beer[]> {
  try {
    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .order('avg_rating', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Failed to fetch top rated beers: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getTopRatedBeers error:', error)
    throw error
  }
}

export async function getRecentlyLogged(userId: string, limit: number = 10): Promise<Beer[]> {
  try {
    const { data, error } = await supabase
      .from('tasting_notes')
      .select('beer_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Failed to fetch recently logged: ${error.message}`)

    const beerIds = data?.map(note => note.beer_id) || []
    if (beerIds.length === 0) return []

    const { data: beers, error: beerError } = await supabase
      .from('beers')
      .select('*')
      .in('id', beerIds)

    if (beerError) throw new Error(`Failed to fetch beer details: ${beerError.message}`)
    return beers || []
  } catch (error) {
    console.error('getRecentlyLogged error:', error)
    throw error
  }
}

/**
 * Brewery API Functions
 */

export interface BreweryFilters {
  limit?: number
  offset?: number
}

export async function getBreweries(filters?: BreweryFilters): Promise<Brewery[]> {
  try {
    let query = supabase.from('breweries').select('*').order('name', { ascending: true })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch breweries: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getBreweries error:', error)
    throw error
  }
}

export async function getBreweryById(id: string): Promise<Brewery | null> {
  try {
    const { data, error } = await supabase.from('breweries').select('*').eq('id', id).single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch brewery: ${error.message}`)
    }
    return data || null
  } catch (error) {
    console.error('getBreweryById error:', error)
    throw error
  }
}

export async function getNearbyBreweries(
  lat: number,
  lng: number,
  radiusKm: number = 10
): Promise<Brewery[]> {
  try {
    const { data, error } = await supabase.rpc('nearby_breweries', {
      user_lat: lat,
      user_lng: lng,
      radius_km: radiusKm,
    })

    if (error) throw new Error(`Failed to fetch nearby breweries: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getNearbyBreweries error:', error)
    throw error
  }
}

/**
 * Tasting Notes API Functions
 */

export async function createTastingNote(data: TastingNoteInput): Promise<TastingNote> {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const { data: tastingNote, error } = await supabase
      .from('tasting_notes')
      .insert({
        ...data,
        user_id: session.session.user.id,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create tasting note: ${error.message}`)
    return tastingNote
  } catch (error) {
    console.error('createTastingNote error:', error)
    throw error
  }
}

export async function updateTastingNote(id: string, data: Partial<TastingNoteInput>): Promise<TastingNote> {
  try {
    const { data: tastingNote, error } = await supabase
      .from('tasting_notes')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update tasting note: ${error.message}`)
    return tastingNote
  } catch (error) {
    console.error('updateTastingNote error:', error)
    throw error
  }
}

export async function deleteTastingNote(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('tasting_notes').delete().eq('id', id)

    if (error) throw new Error(`Failed to delete tasting note: ${error.message}`)
  } catch (error) {
    console.error('deleteTastingNote error:', error)
    throw error
  }
}

export interface TastingNoteFilters {
  limit?: number
  offset?: number
  beerOnly?: boolean
}

export async function getUserTastingNotes(
  userId: string,
  filters?: TastingNoteFilters
): Promise<TastingNote[]> {
  try {
    let query = supabase
      .from('tasting_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch user tasting notes: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getUserTastingNotes error:', error)
    throw error
  }
}

export async function getTastingNotesForBeer(beerId: string): Promise<TastingNote[]> {
  try {
    const { data, error } = await supabase
      .from('tasting_notes')
      .select('*')
      .eq('beer_id', beerId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch tasting notes for beer: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getTastingNotesForBeer error:', error)
    throw error
  }
}

/**
 * Collections API Functions
 */

export async function createCollection(data: CollectionInput): Promise<BeerCollection> {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const { data: collection, error } = await supabase
      .from('collections')
      .insert({
        ...data,
        user_id: session.session.user.id,
        beer_ids: [],
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create collection: ${error.message}`)
    return collection
  } catch (error) {
    console.error('createCollection error:', error)
    throw error
  }
}

export async function updateCollection(id: string, data: CollectionUpdateInput): Promise<BeerCollection> {
  try {
    const { data: collection, error } = await supabase
      .from('collections')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update collection: ${error.message}`)
    return collection
  } catch (error) {
    console.error('updateCollection error:', error)
    throw error
  }
}

export async function deleteCollection(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('collections').delete().eq('id', id)

    if (error) throw new Error(`Failed to delete collection: ${error.message}`)
  } catch (error) {
    console.error('deleteCollection error:', error)
    throw error
  }
}

export async function getUserCollections(userId: string): Promise<BeerCollection[]> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch user collections: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getUserCollections error:', error)
    throw error
  }
}

export async function addBeerToCollection(collectionId: string, beerId: string): Promise<void> {
  try {
    const { data: collection, error: fetchError } = await supabase
      .from('collections')
      .select('beer_ids')
      .eq('id', collectionId)
      .single()

    if (fetchError) throw new Error(`Failed to fetch collection: ${fetchError.message}`)

    const beerIds = collection.beer_ids || []
    if (!beerIds.includes(beerId)) {
      beerIds.push(beerId)

      const { error } = await supabase
        .from('collections')
        .update({ beer_ids: beerIds })
        .eq('id', collectionId)

      if (error) throw new Error(`Failed to add beer to collection: ${error.message}`)
    }
  } catch (error) {
    console.error('addBeerToCollection error:', error)
    throw error
  }
}

export async function removeBeerFromCollection(collectionId: string, beerId: string): Promise<void> {
  try {
    const { data: collection, error: fetchError } = await supabase
      .from('collections')
      .select('beer_ids')
      .eq('id', collectionId)
      .single()

    if (fetchError) throw new Error(`Failed to fetch collection: ${fetchError.message}`)

    const beerIds = (collection.beer_ids || []).filter((id: string) => id !== beerId)

    const { error } = await supabase
      .from('collections')
      .update({ beer_ids: beerIds })
      .eq('id', collectionId)

    if (error) throw new Error(`Failed to remove beer from collection: ${error.message}`)
  } catch (error) {
    console.error('removeBeerFromCollection error:', error)
    throw error
  }
}

/**
 * Wishlist API Functions
 */

export async function addToWishlist(beerId: string): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase.from('wishlist').insert({
      user_id: session.session.user.id,
      beer_id: beerId,
    })

    if (error && error.code !== '23505') {
      // 23505 is unique constraint violation, which means it's already there
      throw new Error(`Failed to add to wishlist: ${error.message}`)
    }
  } catch (error) {
    console.error('addToWishlist error:', error)
    throw error
  }
}

export async function removeFromWishlist(beerId: string): Promise<void> {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', session.session.user.id)
      .eq('beer_id', beerId)

    if (error) throw new Error(`Failed to remove from wishlist: ${error.message}`)
  } catch (error) {
    console.error('removeFromWishlist error:', error)
    throw error
  }
}

export async function getUserWishlist(userId: string): Promise<Beer[]> {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('beer_id')
      .eq('user_id', userId)

    if (error) throw new Error(`Failed to fetch wishlist: ${error.message}`)

    const beerIds = data?.map(item => item.beer_id) || []
    if (beerIds.length === 0) return []

    const { data: beers, error: beerError } = await supabase
      .from('beers')
      .select('*')
      .in('id', beerIds)

    if (beerError) throw new Error(`Failed to fetch beer details: ${beerError.message}`)
    return beers || []
  } catch (error) {
    console.error('getUserWishlist error:', error)
    throw error
  }
}

/**
 * Profile API Functions
 */

export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }
    return data || null
  } catch (error) {
    console.error('getProfile error:', error)
    throw error
  }
}

export async function updateProfile(data: ProfileUpdateInput): Promise<UserProfile> {
  try {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user?.id) {
      throw new Error('User not authenticated')
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', session.session.user.id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update profile: ${error.message}`)
    return profile
  } catch (error) {
    console.error('updateProfile error:', error)
    throw error
  }
}

export async function getUserStats(userId: string): Promise<{
  beers_logged: number
  avg_rating: number
  favorite_style: string | null
  collections_count: number
  wishlist_count: number
}> {
  try {
    const tastingNotes = await getUserTastingNotes(userId)
    const collections = await getUserCollections(userId)
    const wishlist = await getUserWishlist(userId)

    const avgRating = tastingNotes.length > 0
      ? tastingNotes.reduce((sum, note) => sum + note.rating, 0) / tastingNotes.length
      : 0

    return {
      beers_logged: tastingNotes.length,
      avg_rating: Math.round(avgRating * 10) / 10,
      favorite_style: null, // Would require aggregating styles from beers
      collections_count: collections.length,
      wishlist_count: wishlist.length,
    }
  } catch (error) {
    console.error('getUserStats error:', error)
    throw error
  }
}

/**
 * Beer Styles API Functions
 */

export interface BeerStyle {
  id: string
  name: string
  description?: string
}

export async function getAllStyles(): Promise<BeerStyle[]> {
  try {
    const { data, error } = await supabase
      .from('beer_styles')
      .select('id, name, description')
      .order('name', { ascending: true })

    if (error) throw new Error(`Failed to fetch beer styles: ${error.message}`)
    return data || []
  } catch (error) {
    console.error('getAllStyles error:', error)
    throw error
  }
}

/**
 * Unified Search API Function
 */

export interface UnifiedSearchResult {
  beers: Beer[]
  breweries: Brewery[]
  styles: BeerStyle[]
}

export async function unifiedSearch(query: string): Promise<UnifiedSearchResult> {
  try {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return { beers: [], breweries: [], styles: [] }
    }

    const [beersResult, breweriesResult, stylesResult] = await Promise.all([
      searchBeers(trimmedQuery, { limit: 10, offset: 0, sort: 'popularity' }),
      supabase
        .from('breweries')
        .select('*')
        .or(`name.ilike.%${trimmedQuery}%,city.ilike.%${trimmedQuery}%`)
        .limit(10),
      supabase
        .from('beer_styles')
        .select('id, name, description')
        .or(`name.ilike.%${trimmedQuery}%`)
        .limit(10),
    ])

    return {
      beers: beersResult,
      breweries: breweriesResult.data || [],
      styles: stylesResult.data || [],
    }
  } catch (error) {
    console.error('unifiedSearch error:', error)
    throw error
  }
}
