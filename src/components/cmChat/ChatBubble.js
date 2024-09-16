import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar'; // Importamos el componente Avatar

const ChatBubble = ({ message, isCurrentUser, name, time, role }) => {
  // Color de la burbuja basado en el rol
  const bubbleColor = role === 'Agente de Seguridad' ? '#A1CDFD' : '#FF9897'; // Azul para agentes, rojo para ciudadanos

  // Color del nombre y la hora basado en el rol
  const nameColor = role === 'Agente de Seguridad' ? '#2D61E5' : '#E65252'; // Azul para agentes, rojo para ciudadanos
  const timeColor = role === 'Agente de Seguridad' ? '#2C38E8' : '#E82C2C'; // Azul para agentes, rojo para ciudadanos

  
  return (
    <View style={[styles.bubbleContainer, isCurrentUser ? styles.rightAlign : styles.leftAlign]}>
      {/* Solo mostramos el avatar si no es el mensaje del usuario actual */}
      {!isCurrentUser && <Avatar name={name} />}
      <View style={styles.messageContent}>
        {/* Solo mostramos el nombre si no es el mensaje del usuario actual */}
        {!isCurrentUser && (
          <Text style={[styles.name, { color: nameColor }]}>{name}</Text>
        )}
        {/* Burbuja del mensaje con color dinámico */}
        <View style={[styles.bubble, { backgroundColor: bubbleColor }]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        {/* Hora con color dinámico */}
        <Text style={[styles.time, { color: timeColor }]}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: 'row',
    maxWidth: '70%',
    marginVertical: 5,
  },
  bubble: {
    padding: 10,
    borderRadius: 20,
  },
  messageContent: {
    flexDirection: 'column',
  },
  leftAlign: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  rightAlign: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse', // Para alinear el avatar a la derecha
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  name: {
    fontSize: 12,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    marginTop: 3,
    alignSelf: 'flex-start',
  },
});

export default ChatBubble;
