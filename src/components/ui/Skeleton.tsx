import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ViewStyle, Animated } from 'react-native'
import { colors } from '../../theme/colors'

type SkeletonVariant = 'text' | 'circle' | 'card'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: number | string
  height?: number
  style?: ViewStyle
}

export function Skeleton({
  variant = 'text',
  width = '100%',
  height = 16,
  style,
}: SkeletonProps) {
  const [pulseValue] = useState(new Animated.Value(0.5))

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseValue, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [pulseValue])

  const opacity = pulseValue.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.5, 0.8],
  })

  const getSkeletonStyle = () => {
    switch (variant) {
      case 'circle':
        return {
          width: height,
          height,
          borderRadius: height / 2,
        }
      case 'card':
        return {
          width,
          height: 200,
          borderRadius: 16,
        }
      case 'text':
      default:
        return {
          width,
          height,
          borderRadius: 8,
        }
    }
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
        getSkeletonStyle(),
        { opacity },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.dark.surfaceHover,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
})
