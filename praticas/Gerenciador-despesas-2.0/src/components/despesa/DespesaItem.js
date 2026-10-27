import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../store/theme-context';

export default function DespesaItem({ expense }) {
  const navigation = useNavigation();
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => navigation.navigate('GerenciarDespesa', { expenseId: expense.id })}
      style={({ pressed }) => [styles.card, { backgroundColor: colors.card }, pressed && { opacity: 0.8 }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.description, { color: colors.text }]}>{expense.description}</Text>
        <Text style={{ color: colors.subtext, marginTop: 2 }}>
          {expense.category} · {new Date(expense.date).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={[styles.amount, { color: colors.primary }]}>
        R$ {expense.amount.toFixed(2).replace('.', ',')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  description: { fontSize: 16, fontWeight: '600' },
  amount: { fontSize: 16, fontWeight: 'bold' },
});