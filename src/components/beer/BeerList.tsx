import React from 'react'
import {
  FlatList,
  View,
  StyleSheet,
  FlatListProps,
  ListRenderItem,
  ViewStyle,
} from 'react-native'
import { Beer } from '../../types'
import { BeerCard } from './BeerCard'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'
import { colors } from '../../theme/colors'

interface BeerListProps {
  data: Beer[]
  loading?: boolean
  onBeerPress?: (beer: Beer) => void
  onEmptyAction?: () => void
  emptyTitle?: string
  emptySubtitle?: string
  emptyActionLabel?: string
  contentContainerStyle?: ViewStyle
}

export function BeerList({
  data,
  loading = false,
  onBeerPress,
  onEmptyAction,
  emptyTitle = 'No beers found',
  emptySubtitle = 'Try adjusting your filters or search terms',
  emptyActionLabel,
  contentContainerStyle,
}: BeerListProps) {
  const renderBeerCard: ListRenderItem<Beer> = ({ item }) => (
    <BeerCard
      id={item.id}
      name={item.name}
      breweryName={item.brewery_id} // In a real app, fetch brewery name from brewery_id
      style={item.style}
      abv={item.abv}
      rating={item.avg_rating}
      ratingCount={item.rating_count}
      imageUrl={item.image_url}
      onPress={() => onBeerPress?.(item)}
      style={styles.cardContainer}
    />
  )

  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.skeletonCard}>
          <View style={styles.skeletonContent}>
            <Skeleton variant="circle" height={80} style={styles.skeletonImage} />
            <View style={styles.skeletonText}>
              <Skeleton width="70%" height={16} style={styles.skeletonLine} />
              <Skeleton width="50%" height={14} style={styles.skeletonLine} />
              <Skeleton width="60%" height={12} style={styles.skeletonLine} />
            </View>
          </View>
        </View>
      ))}
    </View>
  )

  if (loading) {
    return renderLoadingSkeleton()
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        subtitle={emptySubtitle}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderBeerCard}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={[styles.listContainer, contentContainerStyle]}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  cardContainer: {
    marginHorizontal: 0,
    marginVertical: 8,
  },
  separator: {
    height: 8,
  },
  skeletonContainer: {
    paddingVertical: 8,
    gap: 8,
  },
  skeletonCard: {
    marginHorizontal: 0,
    marginVertical: 8,
  },
  skeletonContent: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  skeletonImage: {
    width: 80,
    height: 120,
  },
  skeletonText: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    marginVertical: 4,
  },
})
