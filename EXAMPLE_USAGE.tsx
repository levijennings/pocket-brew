/**
 * EXAMPLE USAGE - Pocket Brew Component Library
 *
 * This file demonstrates common patterns for using all components
 * in the Pocket Brew component library. Use these examples as
 * reference when building new screens.
 */

import React, { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native'

// Import components
import {
  Button,
  Card,
  Input,
  Badge,
  Avatar,
  StarRating,
  Skeleton,
  EmptyState,
  Toast,
  BeerCard,
  BeerList,
  TastingForm,
  FlavorTag,
  StyleFilter,
  TabBar,
  ScreenHeader,
} from './src/components'

import { colors } from './src/theme/colors'
import type { Beer, TastingNote } from './src/types'
import type { TabName, TastingFormData } from './src/components'

// ============================================================================
// EXAMPLE 1: Home Screen with Header and Tab Bar
// ============================================================================

export function HomeScreenExample() {
  const [activeTab, setActiveTab] = useState<TabName>('home')

  return (
    <View style={styles.screen}>
      {/* Header */}
      <ScreenHeader
        title="Welcome Back"
        subtitle="Continue exploring"
        rightAction={<Avatar initials="JD" size="sm" />}
      />

      {/* Content */}
      <ScrollView style={styles.content}>
        <Button
          title="Explore Beers"
          onPress={() => setActiveTab('discover')}
        />
      </ScrollView>

      {/* Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
      />
    </View>
  )
}

// ============================================================================
// EXAMPLE 2: Beer Search and Filter Screen
// ============================================================================

export function BeerSearchScreenExample() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string>()
  const [beers, setBeers] = useState<Beer[]>([])

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Discover Beers" />

      <ScrollView style={styles.content}>
        {/* Search Input */}
        <Card style={styles.card}>
          <Input
            label="Search"
            placeholder="Find a beer..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            variant="search"
          />
        </Card>

        {/* Style Filter */}
        <StyleFilter
          selectedStyle={selectedStyle}
          onStyleSelect={setSelectedStyle}
        />

        {/* Beer List */}
        <BeerList
          data={beers}
          onBeerPress={(beer) => {
            // Navigate to beer detail
          }}
        />
      </ScrollView>
    </View>
  )
}

// ============================================================================
// EXAMPLE 3: Beer Detail Screen with Ratings
// ============================================================================

interface BeerDetailScreenProps {
  beer: Beer
}

export function BeerDetailScreenExample({ beer }: BeerDetailScreenProps) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title={beer.name} onBackPress={() => {}} />

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          {/* Beer Header */}
          <View style={styles.beerHeader}>
            <View style={styles.beerInfo}>
              <Badge label={beer.style} variant="style" />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Input
                label="ABV"
                value={`${beer.abv}%`}
                onChangeText={() => {}}
                editable={false}
              />
            </View>
            <View style={styles.statItem}>
              <Badge
                label={`${beer.avg_rating.toFixed(1)}`}
                variant="rating"
                score={beer.avg_rating}
              />
            </View>
          </View>

          {/* Rating Display */}
          <View style={styles.ratingSection}>
            <StarRating rating={Math.round(beer.avg_rating)} size={24} />
            <Badge
              label={`${beer.rating_count} reviews`}
              variant="default"
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  )
}

// ============================================================================
// EXAMPLE 4: Tasting Log Form Screen
// ============================================================================

export function TastingLogScreenExample() {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    variant: 'info' as const,
  })

  const handleSubmit = (data: TastingFormData) => {
    // Validate data
    if (!data.beerId || data.overallRating === 0) {
      setToast({
        visible: true,
        message: 'Please select a beer and rate it',
        variant: 'error',
      })
      return
    }

    // Save to database
    console.log('Saving tasting note:', data)

    // Show success message
    setToast({
      visible: true,
      message: 'Tasting note saved!',
      variant: 'success',
    })

    // Reset form after delay
    setTimeout(() => {
      setToast({ ...toast, visible: false })
    }, 2000)
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Log Tasting" />

      <TastingForm onSubmit={handleSubmit} />

      <Toast
        message={toast.message}
        variant={toast.variant}
        visible={toast.visible}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </View>
  )
}

// ============================================================================
// EXAMPLE 5: User Collection Screen with Loading
// ============================================================================

export function CollectionScreenExample() {
  const [loading, setLoading] = useState(true)
  const [beers, setBeers] = useState<Beer[]>([])

  React.useEffect(() => {
    const fetchBeers = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setBeers([])
      setLoading(false)
    }

    fetchBeers()
  }, [])

  return (
    <View style={styles.screen}>
      <ScreenHeader title="My Collection" />

      <ScrollView style={styles.content}>
        {loading ? (
          // Loading Skeletons
          <View style={styles.skeletonContainer}>
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </View>
        ) : beers.length === 0 ? (
          // Empty State
          <EmptyState
            title="No beers yet"
            subtitle="Start logging beers to build your collection"
            actionLabel="Log First Beer"
            onAction={() => {
              // Navigate to log screen
            }}
          />
        ) : (
          // Beer List
          <BeerList
            data={beers}
            onBeerPress={(beer) => {
              // Navigate to beer detail
            }}
          />
        )}
      </ScrollView>
    </View>
  )
}

