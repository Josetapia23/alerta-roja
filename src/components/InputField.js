// components/InputField.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const InputField = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Icon name={icon} size={20} color="#666" />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EB2525',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
});

export default InputField;
