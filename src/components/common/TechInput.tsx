import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';
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
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[Typography.label, styles.labelText]}>{label}</Text>
          {error && <Text style={[Typography.monoSm, styles.errorText]}>{error}</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputWrapperError : null,
        ]}
      >
        {prefix && (
          <View style={styles.prefixContainer}>
            <Text style={[Typography.monoSm, styles.prefixText]}>{prefix}</Text>
          </View>
        )}

        <TextInput
          style={[
            Typography.mono,
            styles.input,
            prefix ? styles.inputWithPrefix : null,
            suffix ? styles.inputWithSuffix : null,
            style,
          ]}
          placeholderTextColor={Colors.textMuted}
          selectionColor={Colors.accentCyan}
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {onClear && !!value && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={onClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}

        {suffix && (
          <View style={styles.suffixContainer}>
            <Text style={[Typography.monoSm, styles.suffixText]}>{suffix}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  labelText: {
    color: Colors.textSecondary,
  },
  errorText: {
    color: Colors.accentRose,
    fontSize: 11,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  inputWrapperError: {
    borderColor: Colors.accentRose,
    backgroundColor: '#88133715',
  },
  prefixContainer: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    justifyContent: 'center',
  },
  prefixText: {
    color: Colors.accentCyan,
    fontWeight: '600',
  },
  suffixContainer: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    justifyContent: 'center',
  },
  suffixText: {
    color: Colors.textMuted,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  inputWithPrefix: {
    paddingLeft: 10,
  },
  inputWithSuffix: {
    paddingRight: 10,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  clearIcon: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
