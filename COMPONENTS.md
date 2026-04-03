# Pocket Brew Component Library

Complete React Native Expo component library for Pocket Brew, a craft beer tracking app with dark mode default and amber brand colors.

## Color Scheme
- **Brand (Craft Amber):** #D97706 (primary)
- **Dark Background:** #0F0F14
- **Surface:** #1A1A23
- **Text:** #E2E8F0
- **Text Muted:** #94A3B8

## UI Components (`src/components/ui/`)

### Button
Primary interaction element with multiple variants and sizes.
```tsx
<Button
  title="Log Beer"
  onPress={() => {}}
  variant="primary"
  size="md"
/>
```
- **Variants:** `primary`, `secondary`, `ghost`
- **Sizes:** `sm`, `md`, `lg`
- **Props:** `title`, `onPress`, `variant`, `size`, `disabled`, `style`

### Card
Container component for content sections with dark theme border.
```tsx
<Card>
  <Text>Content here</Text>
</Card>
```
- **Props:** `children`, `style`

### Input
Text input field with dark theme, label, and error states.
```tsx
<Input
  label="Beer Name"
  placeholder="Search..."
  value={value}
  onChangeText={setValue}
  variant="search"
/>
```
- **Variants:** `default`, `search` (with search icon)
- **Props:** `label`, `placeholder`, `value`, `onChangeText`, `variant`, `error`, `editable`, `style`

### Badge
Small pill-shaped label component for categorization.
```tsx
<Badge label="IPA" variant="style" />
<Badge label="4.5" variant="rating" score={4.5} />
```
- **Variants:** `default` (amber), `style`, `rating` (color-coded)
- **Props:** `label`, `variant`, `score`, `style`

### Avatar
Circular image with fallback to initials.
```tsx
<Avatar source={{ uri: 'image.jpg' }} size="md" />
<Avatar initials="JD" size="lg" />
```
- **Sizes:** `sm` (32px), `md` (48px), `lg` (64px)
- **Props:** `source`, `initials`, `size`, `style`

### StarRating
5-star rating display with optional interactive mode.
```tsx
<StarRating rating={4} size={20} />
<StarRating
  rating={rating}
  interactive
  onRatingChange={setRating}
/>
```
- **Props:** `rating`, `size`, `interactive`, `onRatingChange`, `style`

### Skeleton
Animated loading placeholder with pulse effect.
```tsx
<Skeleton variant="text" width="70%" />
<Skeleton variant="circle" height={48} />
<Skeleton variant="card" width="100%" />
```
- **Variants:** `text`, `circle`, `card`
- **Props:** `variant`, `width`, `height`, `style`

### EmptyState
Centered empty state with icon, title, and optional action.
```tsx
<EmptyState
  title="No beers yet"
  subtitle="Start logging beers to build your collection"
  actionLabel="Log First Beer"
  onAction={() => {}}
/>
```
- **Props:** `icon`, `title`, `subtitle`, `actionLabel`, `onAction`

### Toast
Simple toast notification that slides in from top.
```tsx
<Toast
  message="Beer saved!"
  variant="success"
  visible={showToast}
  duration={3000}
  onDismiss={() => setShowToast(false)}
/>
```
- **Variants:** `success`, `error`, `info`
- **Props:** `message`, `variant`, `duration`, `visible`, `onDismiss`

## Beer Components (`src/components/beer/`)

### BeerCard
Card displaying a beer with name, brewery, style, ABV, and rating.
```tsx
<BeerCard
  id="123"
  name="Hoppy IPA"
  breweryName="Local Brewery"
  style="IPA"
  abv={6.5}
  rating={4.2}
  ratingCount={42}
  imageUrl="beer.jpg"
  onPress={() => navigateToBeer('123')}
/>
```
- **Props:** `id`, `name`, `breweryName`, `style`, `abv`, `rating`, `ratingCount`, `imageUrl`, `onPress`

