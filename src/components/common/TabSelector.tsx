import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

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
              activeOpacity={0.7}
              onPress={() => onSelect(opt.id)}
              style={[
                styles.tab,
                isSelected ? styles.tabSelected : styles.tabUnselected,
              ]}
            >
              <Text
                style={[
                  Typography.monoSm,
                  styles.tabText,
                  isSelected ? styles.textSelected : styles.textUnselected,
                ]}
              >
                {opt.label}
              </Text>
              {opt.badge && (
                <View
                  style={[
                    styles.badge,
                    isSelected ? styles.badgeSelected : styles.badgeUnselected,
                  ]}
                >
                  <Text
                    style={[
                      Typography.monoSm,
                      styles.badgeText,
                      isSelected ? styles.badgeTextSelected : null,
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
    marginBottom: 14,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 3,
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 2,
  },
  tabSelected: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  tabUnselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontWeight: '600',
    fontSize: 12,
  },
  textSelected: {
    color: Colors.accentCyan,
  },
  textUnselected: {
    color: Colors.textSecondary,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeSelected: {
    backgroundColor: '#0284C740',
  },
  badgeUnselected: {
    backgroundColor: Colors.surfaceLight,
  },
  badgeText: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  badgeTextSelected: {
    color: Colors.accentCyan,
  },
});
