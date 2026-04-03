import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

interface FlavorTagProps {
  label: string
  selected?: boolean
  onPress?: () => void
  style?: ViewStyle
}

export function FlavorTag({
  label,
  selected = false,
  onPress,
  style,
}: FlavorTagProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.tag,
        selected && styles.tagSelected,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          selected && styles.textSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: colors.brand[500],
    borderColor: colors.brand[500],
  },
  text: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.text,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.sans,
  },
  textSelected: {
    color: '#FFFFFF',
  },
})
