import React, { useLayoutEffect, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View, useColorScheme, FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../store/expenses-context';
import { CATEGORIES, getTheme } from '../constants/theme';

function validate(values) {
  const errors = {};
  if (values.description.trim().length < 3) {
    errors.description = 'A descrição deve ter no mínimo 3 caracteres.';
  }
  const amount = parseFloat(values.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.amount = 'O valor deve ser maior que zero.';
  }
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  if (values.date > endOfToday) {
    errors.date = 'A data não pode ser futura.';
  }
  if (!values.category) {
    errors.category = 'Selecione uma categoria.';
  }
  return errors;
}

export default function GerenciarDespesa({ route, navigation }) {
  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId;
  const colors = getTheme(useColorScheme());
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();

  const [form, setForm] = useState(() => {
    const expense = expenses.find((e) => e.id === expenseId);
    return expense
      ? {
          description: expense.description,
          amount: String(expense.amount),
          date: new Date(expense.date),
          category: expense.category,
        }
      : { description: '', amount: '', date: new Date(), category: '' };
  });
  const [errors, setErrors] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleChange(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);
    // se o campo estava com erro, revalida só ele (a mensagem some ao corrigir)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }));
    }
  }

  function handleAmount(text) {
    const value = text.replace(',', '.');
    if (/^\d*\.?\d{0,2}$/.test(value)) handleChange('amount', value);
  }

  function handleDelete() {
    Alert.alert('Excluir despesa', 'Tem certeza que deseja excluir esta despesa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteExpense(expenseId);
          navigation.goBack();
        },
      },
    ]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar despesa' : 'Nova despesa',
      headerRight: isEditing
        ? () => (
            <Pressable onPress={handleDelete} hitSlop={10}>
              <Ionicons name="trash-outline" size={24} color={colors.danger} />
            </Pressable>
          )
        : undefined,
    });
  }, [navigation, isEditing, colors.danger]);

  function handleSave() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      date: form.date.toISOString(),
      category: form.category,
    };
    if (isEditing) updateExpense(expenseId, data);
    else addExpense(data);
    navigation.goBack();
  }

  const inputStyle = (field) => [
    styles.input,
    {
      backgroundColor: colors.input,
      color: colors.text,
      borderColor: errors[field] ? colors.danger : colors.border,
    },
  ];
  const ErrorText = ({ field }) =>
    errors[field] ? <Text style={[styles.error, { color: colors.danger }]}>{errors[field]}</Text> : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
        <TextInput
          style={inputStyle('description')}
          value={form.description}
          onChangeText={(t) => handleChange('description', t)}
          placeholder="Ex.: Almoço"
          placeholderTextColor={colors.subtext}
        />
        <ErrorText field="description" />

        <Text style={[styles.label, { color: colors.text }]}>Valor (R$)</Text>
        <TextInput
          style={inputStyle('amount')}
          value={form.amount}
          onChangeText={handleAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={colors.subtext}
        />
        <ErrorText field="amount" />

        <Text style={[styles.label, { color: colors.text }]}>Data</Text>
        <Pressable style={inputStyle('date')} onPress={() => setShowPicker((v) => !v)}>
          <Text style={{ color: colors.text }}>{form.date.toLocaleDateString('pt-BR')}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={form.date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            themeVariant={colors === getTheme('dark') ? 'dark' : 'light'}
            onChange={(event, selected) => {
              if (Platform.OS === 'android') setShowPicker(false);
              if (event.type === 'set' && selected) handleChange('date', selected);
            }}
          />
        )}
        <ErrorText field="date" />

        <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>
        <Pressable style={inputStyle('category')} onPress={() => setShowModal(true)}>
          <Text style={{ color: form.category ? colors.text : colors.subtext }}>
            {form.category || 'Selecione uma categoria'}
          </Text>
        </Pressable>
        <ErrorText field="category" />

        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowModal(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Categoria</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.option, { borderColor: colors.border }]}
                  onPress={() => {
                    handleChange('category', item);
                    setShowModal(false);
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 16 }}>{item}</Text>
                  {form.category === item && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 48 },
  label: { marginTop: 14, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1.5, borderRadius: 8, padding: 12, fontSize: 16 },
  error: { marginTop: 4, fontSize: 13 },
  button: { marginTop: 28, padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '60%' },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});