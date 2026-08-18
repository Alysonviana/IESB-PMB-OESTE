import { StatusBar } from 'expo-status-bar';
import { Button ,StyleSheet, Text, View } from 'react-native';
import { titulo } from './util';
import titulo_padrao from './util';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{titulo}</Text>
      <Text style={{margin: 20}}>{titulo_padrao}</Text>
      <Text styles={styles.text}>TESTE2</Text>
      <Button title='Clique Aqui' />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  text: {
    margin: 20,
    margin: int,
    borderWidth: int,
    borderColor: str,
    padding: int,
  }

});
