import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  onInfoPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  onInfoPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Text style={[Typography.h1, styles.title]}>NUMEX</Text>
          <View style={styles.versionTag}>
            <Text style={[Typography.monoSm, styles.versionText]}>v1.0.0</Text>
          </View>
        </View>
        <Text style={[Typography.monoSm, styles.subtitle]}>
          {subtitle || 'NUMERICAL ANALYSIS TOOLKIT'}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={styles.engineBadge}>
          <View style={styles.engineDot} />
          <Text style={[Typography.monoSm, styles.engineText]}>HERMES / MATHJS</Text>
        </View>

        {onInfoPress && (
          <TouchableOpacity
            style={styles.infoBtn}
            onPress={onInfoPress}
            activeOpacity={0.7}
          >
            <Text style={[Typography.monoSm, styles.infoText]}>?</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#070A0E',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  versionTag: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 8,
  },
  versionText: {
    color: Colors.accentCyan,
    fontSize: 9,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
    fontSize: 10,
  },
  right: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1420',
    borderColor: '#1E293B',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
  },
  engineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.accentEmerald,
    marginRight: 5,
  },
  engineText: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },
  infoBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: Colors.accentCyan,
    fontWeight: '700',
    fontSize: 12,
  },
});
