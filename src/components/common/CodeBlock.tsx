import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';
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

  const handleCopy = () => {
    // Visual feedback
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.container, style]}>
      {(title || language) && (
        <View style={styles.header}>
          <Text style={[Typography.monoSm, styles.title]}>
            {title || 'EXPRESSION'}
          </Text>
          <View style={styles.headerRight}>
            <Text style={[Typography.monoSm, styles.langTag]}>{language}</Text>
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.6}
              style={styles.copyBtn}
            >
              <Text style={[Typography.monoSm, styles.copyText]}>
                {copied ? '✓ COPIED' : 'COPY'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.codeContainer}>
        <Text
          style={[Typography.mono, styles.codeText]}
          selectable
        >
          {code}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070A0E',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langTag: {
    color: Colors.textMuted,
    fontSize: 10,
    marginRight: 10,
  },
  copyBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  copyText: {
    color: Colors.accentCyan,
    fontSize: 10,
    fontWeight: '600',
  },
  codeContainer: {
    padding: 12,
  },
  codeText: {
    color: Colors.accentEmerald,
    fontSize: 13,
    lineHeight: 19,
  },
});
