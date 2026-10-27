import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';
import useDebounce from '../hooks/useDebounce';
import { useAppTheme } from '../store/theme-context';

export default function TodasDespesas() {
  const { expenses } = useExpenses();
  const { colors } = useAppTheme();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return expenses;
    return expenses.filter((e) => e.description.toLowerCase().includes(term));
  }, [expenses, debouncedSearch]);

  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DespesaSaida
        expenses={filtered}
        periodo={isSearching ? 'Resultado da busca' : 'Total'}
        emptyMessage={isSearching ? 'Nenhuma despesa encontrada para essa busca.' : undefined}
      >
        <View style={[styles.search, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.subtext} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por descrição"
            placeholderTextColor={colors.subtext}
            style={[styles.input, { color: colors.text }]}
            autoCorrect={false}
          />
        </View>
      </DespesaSaida>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  input: { flex: 1, paddingVertical: 10, marginLeft: 8 },
});
