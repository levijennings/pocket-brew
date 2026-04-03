import React, { ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AlertCircle } from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon || (
        <AlertCircle
          size={48}
          color={colors.dark.textMuted}
          style={styles.defaultIcon}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.button}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  defaultIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.dark.textMuted,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: typography.fontFamily.sans,
  },
  button: {
    minWidth: 120,
  },
})
