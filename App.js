import React, { useEffect } from 'react';
import { requestNotificationPermission, getDeviceToken, setupNotificationListeners } from './src/services/notificaciones';
import { auth, firestore } from './src/services/credenciales';
import { doc, setDoc } from 'firebase/firestore'; 
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const initializeFirebaseMessaging = async () => {
      const permissionGranted = await requestNotificationPermission(); // Solicitar permisos
      if (permissionGranted) {
        const token = await getDeviceToken(); // Obtener token del dispositivo

        // Solo guardar el token si el usuario está autenticado
        if (auth.currentUser) {
          const userRef = doc(firestore, 'users', auth.currentUser.uid); 
          
          // Actualiza o guarda el token en el documento del usuario en Firestore
          await setDoc(userRef, { notificationToken: token }, { merge: true });
          console.log('Token de notificación guardado en Firestore.');
        }
      }
      setupNotificationListeners(); 
    };

    initializeFirebaseMessaging();
  }, []);

  return <AppNavigator />;
}
