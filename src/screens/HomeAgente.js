import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../services/credenciales';
import { doc, getDoc } from 'firebase/firestore';
import NavegacionAgente from '../components/NavegacionAgente';
import Header from '../components/Header';
import FondoAgente from '../components/FondoAgente';
import CustomAlertAget from '../components/CustomAlertAget';
import ConfirmationAlertAget from '../components/ConfirmationAlertAget';


const HomeAgente = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmService, setConfirmService] = useState('');

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
  }, []);

  const handlePanicButtonPress = () => {
    // Logica para el boton de panico
      setAlertMessage('Solicitaste ayuda. Tu ubicación ha sido enviada a las autoridades.');
      setAlertVisible(true);
  };

  const handleEmergencyCall = (service) => {
    setConfirmService(service);
    setConfirmVisible(true);
  };

  const confirmEmergencyCall = (service) => {
    let phoneNumber = '';
    switch (confirmService) {
      case 'Bomberos':
        phoneNumber = '119'; // Reemplaza con el número de emergencia para bomberos
        break;
      case 'Ambulancia':
        phoneNumber = '125'; // Reemplaza con el número de emergencia para ambulancia
        break;
      case 'Policia':
        phoneNumber = '126'; // Reemplaza con el número de emergencia para tránsito
        break;
      default:
        return;
    }
    setConfirmVisible(false);
    Linking.openURL(`tel:${phoneNumber}`);
    
  };

  return (
    <View style={styles.container}>
      {/* Backgrounds */}
      <FondoAgente/>

      <View style={styles.bottomEllipse}></View>

      {/* Header */}
      <Header title="Bienvenido, agente" userName={userName} />

      {/* Panic Button */}
      <View style={styles.conteneAlert}>
        <TouchableOpacity style={styles.panicButton} onPress={handlePanicButtonPress}>
          <Image source={require('../../assets/imgAgentes/refuersos.png')} style={styles.panicIcon} />
        </TouchableOpacity>
      </View>

      {/* Emergency Calls */}
      <View style={styles.emergencyContainer}>
        <Text style={styles.emergencyText}>LLamada De Emergencia</Text>
        <View style={styles.emergencyButtons}>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => handleEmergencyCall('Bomberos')}>
            <Image source={require('../../assets/imgAgentes/bomberAgentes.png')} style={styles.emergencyIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => handleEmergencyCall('Policia')}>
            <Image source={require('../../assets/imgAgentes/policiaAgentes.png')} style={styles.emergencyIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyButton} onPress={() => handleEmergencyCall('Ambulancia')}>
            <Image source={require('../../assets/imgAgentes/ambulanciaAgentes.png')} style={styles.emergencyIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Button to navigate to MapScreen */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mapButton} onPress={() => navigation.navigate('MapScreen')}>
          <Text style={styles.mapButtonText}>Ver Solicitudes de Ayuda</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <NavegacionAgente navigation={navigation} />

      <CustomAlertAget
        visible={alertVisible}
        title="Información"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <ConfirmationAlertAget
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
    backgroundColor: '#063971',
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
    color: '#063971',
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 25,
  },
  mapButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default HomeAgente;
