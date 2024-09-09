// services/location.js
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from './credenciales';

// Solicitar permisos de ubicación
export const requestLocationPermission = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permisos para acceder a la ubicación fueron denegados');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error al solicitar permisos de ubicación: ', error);
    return false;
  }
};

// Obtener la ubicación actual del dispositivo
export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (location && location.coords) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } else {
      console.error('Error: No se pudo obtener las coordenadas de la ubicación.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la ubicación: ', error);
    return null;
  }
};

// Enviar la ubicación actual a Firestore
export const sendLocationToFirestore = async (location) => {
  try {
    const user = auth.currentUser;
    if (user && location && location.latitude && location.longitude) {
      const locationRef = doc(firestore, 'locations', user.uid);
      await setDoc(locationRef, {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date(),
      });
      console.log('Ubicación enviada a Firestore');
    } else {
      console.error('Error: No se pudo enviar la ubicación a Firestore. Datos incompletos.');
    }
  } catch (error) {
    console.error('Error al enviar la ubicación a Firestore: ', error);
  }
};
