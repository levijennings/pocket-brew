import React from 'react'
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  source?: { uri: string }
  initials?: string
  size?: AvatarSize
  style?: ViewStyle
}

const sizeDimensions: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
}

const fontSizes: Record<AvatarSize, number> = {
  sm: 12,
  md: 16,
  lg: 24,
}

export function Avatar({ source, initials, size = 'md', style }: AvatarProps) {
  const dimension = sizeDimensions[size]
  const fontSize = fontSizes[size]

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          }}
        />
      ) : initials ? (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize,
            },
          ]}
        >
          {initials}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: colors.dark.text,
    fontWeight: typography.fontWeight.semibold as any,
    fontFamily: typography.fontFamily.sans,
  },
})
