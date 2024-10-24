import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

// Solicitar permisos de notificación en iOS
export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) { // Android 13 o superior
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    } else {
      Alert.alert('Permisos de notificación denegados');
      return false;
    }
  } else {
    return true; // No es necesario pedir permisos en versiones anteriores
  }
};

// Obtener el token del dispositivo
export const getDeviceToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('Token de dispositivo obtenido:', token);
    //Alert.alert('Token de dispositivo obtenido', token);
    return token;
  } catch (error) {
    console.error('Error obteniendo el token de notificaciones:', error);
    Alert.alert('Error', 'Error obteniendo el token de notificaciones.');
  }
};

// Manejar notificaciones en segundo plano
export const setupNotificationListeners = () => {
  messaging().onMessage(async remoteMessage => {
    Alert.alert('Una nueva notificación llegó', remoteMessage.notification.body);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Notificación recibida en segundo plano', remoteMessage);
  });
};

export const checkAndRequestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {  // Android 13 y superior
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permisos de notificación otorgados para Android 13+');
          return true;
        } else {
          Alert.alert('Permisos de notificación denegados. No podrás recibir alertas.');
          return false;
        }
      } else {
        console.log('Permisos de notificación ya otorgados para Android 13+');
        return true;
      }
    } else {
      // Para versiones anteriores a Android 13
      return await requestNotificationPermission();  // Utiliza la función existente
    }
  } else if (Platform.OS === 'ios') {
    return await requestNotificationPermission();  // Utiliza la función existente para iOS
  }
};

