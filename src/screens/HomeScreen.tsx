import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RootMethodType } from '../types/rootFinding';
import { InterpolationMethodType } from '../types/interpolation';

const { width } = Dimensions.get('window');
const TILE_WIDTH = (width - 48 - 14) / 2; // 24px side padding, 14px gap

export type SolverId = RootMethodType | InterpolationMethodType;
export type CategoryFilter = 'all' | 'root' | 'interpolation';

export interface MethodThemeItem {
  id: SolverId;
  category: 'root' | 'interpolation';
  title: string;
  subtitle: string;
  badge: string;
  symbol: string;
  bgColor: string;
  darkBgColor: string;
  accentColor: string;
}

export const METHOD_THEMES: MethodThemeItem[] = [
  {
    id: 'bisection',
    category: 'root',
    title: 'Bisection',
    subtitle: 'Interval halving',
    badge: 'Safe & Steady',
    symbol: '[ a · b ]',
    bgColor: '#E6FCFC',
    darkBgColor: '#0E282A',
    accentColor: '#00D2D3',
  },
  {
    id: 'newton',
    category: 'root',
    title: 'Newton',
    subtitle: 'Tangent slope',
    badge: 'Super Fast',
    symbol: "f'(x) ⚡",
    bgColor: '#FFF0F7',
    darkBgColor: '#2D1122',
    accentColor: '#FF2E93',
  },
  {
    id: 'secant',
    category: 'root',
    title: 'Secant',
    subtitle: 'Secant slope',
    badge: 'No Derivative',
    symbol: 'x₀ → x₁',
    bgColor: '#F5EEFD',
    darkBgColor: '#241437',
    accentColor: '#A855F7',
  },
  {
    id: 'fixed-point',
    category: 'root',
    title: 'Fixed-Point',
    subtitle: 'x = g(x)',
    badge: 'Iterative Step',
    symbol: 'g(x) ⟳',
    bgColor: '#ECFDF5',
    darkBgColor: '#0C261E',
    accentColor: '#10B981',
  },
  {
    id: 'newton-divided',
    category: 'interpolation',
    title: 'Divided Diff',
    subtitle: 'Pyramid table',
    badge: 'Step Table',
    symbol: 'Δy / Δx',
    bgColor: '#F0F9FF',
    darkBgColor: '#0E2436',
    accentColor: '#0284C7',
  },
  {
    id: 'lagrange',
    category: 'interpolation',
    title: 'Lagrange',
    subtitle: 'Basis curves',
    badge: 'Weighted Fit',
    symbol: '∑ yᵢ · Lᵢ',
    bgColor: '#FFFBEB',
    darkBgColor: '#2B210B',
    accentColor: '#F59E0B',
  },
];

interface HomeScreenProps {
  onSelectMethod: (id: SolverId) => void;
  onOpenMenu: () => void;
  onOpenGuide: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMethod,
  onOpenMenu,
  onOpenGuide,
}) => {
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThemes = METHOD_THEMES.filter((item) => {
    const matchesCategory =
      filter === 'all' ? true : item.category === filter;
    const matchesSearch =
      searchQuery.trim().length === 0
        ? true
        : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Greeting Row */}
      <View style={styles.topGreetingRow}>
        <View style={styles.greetingTextGroup}>
          <Text style={[styles.greetingTitle, { color: colors.textPrimary }]}>
            Calculix
          </Text>
          <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>
            Choose a numerical method to solve
          </Text>
        </View>

        {/* Action icons like bell / search in mockup */}
        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onOpenGuide}
            activeOpacity={0.7}
          >
            <Text style={[styles.circleBtnIcon, { color: colors.primary }]}>?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onOpenMenu}
            activeOpacity={0.7}
          >
            <View style={styles.hamburger}>
              <View style={[styles.hamLine, { backgroundColor: colors.textPrimary }]} />
              <View style={[styles.hamLine, styles.hamLineShort, { backgroundColor: colors.textPrimary }]} />
              <View style={[styles.hamLine, { backgroundColor: colors.textPrimary }]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.searchIcon, { color: colors.textMuted }]}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search bisection, newton, lagrange..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <Text style={[styles.clearSearch, { color: colors.textMuted }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pill Filter Tabs (Top, Math, Algebra style in mockup) */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {[
            { id: 'all', label: 'All Methods' },
            { id: 'root', label: 'Root Finding' },
            { id: 'interpolation', label: 'Interpolation' },
          ].map((pill) => {
            const isSelected = filter === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                onPress={() => setFilter(pill.id as CategoryFilter)}
                activeOpacity={0.75}
                style={[
                  styles.filterPill,
                  isSelected
                    ? [styles.filterPillActive, { backgroundColor: colors.primary, borderColor: colors.primary }]
                    : [styles.filterPillInactive, { backgroundColor: colors.surface, borderColor: colors.border }],
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected ? styles.filterPillTextActive : { color: colors.textSecondary },
                  ]}
                >
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Themes Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Themes & Solvers</Text>
        <Text style={[styles.sectionCount, { color: colors.primary }]}>
          {filteredThemes.length} available
        </Text>
      </View>

      {/* 2x2 Grid of Theme Cards */}
      <View style={styles.gridContainer}>
        {filteredThemes.map((item) => {
          const cardBg = isDark ? item.darkBgColor : item.bgColor;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.themeTile,
                {
                  backgroundColor: cardBg,
                  borderColor: isDark ? colors.border : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
              onPress={() => onSelectMethod(item.id)}
              activeOpacity={0.82}
            >
              {/* Top Row with Symbol & Badge */}
              <View style={styles.tileHeader}>
                <View style={[styles.symbolPill, { backgroundColor: item.accentColor + '20' }]}>
                  <Text style={[styles.symbolText, { color: item.accentColor }]}>{item.symbol}</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: item.accentColor }]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              </View>

              {/* Title & Subtitle */}
              <View style={styles.tileFooter}>
                <Text style={[styles.tileTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.tileSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>

              {/* Arrow Indicator on card */}
              <View style={[styles.arrowCircle, { backgroundColor: item.accentColor + '18' }]}>
                <Text style={[styles.arrowText, { color: item.accentColor }]}>→</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  topGreetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTextGroup: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  circleBtnIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  hamburger: {
    width: 18,
    gap: 4,
  },
  hamLine: {
    height: 2,
    borderRadius: 1,
    width: 18,
  },
  hamLineShort: {
    width: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    fontWeight: '500',
  },
  clearSearch: {
    fontSize: 13,
    fontWeight: '700',
    padding: 4,
  },
  filterRow: {
    marginBottom: 20,
  },
  filterList: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
  },
  filterPillActive: {
    shadowColor: '#FF2E93',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  filterPillInactive: {},
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  themeTile: {
    width: TILE_WIDTH,
    height: 180,
    borderRadius: 28,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  symbolPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  symbolText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tileFooter: {
    marginTop: 'auto',
  },
  tileTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  tileSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  arrowCircle: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '900',
  },
});

