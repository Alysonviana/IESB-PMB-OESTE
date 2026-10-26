import React from 'react';
import { FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DespesaItem from './DespesaItem';
import { getTheme } from '../../constants/theme';

export default function DespesaLista({ expenses, header, emptyMessage }) {
  const colors = getTheme(useColorScheme());

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DespesaItem expense={item} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={56} color={colors.subtext} />
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            {emptyMessage || 'Nenhuma despesa. Toque em + para adicionar.'}
          </Text>
        </View>
      }
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  empty: { alignItems: 'center', marginTop: 48 },
  emptyText: { marginTop: 12, fontSize: 16, textAlign: 'center' },
});