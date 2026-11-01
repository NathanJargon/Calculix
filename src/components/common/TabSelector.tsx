import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface TabOption<T extends string> {
  id: T;
  label: string;
  badge?: string;
}

interface TabSelectorProps<T extends string> {
  options: TabOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  style?: ViewStyle;
}

export function TabSelector<T extends string>({
  options,
  selectedId,
  onSelect,
  style,
}: TabSelectorProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {options.map((opt) => {
          const isSelected = opt.id === selectedId;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.75}
              onPress={() => onSelect(opt.id)}
              style={[
                styles.tab,
                isSelected
                  ? [styles.tabSelected, { backgroundColor: colors.primary, borderColor: colors.primary }]
                  : [styles.tabUnselected, { backgroundColor: colors.surface, borderColor: colors.border }],
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isSelected ? styles.tabLabelSelected : { color: colors.textSecondary },
                ]}
              >
                {opt.label}
              </Text>

              {opt.badge && (
                <View
                  style={[
                    styles.badge,
                    isSelected
                      ? styles.badgeSelected
                      : [styles.badgeUnselected, { backgroundColor: colors.surfaceSecondary }],
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      isSelected
                        ? styles.badgeTextSelected
                        : { color: colors.textMuted },
                    ]}
                  >
                    {opt.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  tabSelected: {
    shadowColor: '#FF2E93',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tabUnselected: {},
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabLabelSelected: {
    color: '#FFFFFF',
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeUnselected: {},
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextSelected: {
    color: '#FFFFFF',
  },
});
