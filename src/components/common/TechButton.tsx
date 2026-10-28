import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

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
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.btnPrimary;
      case 'secondary':
        return styles.btnSecondary;
      case 'accent':
        return styles.btnAccent;
      case 'danger':
        return styles.btnDanger;
      case 'preset':
        return styles.btnPreset;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.textPrimary;
      case 'secondary':
        return styles.textSecondary;
      case 'accent':
        return styles.textAccent;
      case 'danger':
        return styles.textDanger;
      case 'preset':
        return styles.textPreset;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.base,
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
        getButtonStyles(),
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          size === 'sm' ? Typography.monoSm : Typography.mono,
          styles.textBase,
          getTextStyles(),
        ]}
      >
        {icon ? `${icon} ` : ''}
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sizeMd: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sizeSm: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  btnPrimary: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  btnSecondary: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
  },
  btnAccent: {
    backgroundColor: '#047857',
    borderColor: '#10B981',
  },
  btnDanger: {
    backgroundColor: '#9F1239',
    borderColor: '#F43F5E',
  },
  btnPreset: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  textBase: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: Colors.textPrimary,
  },
  textAccent: {
    color: '#ECFDF5',
  },
  textDanger: {
    color: '#FFF1F2',
  },
  textPreset: {
    color: Colors.accentCyan,
    fontSize: 11,
  },
  disabled: {
    opacity: 0.4,
  },
});
