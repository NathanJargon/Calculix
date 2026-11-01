import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../theme/typography';

interface TechInputProps extends TextInputProps {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  containerStyle?: ViewStyle;
  onClear?: () => void;
}

export const TechInput: React.FC<TechInputProps> = ({
  label,
  prefix,
  suffix,
  error,
  containerStyle,
  onClear,
  value,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[Typography.label, styles.labelText, { color: colors.textPrimary }]}>{label}</Text>
          {error && <Text style={[Typography.monoSm, styles.errorText, { color: colors.error }]}>{error}</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          isFocused ? [styles.inputWrapperFocused, { borderColor: colors.primary }] : null,
          error ? [styles.inputWrapperError, { borderColor: colors.error }] : null,
        ]}
      >
        {prefix && (
          <View style={styles.prefixContainer}>
            <Text style={[styles.prefixText, { color: colors.primary }]}>{prefix}</Text>
          </View>
        )}

        <TextInput
          style={[
            Typography.mono,
            styles.input,
            { color: colors.textPrimary },
            prefix ? styles.inputWithPrefix : null,
            suffix ? styles.inputWithSuffix : null,
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {onClear && !!value && (
          <TouchableOpacity
            style={[styles.clearBtn, { backgroundColor: colors.surfaceSecondary }]}
            onPress={onClear}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearIcon, { color: colors.textMuted }]}>✕</Text>
          </TouchableOpacity>
        )}

        {suffix && (
          <View style={styles.suffixContainer}>
            <Text style={[styles.suffixText, { color: colors.textMuted }]}>{suffix}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    shadowColor: '#FF2E93',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  inputWrapperError: {},
  prefixContainer: {
    paddingRight: 6,
  },
  prefixText: {
    fontWeight: '800',
    fontSize: 13,
  },
  suffixContainer: {
    paddingLeft: 6,
  },
  suffixText: {
    fontSize: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  inputWithPrefix: {
    paddingLeft: 4,
  },
  inputWithSuffix: {
    paddingRight: 4,
  },
  clearBtn: {
    padding: 6,
    borderRadius: 12,
    marginLeft: 6,
  },
  clearIcon: {
    fontSize: 11,
    fontWeight: '800',
  },
});
