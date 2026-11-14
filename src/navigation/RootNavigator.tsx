import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Linking,
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
import { HistoryItem, SolverPrefill } from '../services/historyService';
import { IntroScreen } from '../screens/intro/IntroScreen';
import { LoadingSplash } from '../components/common/LoadingSplash';
import { useTheme } from '../theme/ThemeContext';
import { RootMethodType } from '../types/rootFinding';
import { InterpolationMethodType } from '../types/interpolation';
import { TutorialScreen } from '../screens/TutorialScreen';

export const navigationRef = createNavigationContainerRef<any>();

const Tab = createBottomTabNavigator();

const PUBLISHER_URL = 'https://play.google.com/store/apps/developer?id=GL_DVLP';
const CREATOR_URL = 'https://github.com/NathanJargon';

// Minimal SVG-style geometric tab icons
const TabIcon: React.FC<{
  type: 'home' | 'flashcards' | 'settings' | 'learn';
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

      {type === 'flashcards' && (
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

      {type === 'learn' && (
        <View style={styles.bookIcon}>
          <View style={[styles.bookPageLeft, { backgroundColor: color }]} />
          <View style={[styles.bookSpine, { backgroundColor: colors.surface }]} />
          <View style={[styles.bookPageRight, { backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
};

const HomeTabIcon = ({ focused, color }: { focused: boolean; color: string; size: number }): React.JSX.Element => (
  <TabIcon type="home" focused={focused} color={color} />
);

const FlashcardsTabIcon = ({ focused, color }: { focused: boolean; color: string; size: number }): React.JSX.Element => (
  <TabIcon type="flashcards" focused={focused} color={color} />
);

const SettingsTabIcon = ({ focused, color }: { focused: boolean; color: string; size: number }): React.JSX.Element => (
  <TabIcon type="settings" focused={focused} color={color} />
);

const LearnTabIcon = ({ focused, color }: { focused: boolean; color: string; size: number }): React.JSX.Element => (
  <TabIcon type="learn" focused={focused} color={color} />
);

// Credits Modal for Creators & Developers
const CreditsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { colors } = useTheme();

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to Open Link', url);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={[styles.creditsOverlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.creditsDialog, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.creditsHeaderRow}>
            <View>
              <Text style={[styles.creditsCategory, { color: colors.primary }]}>CALCULIX TEAM</Text>
              <Text style={[styles.creditsTitle, { color: colors.textPrimary }]}>Credits & Developers</Text>
            </View>
            <TouchableOpacity
              style={[styles.creditsCloseBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.creditsCloseText, { color: colors.textPrimary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.creditsDesc, { color: colors.textSecondary }]}>
            Crafted for students, engineers, and educators exploring the mathematical beauty of numerical analysis.
          </Text>

          <TouchableOpacity
            style={[styles.creditsCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={() => openUrl(PUBLISHER_URL)}
            activeOpacity={0.75}
          >
            <View style={styles.creditsCardInfo}>
              <Text style={[styles.creditsRoleBadge, { color: colors.primary }]}>PUBLISHER</Text>
              <Text style={[styles.creditsEntityName, { color: colors.textPrimary }]}>GL_DVLP</Text>
              <Text style={[styles.creditsEntityLink, { color: colors.textMuted }]}>
                play.google.com/store/apps/developer?id=GL_DVLP
              </Text>
            </View>
            <View style={[styles.creditsActionPill, { backgroundColor: colors.primary }]}>
              <Text style={styles.creditsActionPillText}>Store →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.creditsCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={() => openUrl(CREATOR_URL)}
            activeOpacity={0.75}
          >
            <View style={styles.creditsCardInfo}>
              <Text style={[styles.creditsRoleBadge, { color: colors.secondary }]}>CREATOR & DEVELOPER</Text>
              <Text style={[styles.creditsEntityName, { color: colors.textPrimary }]}>MMotsu</Text>
              <Text style={[styles.creditsEntityLink, { color: colors.textMuted }]}>
                github.com/NathanJargon
              </Text>
            </View>
            <View style={[styles.creditsActionPill, { backgroundColor: colors.secondary }]}>
              <Text style={styles.creditsActionPillText}>GitHub →</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// Slide-in Left Drawer Menu
const LeftDrawerModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
  onOpenHistory: () => void;
  onNavigateFlashcards: () => void;
  onNavigateSettings: () => void;
  onNavigateLearn: (mode: 'textbook' | 'manual') => void;
  onOpenCredits: () => void;
}> = ({
  visible,
  onClose,
  onOpenGuide,
  onOpenHistory,
  onNavigateFlashcards,
  onNavigateSettings,
  onNavigateLearn,
  onOpenCredits,
}) => {
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
                  onNavigateLearn('textbook');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, styles.drawerLearnIconBox]}>
                  <Text style={[styles.drawerItemIcon, styles.drawerLearnIcon]}>§</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Method Textbook
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Beauty, derivations & examples
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onClose();
                  onNavigateLearn('manual');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.drawerItemIcon, { color: colors.primary }]}>¶</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    User Manual
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Syntax, keypad & solver guide
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onClose();
                  onOpenGuide();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, { backgroundColor: colors.secondaryLight }]}>
                  <Text style={[styles.drawerItemIcon, { color: colors.secondary }]}>∑</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Formula Cheat Sheet
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Quick equations & convergence
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
                  <Text style={[styles.drawerItemIcon, { color: colors.primary }]}>↺</Text>
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
                  onNavigateFlashcards();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, styles.drawerQuizIconBox]}>
                  <Text style={[styles.drawerItemIcon, styles.drawerQuizIcon]}>▣</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Flashcards
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    Practice & study deck
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
                  <Text style={[styles.drawerItemIcon, { color: colors.accent }]}>≡</Text>
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

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onClose();
                  onOpenCredits();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.drawerItemIconBox, { backgroundColor: colors.secondaryLight }]}>
                  <Text style={[styles.drawerItemIcon, { color: colors.secondary }]}>✦</Text>
                </View>
                <View style={styles.drawerItemTextGroup}>
                  <Text style={[styles.drawerItemTitle, { color: colors.textPrimary }]}>
                    Credits
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: colors.textMuted }]}>
                    GL_DVLP & MMotsu
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
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [learnMode, setLearnMode] = useState<'textbook' | 'manual'>('textbook');
  const [activeSolver, setActiveSolver] = useState<SolverId | null>('bisection');
  const [solverPrefill, setSolverPrefill] = useState<SolverPrefill | undefined>(undefined);
  const [solverInstanceKey, setSolverInstanceKey] = useState(0);
  const [textbookModalChapter, setTextbookModalChapter] = useState<SolverId | null>(null);

  const openSolverWithPrefill = (method: SolverId, prefill?: SolverPrefill) => {
    setSolverPrefill(prefill);
    setSolverInstanceKey((k) => k + 1);
    setActiveSolver(method);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setHistoryOpen(false);
    openSolverWithPrefill(item.method, {
      rootParams: item.rootParams,
      interpolationParams: item.interpolationParams,
    });
  };

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
      if (creditsOpen) {
        setCreditsOpen(false);
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
      if (textbookModalChapter !== null) {
        setTextbookModalChapter(null);
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
  }, [activeSolver, menuOpen, creditsOpen, guideOpen, historyOpen, textbookModalChapter]);

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
            key={`${activeSolver}-${solverInstanceKey}`}
            method={activeSolver as RootMethodType}
            initialPrefill={solverPrefill}
            onBack={() => setActiveSolver(null)}
            onChangeMethod={(newMethod) => openSolverWithPrefill(newMethod, undefined)}
            onOpenGuide={() => setGuideOpen(true)}
            onOpenTextbook={() => setTextbookModalChapter(activeSolver)}
          />
        ) : (
          <DedicatedInterpolationScreen
            key={`${activeSolver}-${solverInstanceKey}`}
            method={activeSolver as InterpolationMethodType}
            initialPrefill={solverPrefill}
            onBack={() => setActiveSolver(null)}
            onChangeMethod={(newMethod) => openSolverWithPrefill(newMethod, undefined)}
            onOpenGuide={() => setGuideOpen(true)}
            onOpenTextbook={() => setTextbookModalChapter(activeSolver)}
          />
        )}

        <TheoryGuideModal visible={guideOpen} onClose={() => setGuideOpen(false)} />

        <Modal
          visible={textbookModalChapter !== null}
          animationType="slide"
          onRequestClose={() => setTextbookModalChapter(null)}
        >
          <SafeAreaView style={[styles.appWrapper, { backgroundColor: colors.background }]}>
            <TutorialScreen
              initialChapterId={textbookModalChapter || activeSolver}
              initialMode="textbook"
              onClose={() => setTextbookModalChapter(null)}
              onOpenSolver={(methodId, prefill) => {
                setTextbookModalChapter(null);
                openSolverWithPrefill(methodId, prefill);
              }}
            />
          </SafeAreaView>
        </Modal>

        <HistoryModal
          visible={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectItem={handleSelectHistoryItem}
        />

        <CreditsModal visible={creditsOpen} onClose={() => setCreditsOpen(false)} />
      </View>
    );
  }

  const bottomInset = Math.max(insets.bottom, 8);
  const tabBarHeight = 62 + bottomInset;

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={[styles.appWrapper, { backgroundColor: colors.background }]}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.tabIcon,
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '700',
              marginTop: -2,
              marginBottom: 4,
            },
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
              tabBarLabel: 'Solvers',
              tabBarIcon: HomeTabIcon,
            }}
          >
            {() => (
              <HomeScreen
                onSelectMethod={(id: SolverId) => openSolverWithPrefill(id, undefined)}
                onOpenMenu={() => setMenuOpen(true)}
                onOpenGuide={() => setGuideOpen(true)}
              />
            )}
          </Tab.Screen>

          {/* Flashcards & Practice Study Deck */}
          <Tab.Screen
            name="Flashcards"
            options={{
              tabBarLabel: 'Flashcards',
              tabBarIcon: FlashcardsTabIcon,
            }}
          >
            {() => <QuizScreen />}
          </Tab.Screen>

          {/* Learn & Tutorials */}
          <Tab.Screen
            name="Learn"
            options={{
              tabBarLabel: 'Learn',
              tabBarIcon: LearnTabIcon,
            }}
          >
            {() => (
              <TutorialScreen
                initialMode={learnMode}
                onOpenSolver={(methodId, prefill) => {
                  openSolverWithPrefill(methodId, prefill);
                }}
              />
            )}
          </Tab.Screen>

          {/* Preferences and Settings */}
          <Tab.Screen
            name="Settings"
            options={{
              tabBarLabel: 'Settings',
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
          onOpenCredits={() => setCreditsOpen(true)}
          onNavigateFlashcards={() => {
            setActiveSolver(null);
            if (navigationRef.isReady()) {
              navigationRef.navigate('Flashcards');
            }
          }}
          onNavigateSettings={() => {
            setActiveSolver(null);
            if (navigationRef.isReady()) {
              navigationRef.navigate('Settings');
            }
          }}
          onNavigateLearn={(mode) => {
            setLearnMode(mode);
            setActiveSolver(null);
            if (navigationRef.isReady()) {
              navigationRef.navigate('Learn');
            }
          }}
        />

        {/* Formula Guide Modal */}
        <TheoryGuideModal visible={guideOpen} onClose={() => setGuideOpen(false)} />

        {/* Calculation History Modal */}
        <HistoryModal
          visible={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectItem={handleSelectHistoryItem}
        />

        {/* Credits Modal */}
        <CreditsModal visible={creditsOpen} onClose={() => setCreditsOpen(false)} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
  },
  iconContainer: {
    width: 38,
    height: 28,
    borderRadius: 14,
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
  bookIcon: {
    width: 18,
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookPageLeft: {
    width: 8,
    height: 14,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  bookSpine: {
    width: 2,
    height: 14,
  },
  bookPageRight: {
    width: 8,
    height: 14,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
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
    marginVertical: 10,
  },
  drawerMenu: {
    flex: 1,
    paddingTop: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  drawerItemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  drawerLearnIconBox: {
    backgroundColor: '#FEF3C7',
  },
  drawerLearnIcon: {
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
    fontSize: 14,
    fontWeight: '700',
  },
  drawerItemSub: {
    fontSize: 11,
    marginTop: 1,
  },
  drawerDarkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 'auto',
  },
  darkToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  creditsOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  creditsDialog: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  creditsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditsCategory: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  creditsTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  creditsCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditsCloseText: {
    fontSize: 15,
    fontWeight: '800',
  },
  creditsDesc: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  creditsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  creditsCardInfo: {
    flex: 1,
    paddingRight: 10,
  },
  creditsRoleBadge: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  creditsEntityName: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  creditsEntityLink: {
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 2,
  },
  creditsActionPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  creditsActionPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
