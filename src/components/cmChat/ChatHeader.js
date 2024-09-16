import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos para la flecha de retroceso

const ChatHeader = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Botón para volver atrás */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon} />
        </TouchableOpacity>
        
        {/* Título del chat */}
        <Text style={styles.title}>Chat comunidad</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,  // Para Android agregamos espacio adicional
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228, 228, 228, 0.83)',
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Poppins',
  },
});

export default ChatHeader;
