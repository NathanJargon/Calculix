import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen, SolverId } from '../screens/HomeScreen';
import { DedicatedSolverScreen } from '../screens/DedicatedSolverScreen';
import { DedicatedInterpolationScreen } from '../screens/DedicatedInterpolationScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TheoryGuideModal } from '../screens/TheoryGuideModal';
import { IntroScreen } from '../screens/intro/IntroScreen';
import { useTheme } from '../theme/ThemeContext';
import { RootMethodType } from '../types/rootFinding';
import { InterpolationMethodType } from '../types/interpolation';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Minimal SVG-style geometric tab icons
const TabIcon: React.FC<{
  type: 'home' | 'settings';
  focused: boolean;
  color: string;
}> = ({ type, focused, color }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.iconContainer,
        focused ? { backgroundColor: colors.primaryLight } : null,
      ]}
    >
      {type === 'home' && (
        <View style={styles.gridIcon}>
          <View style={[styles.gridDot, { backgroundColor: color }]} />
          <View style={[styles.gridDot, { backgroundColor: color }]} />
          <View style={[styles.gridDot, { backgroundColor: color }]} />
          <View style={[styles.gridDot, { backgroundColor: color }]} />
        </View>
      )}

      {type === 'settings' && (
        <View style={styles.gearIcon}>
          <View style={[styles.gearRing, { borderColor: color }]}>
            <View style={[styles.gearCenter, { backgroundColor: color }]} />
          </View>
        </View>
      )}
    </View>
  );
};

// Slide-in Left Drawer Menu
const LeftDrawerModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
  onNavigateSettings: () => void;
}> = ({ visible, onClose, onOpenGuide, onNavigateSettings }) => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.drawerPanel, { backgroundColor: colors.surface }]}
        >
          <SafeAreaView edges={['top', 'bottom']} style={styles.drawerInner}>
            {/* Header info */}
            <View style={styles.drawerHeader}>
              <View style={[styles.drawerAvatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.drawerAvatarText, { color: colors.primary }]}>C</Text>
              </View>
              <Text style={[styles.drawerAppTitle, { color: colors.textPrimary }]}>Calculix</Text>
              <Text style={[styles.drawerTagline, { color: colors.textSecondary }]}>
                Numerical Analysis Suite
              </Text>
            </View>

            <View style={[styles.drawerDivider, { backgroundColor: colors.border }]} />

            {/* Menu Items */}
            <View style={styles.drawerMenu}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onClose();
                  onOpenGuide();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, { backgroundColor: colors.secondaryLight }]}>
                  <Text style={[styles.drawerItemIcon, { color: colors.secondary }]}>?</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Theory & Guides
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Formulas & convergence
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onClose();
                  onNavigateSettings();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.drawerItemIcon, { color: colors.accent }]}>⚙</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Settings
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Dark mode & info
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.drawerDivider, { backgroundColor: colors.border }]} />

            {/* Quick Dark Mode Toggle */}
            <TouchableOpacity
              style={styles.drawerDarkToggle}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <View style={styles.darkToggleLeft}>
                <Text style={styles.darkToggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
                <Text style={[styles.darkToggleLabel, { color: colors.textPrimary }]}>
                  {isDark ? 'Light Theme' : 'Dark Theme'}
                </Text>
              </View>
              <View
                style={[
                  styles.togglePill,
                  { backgroundColor: isDark ? colors.primary : colors.surfaceSecondary },
                ]}
              >
                <Text style={[styles.togglePillText, { color: isDark ? '#FFFFFF' : colors.textSecondary }]}>
                  {isDark ? 'ON' : 'OFF'}
                </Text>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export const RootNavigator: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [activeSolver, setActiveSolver] = useState<SolverId | null>(null);

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  // If a specific solver is selected from the grid, show its dedicated screen
  if (activeSolver) {
    const isRootFinding =
      activeSolver === 'bisection' ||
      activeSolver === 'newton' ||
      activeSolver === 'secant' ||
      activeSolver === 'fixed-point';

    return (
      <View style={[styles.appWrapper, { backgroundColor: colors.background }]}>
        {isRootFinding ? (
          <DedicatedSolverScreen
            method={activeSolver as RootMethodType}
            onBack={() => setActiveSolver(null)}
            onOpenGuide={() => setGuideOpen(true)}
          />
        ) : (
          <DedicatedInterpolationScreen
            method={activeSolver as InterpolationMethodType}
            onBack={() => setActiveSolver(null)}
            onOpenGuide={() => setGuideOpen(true)}
          />
        )}

        <TheoryGuideModal visible={guideOpen} onClose={() => setGuideOpen(false)} />
      </View>
    );
  }

  const bottomInset = Math.max(insets.bottom, 10);
  const tabBarHeight = 58 + bottomInset;

  return (
    <NavigationContainer>
      <View style={[styles.appWrapper, { backgroundColor: colors.background }]}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: colors.tabBar,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: tabBarHeight,
              paddingBottom: bottomInset,
              paddingTop: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 8,
            },
            tabBarItemStyle: {
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          {/* Main Home Hub with 2x2 Grid Themes */}
          <Tab.Screen
            name="Home"
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  type="home"
                  focused={focused}
                  color={focused ? colors.primary : colors.tabIcon}
                />
              ),
            }}
          >
            {() => (
              <HomeScreen
                onSelectMethod={(id: SolverId) => setActiveSolver(id)}
                onOpenMenu={() => setMenuOpen(true)}
                onOpenGuide={() => setGuideOpen(true)}
              />
            )}
          </Tab.Screen>

          {/* Preferences and Settings */}
          <Tab.Screen
            name="Settings"
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  type="settings"
                  focused={focused}
                  color={focused ? colors.primary : colors.tabIcon}
                />
              ),
            }}
          >
            {() => <SettingsScreen />}
          </Tab.Screen>
        </Tab.Navigator>

        {/* Slide-in Left Drawer */}
        <LeftDrawerModal
          visible={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpenGuide={() => setGuideOpen(true)}
          onNavigateSettings={() => {
            // Can be toggled if needed
          }}
        />

        {/* Formula Guide Modal */}
        <TheoryGuideModal visible={guideOpen} onClose={() => setGuideOpen(false)} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIcon: {
    width: 16,
    height: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridDot: {
    width: 6,
    height: 6,
    borderRadius: 2,
  },
  gearIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearCenter: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerPanel: {
    width: width * 0.74,
    maxWidth: 290,
    height: '100%',
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  drawerInner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  drawerHeader: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  drawerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  drawerAvatarText: {
    fontSize: 22,
    fontWeight: '900',
  },
  drawerAppTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  drawerTagline: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  drawerDivider: {
    height: 1,
    marginVertical: 14,
  },
  drawerMenu: {
    flex: 1,
    paddingTop: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  drawerItemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  drawerItemIcon: {
    fontSize: 16,
    fontWeight: '800',
  },
  drawerItemTextGroup: {
    flex: 1,
  },
  drawerItemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  drawerItemSub: {
    fontSize: 11,
    marginTop: 2,
  },
  drawerDarkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 'auto',
  },
  darkToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkToggleIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  darkToggleLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  togglePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  togglePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
