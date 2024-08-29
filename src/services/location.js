// services/location.js
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from './credenciales';

export const getCurrentLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error('Error getting location: ', error);
  }
};

export const sendLocationToFirestore = async (location) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const locationRef = doc(firestore, 'locations', user.uid);
      await setDoc(locationRef, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error sending location to Firestore: ', error);
  }
};
