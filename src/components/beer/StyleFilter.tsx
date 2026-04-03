import React from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

interface StyleFilterProps {
  styles: string[]
  selectedStyle?: string
  onStyleSelect?: (style: string) => void
  contentContainerStyle?: ViewStyle
}

const BEER_STYLES = [
  'IPA',
  'Lager',
  'Stout',
  'Porter',
  'Pilsner',
  'Wheat',
  'Saison',
  'Sour',
  'Pale Ale',
  'Amber',
]

export function StyleFilter({
  styles = BEER_STYLES,
  selectedStyle,
  onStyleSelect,
  contentContainerStyle,
}: StyleFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContainer, contentContainerStyle]}
    >
      {styles.map((style) => (
        <TouchableOpacity
          key={style}
          onPress={() => onStyleSelect?.(style)}
          activeOpacity={0.7}
          style={[
            styles.pill,
            selectedStyle === style && styles.pillSelected,
          ]}
        >
          <Text
            style={[
              styles.pillText,
              selectedStyle === style && styles.pillTextSelected,
            ]}
          >
            {style}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  pillSelected: {
    backgroundColor: colors.brand[500],
    borderColor: colors.brand[500],
  },
  pillText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
})
