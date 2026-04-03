import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { colors } from '../../theme/colors'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  style?: ViewStyle
}

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled = false, style }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textVariantStyles[variant], textSizeStyles[size]]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
})

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.brand[500] },
  secondary: { backgroundColor: colors.dark.surface, borderWidth: 1, borderColor: colors.dark.border },
  ghost: { backgroundColor: 'transparent' },
}

const textVariantStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: '#FFFFFF' },
  secondary: { color: colors.dark.text },
  ghost: { color: colors.brand[500] },
}

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingHorizontal: 12, paddingVertical: 6 },
  md: { paddingHorizontal: 16, paddingVertical: 10 },
  lg: { paddingHorizontal: 24, paddingVertical: 14 },
}

const textSizeStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 16 },
}
