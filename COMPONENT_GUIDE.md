# Pocket Brew Component Library - Quick Reference Guide

## File Structure
```
src/components/
├── ui/                    # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── StarRating.tsx
│   ├── Skeleton.tsx
│   ├── EmptyState.tsx
│   ├── Toast.tsx
│   └── index.ts
├── beer/                  # Beer-specific components
│   ├── BeerCard.tsx
│   ├── BeerList.tsx
│   ├── TastingForm.tsx
│   ├── FlavorTag.tsx
│   ├── StyleFilter.tsx
│   └── index.ts
├── layout/                # Layout components
│   ├── TabBar.tsx
│   ├── ScreenHeader.tsx
│   └── index.ts
└── index.ts              # Root exports
```

## Component Count: 14 Production Components

### UI Components (8)
1. **Button** - Primary interaction element
2. **Card** - Content container
3. **Input** - Text input field
4. **Badge** - Small category/status label
5. **Avatar** - User/profile image
6. **StarRating** - 5-star rating display/input
7. **Skeleton** - Loading placeholder
8. **EmptyState** - No results state
9. **Toast** - Notification popup

### Beer Components (5)
1. **BeerCard** - Beer preview card
2. **BeerList** - Scrollable beer list
3. **TastingForm** - Complete logging form
4. **FlavorTag** - Flavor note selector
5. **StyleFilter** - Beer style filter bar

### Layout Components (2)
1. **TabBar** - Bottom navigation
2. **ScreenHeader** - Top header bar

## Color System

### Brand Colors
- **Primary:** #D97706 (Craft Amber)
- **Dark Variants:** #B45309, #92400E, #78350F, #451A03
- **Light Variants:** #FCD34D, #FBBF24, #FDE68A, #FEF3C7

### Dark Mode Palette (Default)
- **Background:** #0F0F14
- **Surface:** #1A1A23
- **Surface Hover:** #252530
- **Border:** #2A2A35
- **Text:** #E2E8F0
- **Text Muted:** #94A3B8
- **Text Dim:** #64748B

### Semantic Colors
- **Success:** #16A34A (Green)
- **Warning:** #D97706 (Amber - same as brand)
- **Error:** #DC2626 (Red)
- **Info:** #2563EB (Blue)

## Typography System

### Font Families
- **Default:** DM Sans (sans-serif)
- **Monospace:** JetBrains Mono

### Font Sizes
- `xs`: 12px - Small labels
- `sm`: 14px - Secondary text
- `base`: 16px - Body text
- `lg`: 18px - Subheadings
- `xl`: 20px - Section headers
- `2xl`: 24px - Page titles
- `3xl`: 30px - Large titles
- `4xl`: 36px - Hero text

### Font Weights
- `normal`: 400
- `medium`: 500 - Labels, accents
- `semibold`: 600 - Emphasized text
- `bold`: 700 - Headings

## Common Usage Patterns

### Dark Mode Implementation
All components use dark theme by default. No conditional styling needed:
```tsx
// Automatic dark mode - no light mode variant
<Button title="Save" onPress={handleSave} />
```

### Icon Integration
All icons from lucide-react-native with brand colors:
```tsx
<Star size={20} color={colors.brand[500]} fill={colors.brand[500]} />
```

### Responsive Spacing
- **Content padding:** 16px
- **Section gaps:** 12-16px
- **Card padding:** 16px
- **Border radius:** 8-16px

### Touch Targets
All interactive elements maintain 44px minimum height/width:
```tsx
- Button: 44px minimum height
- TabBar items: 44px+ touch area
- Card pressable: 44px minimum
```

## Form Pattern Example

