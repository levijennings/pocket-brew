import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Star } from 'lucide-react-native'
import { colors } from '../../theme/colors'

interface StarRatingProps {
  rating: number
  size?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  style?: ViewStyle
}

export function StarRating({
  rating,
  size = 20,
  interactive = false,
  onRatingChange,
  style,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const displayRating = hoverRating ?? rating
  const stars = [1, 2, 3, 4, 5]

  const handlePress = (starValue: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue)
    }
  }

  const handleHoverIn = (starValue: number) => {
    if (interactive) {
      setHoverRating(starValue)
    }
  }

  const handleHoverOut = () => {
    if (interactive) {
      setHoverRating(null)
    }
  }

  return (
    <View style={[styles.container, style]}>
      {stars.map((starValue) => (
        <TouchableOpacity
          key={starValue}
          onPress={() => handlePress(starValue)}
          onPressIn={() => handleHoverIn(starValue)}
          onPressOut={handleHoverOut}
          disabled={!interactive}
          activeOpacity={interactive ? 0.7 : 1}
          style={styles.starButton}
        >
          <Star
            size={size}
            color={starValue <= displayRating ? colors.brand[500] : colors.dark.border}
            fill={starValue <= displayRating ? colors.brand[500] : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
})
