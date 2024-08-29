// components/SocialButtons.js
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const SocialButtons = () => (
  <View style={styles.socialButtonsContainer}>
    <TouchableOpacity style={styles.socialButton}>
      <Image source={require('../../assets/google.png')} style={styles.socialIcon} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.socialButton}>
      <Image source={require('../../assets/apple.png')} style={styles.socialIcon} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  socialButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});

export default SocialButtons;
