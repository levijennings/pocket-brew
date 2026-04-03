export interface Beer {
  id: string
  name: string
  brewery_id: string
  style: string
  abv: number
  ibu?: number
  description?: string
  image_url?: string
  avg_rating: number
  rating_count: number
  created_at: string
}

export interface Brewery {
  id: string
  name: string
  city: string
  state: string
  country: string
  website_url?: string
  logo_url?: string
  latitude?: number
  longitude?: number
}

export interface TastingNote {
  id: string
  beer_id: string
  user_id: string
  rating: number
  aroma: number
  appearance: number
  taste: number
  mouthfeel: number
  overall_impression: string
  flavor_notes: string[]
  serving_type: 'draft' | 'bottle' | 'can' | 'cask'
  location?: string
  photo_url?: string
  created_at: string
}

export interface BeerCollection {
  id: string
  user_id: string
  name: string
  description?: string
  beer_ids: string[]
  is_public: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  bio?: string
  favorite_styles: string[]
  beers_logged: number
  created_at: string
}
