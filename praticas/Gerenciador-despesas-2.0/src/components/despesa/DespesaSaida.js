import React from 'react';
import { View } from 'react-native';
import DespesaLista from './DespesaLista';
import DespesaSumario from './DespesaSumario';

// Junta o sumário (quantidade + total) e a lista. `children` recebe elementos extras (ex.: busca).
export default function DespesaSaida({ expenses, periodo, emptyMessage, children }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <DespesaLista
        expenses={expenses}
        emptyMessage={emptyMessage}
        header={<DespesaSumario expenses={expenses} periodo={periodo} />}
      />
    </View>
  );
}