// ============================================================================
// EXAMPLE 6: Profile Screen with Avatar
// ============================================================================

export function ProfileScreenExample() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: { uri: 'https://via.placeholder.com/150' },
  }

  const [editMode, setEditMode] = useState(false)
  const [displayName, setDisplayName] = useState(user.name)

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Profile" />

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <Avatar source={user.avatar} size="lg" />
          </View>

          {/* User Info */}
          <Input
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            editable={editMode}
          />

          <Input
            label="Email"
            value={user.email}
            onChangeText={() => {}}
            editable={false}
          />

          {/* Action Button */}
          <Button
            title={editMode ? 'Save Changes' : 'Edit Profile'}
            onPress={() => setEditMode(!editMode)}
            variant={editMode ? 'primary' : 'secondary'}
            style={styles.button}
          />
        </Card>
      </ScrollView>
    </View>
  )
}

// ============================================================================
// EXAMPLE 7: Rating Input Component
// ============================================================================

export function RatingInputExample() {
  const [rating, setRating] = useState(0)

  return (
    <Card style={styles.card}>
      <Input
        label="Rate this beer"
        value={`${rating}/5 stars`}
        onChangeText={() => {}}
        editable={false}
      />

      <StarRating
        rating={rating}
        interactive
        onRatingChange={setRating}
        size={32}
      />

      {rating > 0 && (
        <Badge
          label={`Rated ${rating} stars`}
          variant="default"
        />
      )}
    </Card>
  )
}

// ============================================================================
// EXAMPLE 8: Flavor Tag Selection
// ============================================================================

export function FlavorSelectionExample() {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])

  const flavorOptions = [
    'Hoppy',
    'Citrus',
    'Malty',
    'Fruity',
    'Roasty',
    'Spicy',
  ]

  return (
    <Card style={styles.card}>
      <Input
        label="Selected Flavors"
        value={selectedFlavors.join(', ')}
        onChangeText={() => {}}
        editable={false}
      />

      <View style={styles.flavorContainer}>
        {flavorOptions.map((flavor) => (
          <FlavorTag
            key={flavor}
            label={flavor}
            selected={selectedFlavors.includes(flavor)}
            onPress={() => {
              setSelectedFlavors((prev) =>
                prev.includes(flavor)
                  ? prev.filter((f) => f !== flavor)
                  : [...prev, flavor]
              )
            }}
          />
        ))}
      </View>

      {selectedFlavors.length > 0 && (
        <Badge
          label={`${selectedFlavors.length} flavors selected`}
          variant="default"
          style={styles.selectionBadge}
        />
      )}
    </Card>
  )
}

// ============================================================================
// EXAMPLE 9: Notification System
// ============================================================================

export function NotificationExample() {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    variant: 'info' as const,
  })

  const showNotification = (
    message: string,
    variant: 'success' | 'error' | 'info'
  ) => {
    setToast({ visible: true, message, variant })
    setTimeout(() => {
      setToast({ ...toast, visible: false })
    }, 3000)
  }

  return (
    <View>
      <Card style={styles.card}>
        <Button
          title="Show Success"
          onPress={() => showNotification('Operation successful!', 'success')}
          style={styles.button}
        />

        <Button
          title="Show Error"
          onPress={() => showNotification('Something went wrong!', 'error')}
          variant="secondary"
          style={styles.button}
        />

        <Button
          title="Show Info"
          onPress={() => showNotification('Here is some information', 'info')}
          variant="ghost"
          style={styles.button}
        />
      </Card>

      <Toast
        message={toast.message}
        variant={toast.variant}
        visible={toast.visible}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginTop: 12,
  },
  beerHeader: {
    marginBottom: 16,
  },
  beerInfo: {
    gap: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  ratingSection: {
    gap: 12,
    marginTop: 12,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  flavorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  selectionBadge: {
    marginTop: 12,
  },
  skeletonContainer: {
    gap: 12,
  },
})

// ============================================================================
// Export example screens
// ============================================================================

export const ExampleScreens = {
  HomeScreen: HomeScreenExample,
  BeerSearchScreen: BeerSearchScreenExample,
  BeerDetailScreen: BeerDetailScreenExample,
  TastingLogScreen: TastingLogScreenExample,
  CollectionScreen: CollectionScreenExample,
  ProfileScreen: ProfileScreenExample,
  RatingInput: RatingInputExample,
  FlavorSelection: FlavorSelectionExample,
  Notification: NotificationExample,
}
