import React, { ReactNode } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'

interface CardProps {
  children: ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
})
