# Pocket Brew - Supabase Schema

Production-grade PostgreSQL schema for the Pocket Brew craft beer journal and discovery app.

## Files

### Migrations
- **`migrations/00001_initial_schema.sql`** - Complete database schema with 8 tables, indexes, triggers, and RLS policies

### Seed Data
- **`seed.sql`** - Initial seed data with 15 beer styles, 10 breweries, and 22 sample beers

## Schema Overview

### Core Tables

1. **profiles** - User profiles extending Supabase auth.users
   - Tracks beers logged and unique breweries visited
   - Favorite beer styles array
   - Profile customization fields (avatar, bio, display name)

2. **beer_styles** - Beer style lookup with 15+ common styles
   - Includes typical ABV/IBU ranges for style guidance
   - Linked to beers via foreign key

3. **breweries** - Craft breweries with location and metadata
   - Geo-indexing for location-based queries
   - Automatic stats (beer count, avg rating)

4. **beers** - Individual beer listings
   - Links brewery + style
   - Tracks ABV, IBU, descriptions
   - Auto-calculated avg_rating from tasting notes

5. **tasting_notes** - User beer reviews and ratings
   - Individual scores: aroma, appearance, taste, mouthfeel, overall
   - Flavor notes array for quick categorization
   - Serving type tracking (draft, bottle, can, etc.)
   - Public/private visibility toggle

6. **collections** - Custom user beer lists
   - Public or private
   - Auto-calculated beer count
   - Optional description

7. **collection_beers** - Junction table for collections
   - Supports per-beer notes within collections
   - Prevents duplicate additions

8. **wishlist** - Simple wishlist of beers to try
   - User + beer unique constraint

## Key Features

### Automatic Stats Calculation
Triggers automatically maintain derived stats:
- `profiles.beers_logged` - distinct beers the user has tasted
- `profiles.unique_breweries` - count of breweries visited
- `beers.avg_rating` - average of all tasting notes
- `beers.rating_count` - total tasting notes
- `breweries.beer_count` - beers from each brewery
- `breweries.avg_rating` - average rating of brewery's beers
- `collections.beer_count` - beers in each collection

### Row Level Security
All tables have RLS enabled:
- **Profiles**: Anyone can read, users edit own
- **Beer Styles, Breweries, Beers**: Public read, authenticated can contribute
- **Tasting Notes**: Public tasting notes are readable by all, private ones only by owner
- **Collections**: Public collections readable by all, private only by owner
- **Collection Beers**: Access controlled by parent collection's ownership
- **Wishlist**: Only visible to owner

### Performance Indexes
Optimized for common queries:
- Beer lookups by brewery, style, slug
- Leaderboards by avg_rating
- Tasting notes timeline queries
- Geo-location queries for nearby breweries
- User-scoped queries (collections, wishlist, tasting history)

## Deployment

### Using Supabase CLI

```bash
# Apply migrations
supabase migration up

# Or apply specific migration
supabase db push
```

### Using Direct SQL

Run in Supabase SQL Editor:
1. Execute `migrations/00001_initial_schema.sql`
2. Execute `seed.sql` for sample data

## Schema Statistics

- **Tables**: 8
- **Indexes**: 11
- **Triggers**: 9
- **Functions**: 6
- **RLS Policies**: 20+
- **Beer Styles**: 15 (seeded)
- **Breweries**: 10 (seeded)
- **Beers**: 22 (seeded)

## Data Constraints

### Rating Scales (0.5 to 5.0)
- Individual aspect ratings (aroma, appearance, taste, mouthfeel)
- Overall rating

### Serving Types
Valid values: `draft`, `bottle`, `can`, `cask`, `crowler`, `growler`

### Beer Metrics
- ABV: NUMERIC(4,2) - 0.0% to 99.99%
- IBU: INTEGER - 0 to 999
- Ratings: NUMERIC(3,2) - 0.5 to 5.0

## Usage Examples

### Log a Tasting
```sql
INSERT INTO tasting_notes (
  user_id, beer_id, rating, aroma, appearance, taste, mouthfeel,
  overall_impression, flavor_notes, serving_type, location, is_public
) VALUES (
  'user-uuid', 'beer-uuid', 4.5, 4.0, 4.2, 4.8, 4.3,
  'Excellent hoppy finish!', ARRAY['citrus', 'pine', 'floral'],
  'draft', 'Local Brewery', true
);
```

### Create a Collection
```sql
INSERT INTO collections (user_id, name, description, is_public)
VALUES ('user-uuid', 'West Coast IPAs', 'My favorite hoppy beers', true);
```

### Find Top-Rated Beers
```sql
SELECT b.name, b.avg_rating, br.name as brewery
FROM beers b
JOIN breweries br ON b.brewery_id = br.id
WHERE b.avg_rating > 0 AND b.rating_count >= 5
ORDER BY b.avg_rating DESC
LIMIT 10;
```

### Nearby Breweries (within ~25 miles)
```sql
SELECT name, city, state,
  earth_distance(
    ll_to_earth(latitude, longitude),
    ll_to_earth(40.7128, -74.0060)
  ) / 1609.34 as miles_away
FROM breweries
ORDER BY miles_away
LIMIT 10;
```

## Notes

- All timestamps are in TIMESTAMPTZ for timezone awareness
- UUIDs are used for all primary keys for better distributed systems support
- Foreign key cascading ensures referential integrity
- Soft deletes are not implemented - deletions cascade appropriately
- Array columns (favorite_styles, flavor_notes) use PostgreSQL ARRAY type
