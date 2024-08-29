// components/TabSwitcher.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TabSwitcher = ({ isLogin, setIsLogin, setRole }) => {
  const switchToLogin = () => {
    setIsLogin(true);
    setRole(null); // Reinicia el estado de role a null al cambiar a modo login
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setRole(null); // Reinicia el estado de role a null al cambiar a modo registro
  };

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, isLogin ? styles.activeTab : null]}
        onPress={switchToLogin}
      >
        <Text style={styles.tabText}>Acceso</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, !isLogin ? styles.activeTab : null]}
        onPress={switchToRegister}
      >
        <Text style={styles.tabText}>Registro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  tab: {
    padding: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#EB2525',
  },
  tabText: {
    fontSize: 18,
    color: '#EB2525',
  },
});

export default TabSwitcher;