```tsx
export interface FormData {
  field1: string
  field2: number
  field3: string[]
}

function MyForm() {
  const [data, setData] = useState<FormData>({
    field1: '',
    field2: 3,
    field3: [],
  })

  const handleSubmit = () => {
    // Validate and submit
  }

  return (
    <ScrollView>
      <Card>
        <Input
          label="Field 1"
          value={data.field1}
          onChangeText={(text) =>
            setData({ ...data, field1: text })
          }
        />

        <StarRating
          rating={data.field2}
          interactive
          onRatingChange={(rating) =>
            setData({ ...data, field2: rating })
          }
        />

        <Button
          title="Submit"
          onPress={handleSubmit}
        />
      </Card>
    </ScrollView>
  )
}
```

## List Pattern Example

```tsx
function MyList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  return (
    <BeerList
      data={data}
      loading={loading}
      onBeerPress={(beer) => {
        // Navigate or show details
      }}
      emptyTitle="No items yet"
      emptySubtitle="Add one to get started"
    />
  )
}
```

## Navigation Pattern Example

```tsx
function NavigationStack() {
  const [activeTab, setActiveTab] = useState<TabName>('home')

  return (
    <>
      <ScreenHeader
        title="Home"
        rightAction={<Icon />}
      />

      {/* Screen content */}

      <TabBar
        activeTab={activeTab}
        onTabPress={(tab) => {
          setActiveTab(tab)
          navigateToTab(tab)
        }}
      />
    </>
  )
}
```

## Notification Pattern Example

```tsx
function MyScreen() {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    variant: 'info' as const,
  })

  const showToast = (message: string, variant: 'success' | 'error' | 'info') => {
    setToast({ visible: true, message, variant })
  }

  return (
    <>
      <Toast
        message={toast.message}
        variant={toast.variant}
        visible={toast.visible}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />

      <Button
        title="Save"
        onPress={() => {
          // Action
          showToast('Saved!', 'success')
        }}
      />
    </>
  )
}
```

## Loading State Pattern

```tsx
function MyList() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      // Fetch data
      setData(results)
      setLoading(false)
    }
    load()
  }, [])

  return <BeerList data={data} loading={loading} />
}
```

## TypeScript Types Reference

### Input Types
```tsx
import { Input } from '@/components'
// Props: label, placeholder, value, onChangeText, variant, error, editable
```

### Badge Types
```tsx
type BadgeVariant = 'default' | 'style' | 'rating'
// Props: label, variant, score
```

### StarRating Types
```tsx
// Props: rating, size, interactive, onRatingChange
```

### TastingForm Data
```tsx
interface TastingFormData {
  beerId: string
  overallRating: number        // 0-5
  aroma: number                // 1-5
  appearance: number           // 1-5
  taste: number                // 1-5
  mouthfeel: number            // 1-5
  flavorNotes: string[]        // Multi-select
  servingType: 'draft' | 'bottle' | 'can' | 'cask'
  notes: string                // Free-form text
  photoUrl?: string            // Optional photo
}
```

### TabBar Types
```tsx
type TabName = 'home' | 'discover' | 'log' | 'collection' | 'profile'
// Props: activeTab, onTabPress
```

## Performance Optimization

### Memoization
For frequently re-rendering lists:
```tsx
const MemoizedBeerCard = React.memo(BeerCard)
```

### FlatList for BeerList
Already optimized with FlatList internally for large lists.

### Skeleton Loading
Use Skeleton components to show placeholders during data loading.

### Animations
- Toast: Slide in/out animation
- Skeleton: Pulse animation
- Star Rating: No unnecessary re-renders

## Testing Considerations

### Unit Testing
Each component is independently testable:
```tsx
describe('Button', () => {
  it('calls onPress when pressed', () => {
    // Test implementation
  })
})
```

### Component Props
All props are fully typed with TypeScript for type safety.

### Accessibility
- Touch targets: 44x44px minimum
- Color contrast: Meets WCAG AA standards
- Icons: Labeled with aria-label equivalent

## Future Extensions

Ready for:
- Custom theme provider (currently hardcoded dark)
- Animated transitions
- Gesture handlers
- Web responsive layouts
- RTL support (already styled for flexibility)

## Version: 1.0.0
**Status:** Production Ready
**Last Updated:** 2026-04-03
