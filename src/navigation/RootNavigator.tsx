import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen, SolverId } from '../screens/HomeScreen';
import { DedicatedSolverScreen } from '../screens/DedicatedSolverScreen';
import { DedicatedInterpolationScreen } from '../screens/DedicatedInterpolationScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { TheoryGuideModal } from '../screens/TheoryGuideModal';
import { HistoryModal } from '../screens/HistoryModal';
import { HistoryItem } from '../services/historyService';
import { IntroScreen } from '../screens/intro/IntroScreen';
import { LoadingSplash } from '../components/common/LoadingSplash';
import { useTheme } from '../theme/ThemeContext';
import { RootMethodType } from '../types/rootFinding';
import { InterpolationMethodType } from '../types/interpolation';

export const navigationRef = createNavigationContainerRef<any>();

const Tab = createBottomTabNavigator();

// Minimal SVG-style geometric tab icons
const TabIcon: React.FC<{
  type: 'home' | 'quiz' | 'settings';
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

      {type === 'quiz' && (
        <View style={styles.cardsIcon}>
          <View style={[styles.cardLayer1, { borderColor: color }]} />
          <View style={[styles.cardLayer2, { borderColor: color, backgroundColor: colors.surface }]} />
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

const HomeTabIcon = ({ focused, color }: { focused: boolean; color: string; size: number }): React.JSX.Element => (
  <TabIcon type="home" focused={focused} color={color} />
);

const QuizTabIcon = ({ focused, color }: { focused: boolean; color: string; size: number }): React.JSX.Element => (
  <TabIcon type="quiz" focused={focused} color={color} />
);

const SettingsTabIcon = ({ focused, color }: { focused: boolean; color: string; size: number }): React.JSX.Element => (
  <TabIcon type="settings" focused={focused} color={color} />
);

// Slide-in Left Drawer Menu
const LeftDrawerModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
  onOpenHistory: () => void;
  onNavigateQuiz: () => void;
  onNavigateSettings: () => void;
}> = ({ visible, onClose, onOpenGuide, onOpenHistory, onNavigateQuiz, onNavigateSettings }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.78, 320);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.drawerPanel, { backgroundColor: colors.surface, width: panelWidth }]}
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
                  <Text style={[styles.drawerItemIcon, { color: colors.secondary }]}>¶</Text>
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
                  onOpenHistory();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.drawerItemIcon, { color: colors.primary }]}>≡</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    History
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Recent calculations
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onClose();
                  onNavigateQuiz();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, styles.drawerQuizIconBox]}>
                  <Text style={[styles.drawerItemIcon, styles.drawerQuizIcon]}>⚡</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Quizizz & Cards
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Quizzes, streaks & study deck
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
                  <Text style={[styles.drawerItemIcon, { color: colors.accent }]}>#</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Settings
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Preferences & info
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
                <Text style={[styles.darkToggleLabel, { color: colors.textPrimary }]}>
                  Dark Theme
                </Text>
              </View>
              <View
                style={[
                  styles.togglePill,
                  { backgroundColor: isDark ? colors.primary : colors.surfaceSecondary },
                ]}
              >
                <Text style={[styles.togglePillText, isDark ? styles.textWhite : { color: colors.textSecondary }]}>
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
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeSolver, setActiveSolver] = useState<SolverId | null>('bisection');

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Check if introduction was previously completed
    AsyncStorage.getItem('has_seen_intro')
      .then((val) => {
        if (val === 'true') {
          setShowIntro(false);
        } else {
          setShowIntro(true);
        }
      })
      .catch(() => {
        setShowIntro(false);
      });
  }, []);

  useEffect(() => {
    // Hardware Android Back Button Handler (F6)
    const onBackPress = () => {
      if (menuOpen) {
        setMenuOpen(false);
        return true;
      }
      if (guideOpen) {
        setGuideOpen(false);
        return true;
      }
      if (historyOpen) {
        setHistoryOpen(false);
        return true;
      }
      if (activeSolver !== null) {
        setActiveSolver(null);
        return true;
      }
      Alert.alert(
        'Exit Calculix',
        'Do you want to exit the application?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true;
    };

    const backSub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSub.remove();
  }, [activeSolver, menuOpen, guideOpen, historyOpen]);

  const handleFinishIntro = async () => {
    try {
      await AsyncStorage.setItem('has_seen_intro', 'true');
    } catch {
      // Ignore
    }
    setShowIntro(false);
  };

  if (showIntro === null) {
    // Branded initial loading splash while restoring persisted state
    return <LoadingSplash />;
  }

  if (showIntro) {
    return <IntroScreen onFinish={handleFinishIntro} />;
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
            key={activeSolver}
            method={activeSolver as RootMethodType}
            onBack={() => setActiveSolver(null)}
            onChangeMethod={(newMethod) => setActiveSolver(newMethod)}
            onOpenGuide={() => setGuideOpen(true)}
          />
        ) : (
          <DedicatedInterpolationScreen
            key={activeSolver}
            method={activeSolver as InterpolationMethodType}
            onBack={() => setActiveSolver(null)}
            onChangeMethod={(newMethod) => setActiveSolver(newMethod)}
            onOpenGuide={() => setGuideOpen(true)}
          />
        )}

        <TheoryGuideModal visible={guideOpen} onClose={() => setGuideOpen(false)} />

        <HistoryModal
          visible={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectItem={(_item: HistoryItem) => {
            setHistoryOpen(false);
          }}
        />
      </View>
    );
  }

  const bottomInset = Math.max(insets.bottom, 10);
  const tabBarHeight = 58 + bottomInset;

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={[styles.appWrapper, { backgroundColor: colors.background }]}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.tabIcon,
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
              tabBarIcon: HomeTabIcon,
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

          {/* Flashcards & Quizzes (Quizizz Experience) */}
          <Tab.Screen
            name="Quiz"
            options={{
              tabBarIcon: QuizTabIcon,
            }}
          >
            {() => <QuizScreen />}
          </Tab.Screen>

          {/* Preferences and Settings */}
          <Tab.Screen
            name="Settings"
            options={{
              tabBarIcon: SettingsTabIcon,
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
          onOpenHistory={() => setHistoryOpen(true)}
          onNavigateQuiz={() => {
            setActiveSolver(null);
            if (navigationRef.isReady()) {
              navigationRef.navigate('Quiz');
            }
          }}
          onNavigateSettings={() => {
            setActiveSolver(null);
            if (navigationRef.isReady()) {
              navigationRef.navigate('Settings');
            }
          }}
        />

        {/* Formula Guide Modal */}
        <TheoryGuideModal visible={guideOpen} onClose={() => setGuideOpen(false)} />

        {/* Calculation History Modal */}
        <HistoryModal
          visible={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectItem={(_item: HistoryItem) => {
            setHistoryOpen(false);
          }}
        />
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
  cardsIcon: {
    width: 22,
    height: 22,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLayer1: {
    position: 'absolute',
    width: 14,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    top: 2,
    left: 2,
    opacity: 0.6,
  },
  cardLayer2: {
    position: 'absolute',
    width: 14,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    bottom: 2,
    right: 2,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerPanel: {
    width: '74%',
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
  drawerQuizIconBox: {
    backgroundColor: '#FEF3C7',
  },
  drawerQuizIcon: {
    color: '#D97706',
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
  textWhite: {
    color: '#FFFFFF',
  },
});
