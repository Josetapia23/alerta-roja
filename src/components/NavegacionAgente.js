

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const getIconColor = (screenName) => {
    return route.name === screenName ? "#007bff" : "#000000"; // Cambia el color si la ruta coincide
  };

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('HomeAgente')}
      >
        <Ionicons
          name="home-outline"
          size={30}
          color={getIconColor('HomeAgente')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Chat', { groupId: 'someGroupId' })}
      >
        <Ionicons
          name="chatbubble-outline"
          size={30}
          color={getIconColor('Chat')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('NotificaAgentes')}
      >
        <Ionicons
          name="notifications-outline"
          size={30}
          color={getIconColor('NotificaAgentes')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('AjustesAgentes')}
      >
        <Ionicons
          name="settings-outline"
          size={30}
          color={getIconColor('AjustesAgentes')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#DDDDDD',
  },
  navButton: {
    alignItems: 'center',
  },
});

export default BottomNavigation;
