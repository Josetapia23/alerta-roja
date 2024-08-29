import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Solicitud = ({ solicitud, onPress }) => {
  return (
    <TouchableOpacity style={styles.solicitudContainer} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name="exclamation-circle" size={24} color={solicitud.color || '#FF0000'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.solicitudText}>{solicitud.descripcion || 'Solicitud de ayuda'}</Text>
        <Text style={styles.ciudadanoText}>{solicitud.ciudadano || 'Ciudadano'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  solicitudContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  solicitudText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ciudadanoText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Solicitud;
