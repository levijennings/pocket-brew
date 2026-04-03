import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native'
import { CheckCircle, AlertCircle, Info } from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  visible: boolean
  onDismiss?: () => void
}

export function Toast({
  message,
  variant = 'info',
  duration = 3000,
  visible,
  onDismiss,
}: ToastProps) {
  const [slideAnim] = useState(new Animated.Value(-100))

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onDismiss?.()
        })
      }, duration)

      return () => clearTimeout(timer)
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 0,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, duration, slideAnim, onDismiss])

  if (!visible) return null

  const backgroundColor = getToastColor(variant)
  const icon = getToastIcon(variant)

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor },
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  )
}

function getToastColor(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return colors.success
    case 'error':
      return colors.error
    case 'info':
    default:
      return colors.info
  }
}

function getToastIcon(variant: ToastVariant) {
  const iconProps = { size: 20, color: '#FFFFFF' }

  switch (variant) {
    case 'success':
      return <CheckCircle {...iconProps} />
    case 'error':
      return <AlertCircle {...iconProps} />
    case 'info':
    default:
      return <Info {...iconProps} />
  }
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    marginRight: 4,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.sans,
  },
})
