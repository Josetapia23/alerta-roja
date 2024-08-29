import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, userName }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}></TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>{title}</Text>
        {userName && <Text style={styles.userNameText}>{userName}</Text>}
      </View>
      <Icon name="user" size={30} color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userNameText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default Header;
