import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  clearCalculationHistory,
  formatTimeAgo,
  getCalculationHistory,
  HistoryItem,
} from '../services/historyService';
import { useTheme } from '../theme/ThemeContext';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  onClose,
  onSelectItem,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<HistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    const history = await getCalculationHistory();
    setItems(history);
  }, []);

  useEffect(() => {
    if (visible) {
      loadHistory();
    }
  }, [visible, loadHistory]);

  const handleClearAll = () => {
    Alert.alert('Clear History', 'Remove all saved calculations?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearCalculationHistory();
          setItems([]);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      activeOpacity={0.72}
      onPress={() => {
        onSelectItem(item);
        onClose();
      }}
    >
      <View style={styles.historyCardLeft}>
        <View style={[styles.methodBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.methodBadgeText, { color: colors.primary }]} numberOfLines={1}>
            {item.methodTitle}
          </Text>
        </View>
        <Text style={[styles.expressionText, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.expressionSummary}
        </Text>
        <Text style={[styles.resultText, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.resultSummary}
        </Text>
      </View>
      <Text style={[styles.timeText, { color: colors.textMuted }]}>
        {formatTimeAgo(item.timestamp)}
      </Text>
    </TouchableOpacity>
  );

  const bottomPad = Math.max(insets.bottom, 16);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: bottomPad }]}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Recent Calculations
            </Text>
            {items.length > 0 && (
              <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
                <Text style={[styles.clearBtn, { color: colors.error }]}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No calculations yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Solve an equation to see it appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  sheet: {
    maxHeight: '82%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  clearBtn: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 8,
    gap: 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  historyCardLeft: {
    flex: 1,
    marginRight: 12,
    gap: 4,
  },
  methodBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 2,
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  expressionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
});
