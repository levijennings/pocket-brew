import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
} from 'react-native'
import {
  Home,
  Compass,
  Plus,
  BookOpen,
  User,
} from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'

export type TabName = 'home' | 'discover' | 'log' | 'collection' | 'profile'

interface TabBarProps {
  activeTab: TabName
  onTabPress: (tab: TabName) => void
  style?: ViewStyle
}

interface TabItem {
  name: TabName
  label: string
  icon: React.ReactNode
}

const tabs: TabItem[] = [
  {
    name: 'home',
    label: 'Home',
    icon: <Home size={24} />,
  },
  {
    name: 'discover',
    label: 'Discover',
    icon: <Compass size={24} />,
  },
  {
    name: 'log',
    label: 'Log',
    icon: <Plus size={28} />,
  },
  {
    name: 'collection',
    label: 'Collection',
    icon: <BookOpen size={24} />,
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: <User size={24} />,
  },
]

export function TabBar({ activeTab, onTabPress, style }: TabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={[styles.safeArea, style]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name
          const isLogTab = tab.name === 'log'

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                isLogTab && styles.logTabItem,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && !isLogTab && styles.iconContainerActive,
                  isLogTab && styles.logIconContainer,
                  isLogTab && isActive && styles.logIconContainerActive,
                ]}
              >
                {React.cloneElement(tab.icon as React.ReactElement, {
                  color: isActive
                    ? colors.brand[500]
                    : colors.dark.textMuted,
                  fill: isActive ? colors.brand[500] : 'none',
                })}
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.dark.bg,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  logTabItem: {
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.brand[500],
    backgroundColor: 'transparent',
  },
  logIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand[500],
  },
  logIconContainerActive: {
    backgroundColor: colors.brand[600],
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.dark.textMuted,
    fontFamily: typography.fontFamily.sans,
  },
  labelActive: {
    color: colors.brand[500],
    fontWeight: typography.fontWeight.semibold as any,
  },
})
