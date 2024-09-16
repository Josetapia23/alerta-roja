import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = ({ name }) => {
  const initial = name.charAt(0).toUpperCase(); // Toma la inicial del nombre

  return (
    <View style={styles.avatarContainer}>
      <Text style={styles.avatarText}>{initial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D8D8D8', // Color gris claro como fondo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#383737',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Avatar;
