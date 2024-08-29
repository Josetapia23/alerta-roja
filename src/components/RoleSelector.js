// components/RoleSelector.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const RoleSelector = ({ role, setRole, handleContinue }) => (
  <View style={styles.roleContainer}>
    <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Agente de Seguridad')}>
      <Text style={styles.roleText}>Agente de Seguridad</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Ciudadano')}>
      <Text style={styles.roleText}>Ciudadano</Text>
    </TouchableOpacity>
    <Button mode="contained" onPress={handleContinue} style={styles.continueButton}>
      Continue
    </Button>
  </View>
);

const styles = StyleSheet.create({
  roleContainer: {
    marginBottom: 24,
  },
  roleButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#EB2525',
    borderRadius: 30,
    marginBottom: 16,
    alignItems: 'center',
  },
  roleText: {
    fontSize: 18,
    color: '#EB2525',
  },
  continueButton: {
    backgroundColor: '#EB2525',
    paddingVertical: 8,
    borderRadius: 30,
  },
});

export default RoleSelector;
