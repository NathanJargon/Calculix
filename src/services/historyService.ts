import AsyncStorage from '@react-native-async-storage/async-storage';
import { SolverId } from '../screens/HomeScreen';
import { DataPoint } from '../types/interpolation';

const STORAGE_KEY = '@calculix_calculation_history_v1';
const MAX_HISTORY_ITEMS = 15;

export interface RootSolverParams {
  functionStr: string;
  a?: number;
  b?: number;
  x0?: number;
  x1?: number;
  gFunctionStr?: string;
  tolerance?: number;
  maxIterations?: number;
}

export interface InterpolationSolverParams {
  points: DataPoint[];
  targetX: number;
}

export interface SolverPrefill {
  rootParams?: RootSolverParams;
  interpolationParams?: InterpolationSolverParams;
}

export interface HistoryItem {
  id: string;
  type: 'root' | 'interpolation';
  method: SolverId;
  methodTitle: string;
  expressionSummary: string;
  resultSummary: string;
  timestamp: number;
  rootParams?: RootSolverParams;
  interpolationParams?: InterpolationSolverParams;
}

export async function getCalculationHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveCalculationToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> {
  try {
    const current = await getCalculationHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    // Filter out immediate identical duplicate
    const filtered = current.filter(
      (c) => !(c.method === newItem.method && c.expressionSummary === newItem.expressionSummary)
    );

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Fail silently without disturbing UX
  }
}

export async function clearCalculationHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

