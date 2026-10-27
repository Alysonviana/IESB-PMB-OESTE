import React, { useMemo } from 'react';
import { View, useColorScheme } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';
import { useAppTheme } from '../store/theme-context';

export default function DespesasRecentes() {
  const { expenses } = useExpenses();
  const { colors } = useAppTheme();

  const recent = useMemo(() => {
    const limit = new Date();
    limit.setDate(limit.getDate() - 7);
    limit.setHours(0, 0, 0, 0);
    return expenses.filter((e) => new Date(e.date) >= limit);
  }, [expenses]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <DespesaSaida
        expenses={recent}
        periodo="Últimos 7 dias"
        emptyMessage="Nenhuma despesa nos últimos 7 dias. Toque em + para adicionar."
      />
    </View>
  );
}