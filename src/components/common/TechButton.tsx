import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface TechButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'preset';
  size?: 'sm' | 'md';
  icon?: string;
  style?: ViewStyle;
}

export const TechButton: React.FC<TechButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  disabled,
  ...props
}) => {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: [styles.btnPrimary, { backgroundColor: colors.primary }],
          text: { color: '#FFFFFF' },
        };
      case 'secondary':
        return {
          container: [styles.btnSecondary, { backgroundColor: colors.surface, borderColor: colors.border }],
          text: { color: colors.textPrimary },
        };
      case 'accent':
        return {
          container: [styles.btnAccent, { backgroundColor: colors.secondary }],
          text: { color: '#FFFFFF' },
        };
      case 'danger':
        return {
          container: [styles.btnDanger, { backgroundColor: colors.error }],
          text: { color: '#FFFFFF' },
        };
      case 'preset':
        return {
          container: [styles.btnPreset, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }],
          text: { color: colors.textSecondary },
        };
      default:
        return {
          container: [styles.btnPrimary, { backgroundColor: colors.primary }],
          text: { color: '#FFFFFF' },
        };
    }
  };

  const v = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.base,
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
        v.container,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...props}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[
          styles.textBase,
          size === 'sm' ? styles.textSm : styles.textMd,
          v.text,
          disabled ? { color: colors.textMuted } : null,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 26,
  },
  textBase: {
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 15,
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
  },
  btnPrimary: {
    shadowColor: '#FF2E93',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnSecondary: {
    borderWidth: 1.5,
  },
  btnAccent: {
    shadowColor: '#00D2D3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnDanger: {},
  btnPreset: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});
