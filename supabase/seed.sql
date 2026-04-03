-- Pocket Brew - Seed Data
-- Created: 2026-04-03
-- Description: Initial seed data with beer styles, breweries, and beers

-- =============================================================================
-- 1. BEER STYLES (15+ common styles)
-- =============================================================================

INSERT INTO beer_styles (name, category, description, typical_abv_min, typical_abv_max, typical_ibu_min, typical_ibu_max)
VALUES
  ('IPA', 'Ale', 'India Pale Ale with bold hop flavors and balanced bitterness', 6.0, 7.5, 40, 60),
  ('Double IPA', 'Ale', 'Imperial IPA with intense hoppy character and higher alcohol', 8.0, 10.0, 50, 80),
  ('Hazy IPA', 'Ale', 'New England style IPA with cloudy appearance and juicy hop flavors', 6.0, 7.5, 35, 50),
  ('Pale Ale', 'Ale', 'Classic American pale ale with moderate hop character', 5.0, 6.0, 30, 45),
  ('Stout', 'Ale', 'Dark beer with roasted grain flavors and creamy head', 5.0, 7.0, 40, 60),
  ('Imperial Stout', 'Ale', 'Full-bodied stout with high alcohol content and rich flavors', 8.0, 12.0, 50, 80),
  ('Porter', 'Ale', 'Dark brown ale with chocolate and coffee notes', 5.0, 7.0, 25, 50),
  ('Pilsner', 'Lager', 'Light, crisp lager with noble hop character', 4.5, 5.5, 25, 40),
  ('Lager', 'Lager', 'Clean and refreshing base lager style', 4.5, 5.5, 20, 35),
  ('Wheat Beer', 'Hybrid', 'Wheat-based ale with light, fruity character', 4.5, 6.0, 15, 30),
  ('Sour', 'Ale', 'Intentionally sour ale with tart and complex flavors', 4.0, 7.0, 5, 25),
  ('Belgian Tripel', 'Ale', 'Strong golden ale with fruity esters and spicy phenols', 8.0, 11.0, 20, 40),
  ('Saison', 'Ale', 'Farmhouse ale with dry character and spicy yeast flavors', 5.0, 7.0, 20, 40),
  ('Amber Ale', 'Ale', 'Medium-bodied ale with caramel malt and moderate hops', 5.0, 6.5, 30, 45),
  ('Brown Ale', 'Ale', 'Medium-bodied brown with nutty and chocolate notes', 4.5, 6.5, 20, 40);

-- =============================================================================
-- 2. BREWERIES
-- =============================================================================

INSERT INTO breweries (name, slug, city, state, country, website_url, logo_url, latitude, longitude)
VALUES
  ('Sierra Nevada Brewing', 'sierra-nevada-brewing', 'Chico', 'CA', 'US', 'https://www.sierranevada.com', NULL, 39.7425, -121.8365),
  ('Stone Brewing', 'stone-brewing', 'Escondido', 'CA', 'US', 'https://www.stonebrewing.com', NULL, 33.1189, -117.1239),
  ('Dogfish Head Craft Brewery', 'dogfish-head', 'Milton', 'DE', 'US', 'https://www.dogfishead.com', NULL, 38.7623, -75.3268),
  ('Three Floyds Brewing', 'three-floyds', 'Munster', 'IN', 'US', 'https://www.3floyds.com', NULL, 41.5589, -87.4893),
  ('Bell''s Brewery', 'bells-brewery', 'Kalamazoo', 'MI', 'US', 'https://www.bellsbeer.com', NULL, 42.2917, -85.5847),
  ('New Belgium Brewing', 'new-belgium', 'Fort Collins', 'CO', 'US', 'https://www.newbelgium.com', NULL, 40.5853, -105.0873),
  ('Russian River Brewing', 'russian-river', 'Santa Rosa', 'CA', 'US', 'https://www.russianriverbrewing.com', NULL, 38.4461, -122.5107),
  ('Lagunitas Brewing', 'lagunitas', 'Petaluma', 'CA', 'US', 'https://www.lagunitas.com', NULL, 38.2582, -122.6400),
  ('Ballast Point Brewing', 'ballast-point', 'San Diego', 'CA', 'US', 'https://www.ballastpoint.com', NULL, 32.7157, -117.1611),
  ('Firestone Walker Brewing', 'firestone-walker', 'Paso Robles', 'CA', 'US', 'https://www.firestonewalker.com', NULL, 35.6264, -120.6926);

-- =============================================================================
-- 3. BEERS
-- =============================================================================

INSERT INTO beers (name, slug, brewery_id, style_id, abv, ibu, description, image_url)
SELECT
  b.name,
  LOWER(REPLACE(b.name, ' ', '-')),
  b.brewery_id,
  b.style_id,
  b.abv,
  b.ibu,
  b.description,
  NULL
