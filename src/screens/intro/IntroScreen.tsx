import React, { useState, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cardColor: string;
  subCards: { label: string; desc: string }[];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    badge: 'Numerical Analysis',
    title: 'Custom Math & Numerical Solver',
    subtitle: 'Solve complex root finding equations and interpolation problems effortlessly with clean, step-by-step guidance.',
    cardColor: '#00D2D3',
    subCards: [
      { label: 'Root Finding', desc: 'Bisection, Newton, Secant, Fixed-Point' },
      { label: 'Interpolation', desc: 'Newton Divided Diff, Lagrange' },
    ],
  },
  {
    id: '2',
    badge: 'Accuracy & Speed',
    title: 'Instant Step-by-Step Solutions',
    subtitle: 'Inspect convergence errors, iteration tables, and polynomial derivations tailored for students and engineers.',
    cardColor: '#FF2E93',
    subCards: [
      { label: 'Smart Keypad', desc: 'One-tap symbols like x², √, sin, cos' },
      { label: 'Full Precision', desc: 'Detailed table breakdown of each step' },
    ],
  },
];

interface IntroScreenProps {
  onFinish: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index?: number | null }> }) => {
      if (viewableItems && viewableItems.length > 0 && typeof viewableItems[0].index === 'number') {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      onFinish();
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Row with Skip button */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={[styles.brandPill, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.brandText, { color: colors.primary }]}>Calculix</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onFinish} activeOpacity={0.7} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide Carousels */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            {/* Visual Hero Container with rounded card layout */}
            <View style={[styles.heroCard, { backgroundColor: item.cardColor }]}>
              <View style={styles.decorCircle1} />
              <View style={styles.decorCircle2} />

              <View style={styles.heroContent}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{item.badge}</Text>
                </View>

                <View style={styles.subGrid}>
                  {item.subCards.map((sc: { label: string; desc: string }, idx: number) => (
                    <View key={idx} style={styles.subCard}>
                      <Text style={styles.subCardTitle}>{sc.label}</Text>
                      <Text style={styles.subCardDesc}>{sc.desc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Title & Copy Section */}
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {item.title}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {item.subtitle}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Nav Bar with Indicator and Start Button */}
      <View style={styles.bottomBar}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex
                  ? [styles.activeDot, { backgroundColor: colors.primary }]
                  : [styles.inactiveDot, { backgroundColor: colors.border }],
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>{isLast ? 'Start' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  heroCard: {
    height: 320,
    borderRadius: 36,
    padding: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroContent: {
    zIndex: 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subGrid: {
    gap: 12,
  },
  subCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 20,
    padding: 16,
  },
  subCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  subCardDesc: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  textContainer: {
    paddingHorizontal: 6,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 32,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
  },
  inactiveDot: {
    width: 8,
  },
  startBtn: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 28,
    shadowColor: '#FF2E93',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
