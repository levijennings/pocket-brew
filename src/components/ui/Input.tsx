import React, { useState } from 'react'
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { Search } from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

type InputVariant = 'default' | 'search'

interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  variant?: InputVariant
  error?: string
  editable?: boolean
  style?: ViewStyle
  placeholderTextColor?: string
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  error,
  editable = true,
  style,
  placeholderTextColor = colors.dark.textMuted,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
          variant === 'search' && styles.searchWrapper,
        ]}
      >
        {variant === 'search' && (
          <Search size={20} color={colors.dark.textMuted} style={styles.searchIcon} />
        )}
        <TextInput
          style={[
            styles.input,
            variant === 'search' && styles.searchInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          selectionColor={colors.brand[500]}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.dark.text,
    marginBottom: 8,
    fontFamily: typography.fontFamily.sans,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.brand[500],
    backgroundColor: colors.dark.surfaceHover,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  searchWrapper: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
    padding: 0,
  },
  searchInput: {
    marginLeft: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  error: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: 6,
    fontFamily: typography.fontFamily.sans,
  },
})
