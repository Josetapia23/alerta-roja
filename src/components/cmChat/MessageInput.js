import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageInput = ({ onSend }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText);  // Envía el mensaje
      setInputText('');    // Limpia el campo
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de entrada */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mensaje"
          placeholderTextColor="#C0C0C0"
          value={inputText}
          onChangeText={setInputText}
        />
      </View>

      {/* Botón de envío */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 28,
    flex: 1,
    marginRight: 10,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#000',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#55A99D', // Establecemos un color inicial
  },
});

export default MessageInput;
