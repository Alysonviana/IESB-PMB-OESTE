import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../store/theme-context';

export default function DespesaSumario({ expenses, periodo }) {
  const { colors } = useAppTheme();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View>
        <Text style={{ color: colors.subtext }}>{periodo}</Text>
        <Text style={{ color: colors.text, fontWeight: '600' }}>
          {expenses.length} {expenses.length === 1 ? 'despesa' : 'despesas'}
        </Text>
      </View>
      <Text style={[styles.total, { color: colors.primary }]}>
        R$ {total.toFixed(2).replace('.', ',')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  total: { fontSize: 20, fontWeight: 'bold' },
});