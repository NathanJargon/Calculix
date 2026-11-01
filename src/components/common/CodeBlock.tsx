import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../theme/typography';

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: string;
  style?: ViewStyle;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  title,
  language = 'MATH',
  style,
}) => {
  const [copied, setCopied] = useState(false);
  const { colors } = useTheme();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }, style]}>
      {(title || language) && (
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textSecondary }]}>{title || 'Formula'}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.6}
              style={[styles.copyBtn, { backgroundColor: colors.surfaceSecondary }]}
            >
              <Text style={[styles.copyText, { color: colors.primary }]}>
                {copied ? '✓ Copied' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.codeContainer}>
        <Text style={[Typography.mono, styles.codeText, { color: colors.textPrimary }]} selectable>
          {code}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  copyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  codeContainer: {
    padding: 14,
  },
  codeText: {
    fontSize: 13,
  },
});