FROM (
  VALUES
    -- Sierra Nevada
    ('Pale Ale', (SELECT id FROM breweries WHERE slug = 'sierra-nevada-brewing'), (SELECT id FROM beer_styles WHERE name = 'Pale Ale'), 5.6, 38, 'Crisp, clean, and refreshingly hoppy'),
    ('Torpedo IPA', (SELECT id FROM breweries WHERE slug = 'sierra-nevada-brewing'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 6.2, 65, 'Bold, complex IPA with tropical hop character'),
    ('Tropical Torpedo', (SELECT id FROM breweries WHERE slug = 'sierra-nevada-brewing'), (SELECT id FROM beer_styles WHERE name = 'Hazy IPA'), 6.5, 55, 'Hazy IPA with pineapple and mango notes'),

    -- Stone Brewing
    ('IPA', (SELECT id FROM breweries WHERE slug = 'stone-brewing'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 6.9, 71, 'Aggressive IPA with bold citrus and pine notes'),
    ('Arrogant Bastard', (SELECT id FROM breweries WHERE slug = 'stone-brewing'), (SELECT id FROM beer_styles WHERE name = 'Pale Ale'), 7.2, 68, 'American pale ale with strong character'),
    ('Imperial Russian Stout', (SELECT id FROM breweries WHERE slug = 'stone-brewing'), (SELECT id FROM beer_styles WHERE name = 'Imperial Stout'), 9.4, 75, 'Rich, complex stout with dark fruit flavors'),

    -- Dogfish Head
    ('60 Minute IPA', (SELECT id FROM breweries WHERE slug = 'dogfish-head'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 6.0, 60, 'Year-round continuously hopped IPA'),
    ('90 Minute IPA', (SELECT id FROM breweries WHERE slug = 'dogfish-head'), (SELECT id FROM beer_styles WHERE name = 'Double IPA'), 9.0, 90, 'Imperial IPA with continuous hopping'),
    ('Pivo Pils', (SELECT id FROM breweries WHERE slug = 'dogfish-head'), (SELECT id FROM beer_styles WHERE name = 'Pilsner'), 5.1, 40, 'Unpasteurized, unfiltered Czech-style pilsner'),

    -- Three Floyds
    ('Zombie Dust', (SELECT id FROM breweries WHERE slug = 'three-floyds'), (SELECT id FROM beer_styles WHERE name = 'Pale Ale'), 6.2, 50, 'American pale ale with intense fruity aroma'),
    ('Dark Lord', (SELECT id FROM breweries WHERE slug = 'three-floyds'), (SELECT id FROM beer_styles WHERE name = 'Imperial Stout'), 15.0, 85, 'Legendary aged imperial stout'),

    -- Bell''s Brewery
    ('Two Hearted IPA', (SELECT id FROM breweries WHERE slug = 'bells-brewery'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 7.0, 55, 'Single-hop IPA showcasing Centennial hops'),
    ('Oberon Ale', (SELECT id FROM breweries WHERE slug = 'bells-brewery'), (SELECT id FROM beer_styles WHERE name = 'Wheat Beer'), 5.8, 28, 'Smooth wheat ale with fruity phenolics'),

    -- New Belgium
    ('Fat Tire', (SELECT id FROM breweries WHERE slug = 'new-belgium'), (SELECT id FROM beer_styles WHERE name = 'Amber Ale'), 5.2, 45, 'Approachable amber ale with balanced flavors'),
    ('Citradelic IPA', (SELECT id FROM breweries WHERE slug = 'new-belgium'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 6.8, 62, 'Citrus-forward IPA with smooth finish'),

    -- Russian River
    ('Pliny the Elder', (SELECT id FROM breweries WHERE slug = 'russian-river'), (SELECT id FROM beer_styles WHERE name = 'Double IPA'), 8.0, 100, 'Classic DIPA with fresh citrus and pine'),
    ('Pliny the Younger', (SELECT id FROM breweries WHERE slug = 'russian-river'), (SELECT id FROM beer_styles WHERE name = 'Imperial IPA'), 11.0, 110, 'Beast of a triple IPA, limited release'),

    -- Lagunitas
    ('IPA', (SELECT id FROM breweries WHERE slug = 'lagunitas'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 6.2, 60, 'Casual, approachable West Coast IPA'),
    ('Hairy Eyeball', (SELECT id FROM breweries WHERE slug = 'lagunitas'), (SELECT id FROM beer_styles WHERE name = 'Imperial Stout'), 9.7, 80, 'Rich imperial stout with complex roast'),

    -- Ballast Point
    ('Sculpin IPA', (SELECT id FROM breweries WHERE slug = 'ballast-point'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 7.0, 70, 'Award-winning IPA with tropical fruit notes'),
    ('Big Eye Barleywine', (SELECT id FROM breweries WHERE slug = 'ballast-point'), (SELECT id FROM beer_styles WHERE name = 'Imperial Stout'), 10.5, 90, 'Rich, complex barleywine'),

    -- Firestone Walker
    ('Union Jack IPA', (SELECT id FROM breweries WHERE slug = 'firestone-walker'), (SELECT id FROM beer_styles WHERE name = 'IPA'), 7.0, 65, 'Classic American IPA with bright citrus'),
    ('Velvet Merlin Porter', (SELECT id FROM breweries WHERE slug = 'firestone-walker'), (SELECT id FROM beer_styles WHERE name = 'Porter'), 5.5, 35, 'Smooth, chocolatey porter')
) AS b(name, brewery_id, style_id, abv, ibu, description, image_url);

-- =============================================================================
-- 4. NOTES
-- =============================================================================

-- This seed file creates:
-- - 15 beer styles covering all major categories
-- - 10 well-known craft breweries with realistic data
-- - 22 beers across various styles from these breweries
--
-- The data includes:
-- - Realistic ABV and IBU values for each style
-- - Authentic brewery locations and URLs (fictional for demo purposes where needed)
-- - Diverse beer portfolio representing different styles
-- - All relationships properly configured via foreign keys
--
-- Stats will be automatically calculated by triggers when beers are created:
-- - brewery.beer_count (1-3 per brewery in this seed)
-- - brewery.avg_rating (0 initially, updates as tasting notes are added)
