import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderBar } from '../components/common/HeaderBar';
import { InterpolationScreen } from '../screens/InterpolationScreen';
import { RootFindingScreen } from '../screens/RootFindingScreen';
import { TheoryGuideModal } from '../screens/TheoryGuideModal';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const Tab = createBottomTabNavigator();

export const RootNavigator: React.FC = () => {
  const [guideVisible, setGuideVisible] = useState(false);

  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        {/* Persistent Technical Header */}
        <HeaderBar
          title="NUMEX"
          subtitle="NUMERICAL ANALYSIS TOOLKIT"
          onInfoPress={() => setGuideVisible(true)}
        />

        {/* Tab Navigator */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabBarItem,
            tabBarActiveTintColor: Colors.accentCyan,
            tabBarInactiveTintColor: Colors.textMuted,
            tabBarLabelStyle: [Typography.monoSm, styles.tabLabel],
          }}
        >
          <Tab.Screen
            name="RootFinding"
            component={RootFindingScreen}
            options={{
              tabBarLabel: 'ROOT-FINDING',
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconBox,
                    focused ? styles.iconBoxActive : null,
                  ]}
                >
                  <Text style={[styles.iconText, { color }]}>ƒ(x)</Text>
                </View>
              ),
            }}
          />

          <Tab.Screen
            name="Interpolation"
            component={InterpolationScreen}
            options={{
              tabBarLabel: 'INTERPOLATION',
              tabBarIcon: ({ color, focused }) => (
                <View
                  style={[
                    styles.iconBox,
                    focused ? styles.iconBoxActiveViolet : null,
                  ]}
                >
                  <Text style={[styles.iconText, { color }]}>P(x)</Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>

        {/* Numerical Methods Reference Modal */}
        <TheoryGuideModal
          visible={guideVisible}
          onClose={() => setGuideVisible(false)}
        />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    backgroundColor: '#070A0E',
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  iconBox: {
    width: 32,
    height: 22,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 2,
  },
  iconBoxActive: {
    backgroundColor: '#0284C720',
    borderColor: Colors.borderActive,
  },
  iconBoxActiveViolet: {
    backgroundColor: '#8B5CF620',
    borderColor: Colors.accentViolet,
  },
  iconText: {
    ...Typography.monoSm,
    fontWeight: '700',
    fontSize: 11,
  },
});
