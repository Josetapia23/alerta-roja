import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const getIconColor = (screenName) => {
    return route.name === screenName ? "#AE2525" : "#000000"; // Cambia el color si la ruta coincide
  };

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons
          name="home-outline"
          size={30}
          color={getIconColor('Home')}
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
        onPress={() => navigation.navigate('Alert')}
      >
        <Ionicons
          name="notifications-outline"
          size={30}
          color={getIconColor('Alert')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Ajustes')}
      >
        <Ionicons
          name="settings-outline"
          size={30}
          color={getIconColor('Ajustes')}
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
