import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface MathKeypadProps {
  onInsert: (symbol: string) => void;
  onBackspace?: () => void;
  onClear?: () => void;
}

const MATH_BUTTONS: { label: string; value: string; isHighlight?: boolean }[] = [
  { label: 'x', value: 'x', isHighlight: true },
  { label: 'x²', value: '^2' },
  { label: 'x³', value: '^3' },
  { label: 'xʸ', value: '^' },
  { label: '+', value: ' + ' },
  { label: '−', value: ' - ' },
  { label: '×', value: '*' },
  { label: '÷', value: '/' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: '√', value: 'sqrt(' },
  { label: 'sin', value: 'sin(' },
  { label: 'cos', value: 'cos(' },
  { label: 'eˣ', value: 'e^' },
  { label: 'ln', value: 'log(' },
];

export const MathKeypad: React.FC<MathKeypadProps> = ({
  onInsert,
  onBackspace,
  onClear,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.helperTitle, { color: colors.textMuted }]}>Quick Symbols</Text>
        <View style={styles.actionRow}>
          {onBackspace && (
            <TouchableOpacity
              onPress={onBackspace}
              style={[styles.actionBtn, { backgroundColor: colors.surfaceSecondary }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>⌫</Text>
            </TouchableOpacity>
          )}
          {onClear && (
            <TouchableOpacity
              onPress={onClear}
              style={[styles.actionBtn, { backgroundColor: colors.surfaceSecondary }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>C</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonsList}
      >
        {MATH_BUTTONS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.btn,
              { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              item.isHighlight ? { backgroundColor: colors.primaryLight, borderColor: colors.primary } : null,
            ]}
            onPress={() => onInsert(item.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.btnText,
                { color: item.isHighlight ? colors.primary : colors.textPrimary },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  helperTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  buttonsList: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  btn: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
