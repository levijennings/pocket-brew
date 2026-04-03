import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

type BadgeVariant = 'default' | 'style' | 'rating'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  score?: number
  style?: ViewStyle
}

export function Badge({ label, variant = 'default', score, style }: BadgeProps) {
  const backgroundColor = getBadgeColor(variant, score)
  const textColor = getTextColor(variant, score)

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  )
}

function getBadgeColor(variant: BadgeVariant, score?: number): string {
  if (variant === 'default') {
    return colors.brand[500]
  }

  if (variant === 'style') {
    return colors.brand[600]
  }

  if (variant === 'rating' && score !== undefined) {
    if (score >= 4.5) return colors.success
    if (score >= 3.5) return colors.brand[500]
    if (score >= 2.5) return colors.warning
    return colors.error
  }

  return colors.brand[500]
}

function getTextColor(variant: BadgeVariant, score?: number): string {
  if (variant === 'rating' && score !== undefined) {
    if (score >= 2.5) return '#FFFFFF'
    return '#FFFFFF'
  }
  return '#FFFFFF'
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold as any,
    fontFamily: typography.fontFamily.sans,
  },
})