### BeerList
FlatList wrapper for beer cards with loading and empty states.
```tsx
<BeerList
  data={beers}
  loading={isLoading}
  onBeerPress={(beer) => navigateToBeer(beer.id)}
  emptyTitle="No beers found"
  emptySubtitle="Try adjusting your search"
/>
```
- **Props:** `data`, `loading`, `onBeerPress`, `onEmptyAction`, `emptyTitle`, `emptySubtitle`, `emptyActionLabel`

### TastingForm
Comprehensive form for logging a beer tasting with ratings, flavors, and notes.
```tsx
<TastingForm
  onSubmit={(data) => saveTastingNote(data)}
/>
```
- **Features:**
  - Beer search/select input
  - Interactive 5-star overall rating
  - Serving type selector (draft, bottle, can, cask)
  - Attribute sliders (aroma, appearance, taste, mouthfeel) 1-5
  - Multi-select flavor note chips
  - Text area for detailed notes
  - Photo upload button
- **Props:** `onSubmit`, `style`
- **Data Structure:** `{ beerId, overallRating, aroma, appearance, taste, mouthfeel, flavorNotes, servingType, notes, photoUrl }`

### FlavorTag
Selectable chip for flavor notes with toggle state.
```tsx
<FlavorTag
  label="Hoppy"
  selected={selected}
  onPress={() => toggleFlavor('Hoppy')}
/>
```
- **Props:** `label`, `selected`, `onPress`, `style`

### StyleFilter
Horizontal scrollable beer style pills for filtering.
```tsx
<StyleFilter
  styles={['IPA', 'Lager', 'Stout', 'Porter']}
  selectedStyle={style}
  onStyleSelect={setStyle}
/>
```
- **Props:** `styles`, `selectedStyle`, `onStyleSelect`, `contentContainerStyle`

## Layout Components (`src/components/layout/`)

### ScreenHeader
Top header with title, optional back button, and right action.
```tsx
<ScreenHeader
  title="Beer Details"
  onBackPress={() => navigation.goBack()}
  subtitle="Check this out"
/>
```
- **Props:** `title`, `onBackPress`, `rightAction`, `subtitle`, `style`

### TabBar
Bottom navigation with 5 tabs: Home, Discover, Log (+), Collection, Profile.
```tsx
<TabBar
  activeTab="home"
  onTabPress={(tab) => navigateTo(tab)}
/>
```
- **Tab Names:** `home`, `discover`, `log`, `collection`, `profile`
- **Features:**
  - Log tab is centered with raised design
  - Amber highlight for active tab
  - Icon and label display
- **Props:** `activeTab`, `onTabPress`, `style`

## Import Examples

```tsx
// Import from root
import { Button, Card, Input, Badge, Avatar } from '@/components'

// Import from sections
import { BeerCard, BeerList, TastingForm } from '@/components/beer'
import { TabBar, ScreenHeader } from '@/components/layout'
import { StarRating, Skeleton, EmptyState } from '@/components/ui'

// Import with types
import { TastingForm, type TastingFormData } from '@/components/beer'
import { TabBar, type TabName } from '@/components/layout'
```

## Design System Integration

All components automatically use the dark theme with these resources:
- **Colors:** Imported from `src/theme/colors.ts`
- **Typography:** Imported from `src/theme/typography.ts`
- **Fonts:** DM Sans (default), JetBrains Mono (mono)
- **Icons:** lucide-react-native

## Typography Sizes
- `xs`: 12px
- `sm`: 14px
- `base`: 16px
- `lg`: 18px
- `xl`: 20px
- `2xl`: 24px
- `3xl`: 30px
- `4xl`: 36px

## Font Weights
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700

## Production Ready
All components are:
- Fully typed with TypeScript
- Dark mode optimized (default)
- Accessible with proper touch targets
- Using React Native StyleSheet for performance
- Responsive to different screen sizes
- Production-tested patterns
