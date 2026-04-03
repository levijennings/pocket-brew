import React, { ReactNode } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
} from 'react-native'
import { ChevronLeft } from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

interface ScreenHeaderProps {
  title: string
  onBackPress?: () => void
  rightAction?: ReactNode
  subtitle?: string
  style?: ViewStyle
}

export function ScreenHeader({
  title,
  onBackPress,
  rightAction,
  subtitle,
  style,
}: ScreenHeaderProps) {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>

        {rightAction && <View style={styles.rightSection}>{rightAction}</View>}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.dark.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.dark.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.dark.textMuted,
    marginTop: 2,
    fontFamily: typography.fontFamily.sans,
  },
  rightSection: {
    paddingLeft: 12,
  },
})
