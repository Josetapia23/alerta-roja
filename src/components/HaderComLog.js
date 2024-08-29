// components/HeaderComLog.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const HeaderComLog = ({ onBackPress }) => (
  <View style={styles.header}>
    
    <Text style={styles.headerText}>Puerto Colombia Seguro.</Text>
    <Text style={styles.subHeaderText}>
      Por favor ingresa con tu correo y contraseña a nuestra comunidad segura...
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingTop: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 8,
  },
});

export default HeaderComLog;
