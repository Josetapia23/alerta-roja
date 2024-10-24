import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, onSnapshot, getDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../services/credenciales';
import Solicitud from '../components/Solicitud';
import * as Location from 'expo-location';
import { Swipeable } from 'react-native-gesture-handler';
import AtenderSoli from '../components/AtenderSoli'; // Importamos la alerta personalizada
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native'; 


const MapScreen = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const mapRef = useRef(null);
  const swipeableRef = useRef(null); // Referencia para cerrar Swipeable
  const navigation = useNavigation();
  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permisos de ubicación denegados');
        return;
      }
      setHasLocationPermission(true);
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const fetchCitizenName = async (userId) => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData.nombres;
        } else {
          console.warn('No se encontró el documento del usuario con ID:', userId);
          return 'Ciudadano';
        }
      } catch (error) {
        console.error('Error fetching citizen name:', error);
        return 'Ciudadano';
      }
    };

    if (hasLocationPermission) {
      const unsubscribe = onSnapshot(collection(firestore, 'locations'), async (snapshot) => {
        const solicitudesData = await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();
          if (data.latitude && data.longitude && data.status !== 'atendida') { // Filtrar las solicitudes no atendidas
            const citizenName = await fetchCitizenName(doc.id);
            return {
              id: doc.id,
              descripcion: 'Solicitud de ayuda',
              ciudadano: citizenName,
              color: '#FF0000',
              latitude: data.latitude,
              longitude: data.longitude,
              status: data.status,
            };
          }
          return null;
        }));
        const filteredSolicitudes = solicitudesData.filter(solicitud => solicitud !== null);
        setSolicitudes(filteredSolicitudes);
      });

      return () => unsubscribe();
    }
  }, [hasLocationPermission]);

  const handlePressSolicitud = (id) => {
    const solicitud = solicitudes.find(solicitud => solicitud.id === id);
    if (solicitud) {
      mapRef.current.animateToRegion({
        latitude: solicitud.latitude,
        longitude: solicitud.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleAtenderSolicitud = async (id) => {
    try {
      const solicitudRef = doc(firestore, 'locations', id);
      await updateDoc(solicitudRef, { status: 'atendida' });
      Alert.alert('Solicitud atendida', 'La solicitud ha sido marcada como atendida.');
      setAlertVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al marcar la solicitud como atendida.');
    }
  };

  const confirmAtenderSolicitud = (id) => {
    setSolicitudSeleccionada(id);
    setAlertVisible(true);
  };

  const onCancelAtender = () => {
    // Si el usuario cancela, cerrar el Swipeable
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    setAlertVisible(false);
  };

  // Renderiza la acción de deslizar hacia la derecha
  const renderRightActions = () => {
    return (
      <View style={styles.rightAction}>
        <Text style={styles.actionText}>Atender</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 10.96854,
          longitude: -74.78132,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {solicitudes.map(solicitud => (
          <Marker
            key={solicitud.id}
            coordinate={{ latitude: solicitud.latitude, longitude: solicitud.longitude }}
            title={solicitud.descripcion}
            description={solicitud.ciudadano}
            pinColor={solicitud.color}
          />
        ))}
      </MapView>
      <View style={styles.solicitudesContainer}>
        <FlatList
          data={solicitudes}
          renderItem={({ item }) => (
            <Swipeable
              ref={swipeableRef} // Referencia para cerrar Swipeable si se cancela
              renderRightActions={() => renderRightActions(item.id)}
              onSwipeableRightOpen={() => confirmAtenderSolicitud(item.id)}
            >
              <Solicitud solicitud={item} onPress={() => handlePressSolicitud(item.id)} />
            </Swipeable>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <AtenderSoli
        visible={alertVisible}
        onConfirm={() => handleAtenderSolicitud(solicitudSeleccionada)}
        onCancel={onCancelAtender}
      />
      <BackButton onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  solicitudesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  rightAction: {
    backgroundColor: '#28A745',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 20,
  },
});

export default MapScreen;
