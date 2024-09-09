import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../services/credenciales';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import BottomNavigation from '../components/BottomNavigation';
import Header from '../components/Header';
import { getCurrentLocation, requestLocationPermission } from '../services/location'; // Modificamos la función de ubicación
import CustomAlert from '../components/CustomAlert';
import ConfirmationAlert from '../components/ConfirmationAlert';

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

  const handlePanicButtonPress = async () => {
    try {
      // Verificar si se tienen los permisos de ubicación
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setAlertMessage('No se pudieron obtener los permisos de ubicación. Activa la ubicación y vuelve a intentarlo.');
        setAlertVisible(true);
        return;
      }

      // Obtener la ubicación actual
      const location = await getCurrentLocation();
      
      if (location && location.latitude && location.longitude) {
        // Crear una nueva solicitud de ayuda en Firestore
        const user = auth.currentUser;
        const newSolicitudRef = doc(firestore, 'locations', user.uid); // Asignamos la solicitud al UID del usuario
        await setDoc(newSolicitudRef, {
          userId: user.uid,
          latitude: location.latitude,
          longitude: location.longitude,
          status: 'pendiente', // Estado inicial "pendiente"
          timestamp: new Date(),
        });
        setSolicitudId(user.uid); // Almacenar la ID de la solicitud
        setAlertMessage('Solicitaste ayuda. Tu ubicación ha sido enviada a las autoridades.');
        setAlertVisible(true);
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
        <TouchableOpacity style={styles.panicButton} onPress={handlePanicButtonPress}>
          <Image source={require('../../assets/botnPanico.png')} style={styles.panicIcon} />
        </TouchableOpacity>
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
  },
  panicButton: {
    marginTop: '10%',
    alignItems: 'center',
  },
  panicIcon: {
    width: 295,
    height: 300,
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
