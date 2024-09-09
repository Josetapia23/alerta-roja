import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../services/credenciales';
import CustomAlert from '../components/CustomAlert';
import AlertSesion from '../components/AlertSesion';
import ConfirmationAlert from '../components/ConfirmationAlert';

const SettingItem = ({ icon, label, description, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemName}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <View style={styles.chevronContainer}>
        <Ionicons name="chevron-forward" size={20} color="#888888" />
      </View>
    </TouchableOpacity>
  );
};

const Ajustes = () => {
  const navigation = useNavigation();
  const [isCustomAlertVisible, setCustomAlertVisible] = useState(false);
  const [isConfirmationAlertVisible, setConfirmationAlertVisible] = useState(false);

  const handleLogout = async () => {
    try {
      setConfirmationAlertVisible(true); // Mostrar alerta de confirmación antes de cerrar sesión
    } catch (error) {
      console.log(error);
      setCustomAlertVisible(true); // Mostrar alerta de error si ocurre un problema
    }
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('email');
      setCustomAlertVisible(true); // Mostrar alerta de éxito después de cerrar sesión
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log(error);
      setCustomAlertVisible(true); // Mostrar alerta de error si ocurre un problema
    }
  };

  const settingsOptions = [
    { icon: 'chatbox-ellipses-outline', label: 'Mensajes Guardados', description: 'Ver tus mensajes guardados', backgroundColor: '#007AFF' },
    { icon: 'call-outline', label: 'Llamadas Recientes', description: 'Revisa tu historial de llamadas', backgroundColor: '#34C759' },
    { icon: 'laptop-outline', label: 'Dispositivos', description: 'Gestiona los dispositivos conectados', backgroundColor: '#8E8E93' },
    { icon: 'notifications-outline', label: 'Notificaciones', description: 'Personaliza tus notificaciones', backgroundColor: '#FF3B30' },
    { icon: 'color-palette-outline', label: 'Apariencia', description: 'Cambia la apariencia de la app', backgroundColor: '#AF52DE' },
    { icon: 'language-outline', label: 'Idioma', description: 'Configura tu idioma preferido', backgroundColor: '#5AC8FA' },
    { icon: 'lock-closed-outline', label: 'Privacidad y Seguridad', description: 'Gestiona la configuración de privacidad', backgroundColor: '#FF9500' },
    { icon: 'folder-outline', label: 'Almacenamiento', description: 'Revisa el uso de tu almacenamiento', backgroundColor: '#FFCC00' },
    { icon: 'exit-outline', label: 'Cerrar sesión', description: 'Salir de tu cuenta', backgroundColor: '#FF3B30', onPress: handleLogout },
  ];

  const chunkArray = (arr, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const groupedSettings = chunkArray(settingsOptions, 4);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#FFF" />
      </TouchableOpacity>
      <Image source={require('../../assets/fondoLogin.png')} style={styles.backImage} />
      <View style={styles.bottomEllipse}></View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Ajustes</Text>
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/image.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>Usuario</Text>
          <Text style={styles.username}>@Usuario</Text>
        </View>
        {groupedSettings.map((group, index) => (
          <View key={index} style={styles.groupContainer}>
            {group.map((option, index) => (
              <SettingItem
                key={index}
                icon={option.icon}
                label={option.label}
                description={option.description}
                backgroundColor={option.backgroundColor}
                onPress={option.onPress}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <BottomNavigation navigation={navigation} />
      <CustomAlert
        visible={isCustomAlertVisible}
        title="Error"
        message="Ocurrió un error. Por favor, inténtalo de nuevo."
        onClose={() => setCustomAlertVisible(false)}
      />
      <CustomAlert
        visible={isCustomAlertVisible}
        title="Éxito"
        message="Has cerrado sesión exitosamente."
        onClose={() => setCustomAlertVisible(false)}
      />
      <AlertSesion
        visible={isConfirmationAlertVisible}
        service="cerrar sesión"
        onConfirm={handleConfirmLogout}
        onCancel={() => setConfirmationAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: (StatusBar.currentHeight || 0) + 60,
  },
  backImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '40%',
    zIndex: -1,
  },
  bottomEllipse: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    left: -92,
    top: '80%',
    backgroundColor: '#FA5353', // Cambia el color según tu diseño
    borderRadius: 200,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff', // Cambia el color según tu diseño
  },
  backButton: {
    position: 'absolute',
    top: 30 + (StatusBar.currentHeight || 0), // Ajusta según sea necesario
    left: 20,
    zIndex: 1,
    padding: 10,
    borderRadius: 50,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Cambia el color según tu diseño
  },
  username: {
    fontSize: 16,
    color: '#fff', // Cambia el color según tu diseño
  },
  groupContainer: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  itemDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  chevronContainer: {
    padding: 8,
  },
});

export default Ajustes;
