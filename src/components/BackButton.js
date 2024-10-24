// components/BackButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <Icon name="arrow-left" size={24} color="#FFF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
});


export default BackButton;
