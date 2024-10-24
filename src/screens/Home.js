import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Import correct methods
import BottomNavigation from '../components/BottomNavigation';
import Header from '../components/Header';
import { getCurrentLocation, requestLocationPermission } from '../services/location'; // Modificamos la función de ubicación
import CustomAlert from '../components/CustomAlert';
import ConfirmationAlert from '../components/ConfirmationAlert';
import PanicButton from '../components/PanicButton';
import axios from 'axios';
import { auth, firestore } from '../services/credenciales';

const Home = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmService, setConfirmService] = useState('');
  const [solicitudId, setSolicitudId] = useState(null); // Almacenar la ID de la solicitud

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(`${userData.nombres}`);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserName();

    const interval = setInterval(async () => {
      const location = await getCurrentLocation();
      if (location && solicitudId) {
        // Actualizar la ubicación de la solicitud existente
        await updateDoc(doc(firestore, 'locations', solicitudId), {
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    }, 5000); // Enviar ubicación cada 5 segundos
  
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [solicitudId]);

  // Función para obtener los tokens de los agentes de seguridad
  const fetchSecurityAgentTokens = async () => {
    try {
      const agentsRef = collection(firestore, 'users'); // Cambia esto
      const q = query(agentsRef, where('role', '==', 'Agente de Seguridad'));
      const querySnapshot = await getDocs(q);
  
      const tokens = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log('Usuario:', userData);  // Verifica los datos de cada usuario
        if (userData.fcmToken) {  
          tokens.push(userData.fcmToken);  
        }
      });
  
      console.log('Tokens obtenidos:', tokens);  // Verifica que los tokens estén siendo obtenidos
      return tokens;
    } catch (error) {
      console.error('Error al obtener los tokens:', error);
      return [];
    }
  };
  
  

  const testFirestoreConnection = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    } catch (error) {
      console.error('Error al conectar con Firestore:', error);
    }
  };
  
  useEffect(() => {
    testFirestoreConnection();
  }, []);
  
  const handlePanicButtonPress = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setAlertMessage('No se pudieron obtener los permisos de ubicación. Activa la ubicación y vuelve a intentarlo.');
        setAlertVisible(true);
        return;
      }
  
      const location = await getCurrentLocation();
      
      if (location && location.latitude && location.longitude) {
        const user = auth.currentUser;
        const newSolicitudRef = doc(firestore, 'locations', user.uid);
        await setDoc(newSolicitudRef, {
          userId: user.uid,
          latitude: location.latitude,
          longitude: location.longitude,
          status: 'pendiente',
          timestamp: new Date(),
        });
        setSolicitudId(user.uid);
  
        // Obtenemos los tokens de los agentes de seguridad
        const tokens = await fetchSecurityAgentTokens();
        
        if (tokens.length === 0) {
          console.error('No se encontraron tokens de agentes de seguridad.');
          setAlertMessage('No se pudo enviar la alerta. No hay agentes de seguridad disponibles.');
          setAlertVisible(true);
          return;
        }
  
        // Preparar los datos para el backend
        const requestBody = {
          title: 'Solicitud de Ayuda',
          body: 'Un ciudadano ha solicitado ayuda.',
          tokens: tokens, // Pasamos los tokens obtenidos
        };
  
        console.log('Request body being sent:', requestBody); // Depurar la solicitud
  
        // Enviar solicitud al backend
        try {
          await axios.post('http://10.1.81.70:3000/send-help-alert', requestBody);
          setAlertMessage('Solicitaste ayuda. Tu ubicación ha sido enviada a las autoridades.');
          setAlertVisible(true);
        } catch (error) {
          console.error('Error al enviar la solicitud al backend:', error.response ? error.response.data : error.message);
          setAlertMessage('Se produjo un error al enviar la solicitud.');
          setAlertVisible(true);
        }
      } else {
        setAlertMessage('No se pudo obtener la ubicación. Inténtalo de nuevo.');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Error al enviar la ubicación:', error.message);
      setAlertMessage('Se produjo un error al enviar su ubicación. Inténtalo de nuevo.');
      setAlertVisible(true);
    }
  };
  

  const handleEmergencyCall = (service) => {
    setConfirmService(service);
    setConfirmVisible(true);
  };

  const confirmEmergencyCall = () => {
    let phoneNumber = '';
    switch (confirmService) {
      case 'Bomberos':
        phoneNumber = '119'; // Reemplaza con el número de emergencia para bomberos
        break;
      case 'Ambulancia':
        phoneNumber = '125'; // Reemplaza con el número de emergencia para ambulancia
        break;
      case 'Tránsito':
        phoneNumber = '126'; // Reemplaza con el número de emergencia para tránsito
        break;
      default:
        return;
    }
    setConfirmVisible(false);
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMarkAsAttended = async () => {
    try {
      if (solicitudId) {
        await updateDoc(doc(firestore, 'locations', solicitudId), {
          status: 'atendida', // Cambiamos el estado a "atendida"
        });
        setAlertMessage('La solicitud ha sido marcada como atendida.');
        setAlertVisible(true);
        setSolicitudId(null); // Limpiamos la solicitud después de ser atendida
      }
    } catch (error) {
      console.error('Error al marcar la solicitud como atendida:', error);
      setAlertMessage('Hubo un problema al marcar la solicitud como atendida.');
      setAlertVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/fondoLogin.png')} style={styles.backImage} />
      <View style={styles.bottomEllipse}></View>
      <Header title="Bienvenido," userName={userName} />
       <View style={styles.conteneAlert}>
        <PanicButton onPress={handlePanicButtonPress} size={250} />
      </View>
      {solicitudId && (
        <TouchableOpacity style={styles.attendedButton} onPress={handleMarkAsAttended}>
          <Text style={styles.attendedButtonText}>Marcar como Atendida</Text>
        </TouchableOpacity>
      )}
      <View style={styles.emergencyContainer}>
        <Text style={styles.emergencyText}>Llamadas de Emergencias</Text>
        <View style={styles.emergencyButtons}>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => handleEmergencyCall('Bomberos')}>
            <Image source={require('../../assets/bomberos.png')} style={styles.emergencyIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => handleEmergencyCall('Ambulancia')}>
            <Image source={require('../../assets/ambulancia.png')} style={styles.emergencyIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => handleEmergencyCall('Tránsito')}>
            <Image source={require('../../assets/transito.png')} style={styles.emergencyIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <BottomNavigation navigation={navigation} />
      <CustomAlert
        visible={alertVisible}
        title="Información"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <ConfirmationAlert
        visible={confirmVisible}
        service={confirmService}
        onConfirm={confirmEmergencyCall}
        onCancel={() => setConfirmVisible(false)}
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
    backgroundColor: '#FA5353',
    borderRadius: 200,
  },
  conteneAlert: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10%',
  },
  emergencyContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  emergencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AE2525',
  },
  emergencyButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  emergencyButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  emergencyIcon: {
    width: 100,
    height: 100,
  },
  attendedButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  attendedButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Home;
