import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { StarRating } from '../ui/StarRating'

interface BeerCardProps {
  id: string
  name: string
  breweryName: string
  style: string
  abv: number
  rating: number
  ratingCount: number
  imageUrl?: string
  onPress?: () => void
  style?: ViewStyle
}

export function BeerCard({
  id,
  name,
  breweryName,
  style,
  abv,
  rating,
  ratingCount,
  imageUrl,
  onPress,
  style: customStyle,
}: BeerCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={customStyle}
    >
      <Card>
        <View style={styles.container}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          )}
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.name} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={styles.brewery} numberOfLines={1}>
                  {breweryName}
                </Text>
              </View>
              <Badge label={style} variant="style" />
            </View>

            <View style={styles.stats}>
              <View style={styles.abvContainer}>
                <Text style={styles.abvLabel}>ABV</Text>
                <Text style={styles.abvValue}>{abv.toFixed(1)}%</Text>
              </View>

              <View style={styles.ratingContainer}>
                <StarRating rating={Math.round(rating)} size={16} />
                <Text style={styles.ratingCount}>
                  ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.dark.border,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    gap: 8,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
  },
  brewery: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.textMuted,
    marginTop: 2,
    fontFamily: typography.fontFamily.sans,
  },
  stats: {
    gap: 8,
  },
  abvContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  abvLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.dark.textMuted,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.sans,
  },
  abvValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.brand[500],
    fontFamily: typography.fontFamily.sans,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingCount: {
    fontSize: typography.fontSize.xs,
    color: colors.dark.textMuted,
    fontFamily: typography.fontFamily.sans,
  },
})
