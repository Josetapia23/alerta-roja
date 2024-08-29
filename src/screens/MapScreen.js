import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Solicitud from '../components/Solicitud';
import { collection, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { firestore } from '../services/credenciales';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

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
          if (data.latitude && data.longitude) {
            const citizenName = await fetchCitizenName(doc.id); // Suponiendo que el ID del documento es el userId
            return {
              id: doc.id,
              descripcion: 'Solicitud de ayuda',
              ciudadano: citizenName,
              color: '#FF0000',
              latitude: data.latitude,
              longitude: data.longitude,
            };
          }
          console.warn('Datos incompletos para el documento:', data);
          return null;
        }));
        const filteredSolicitudes = solicitudesData.filter(solicitud => solicitud !== null);
        console.log('Solicitudes después de filtrar:', filteredSolicitudes);
        setSolicitudes(filteredSolicitudes);
      });

      return () => unsubscribe();
    }
  }, [hasLocationPermission]);

  const handlePressSolicitud = (id) => {
    console.log('Solicitud presionada:', id);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.96854,
          longitude: -74.78132,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {solicitudes.map(solicitud => (
          solicitud && (
            <Marker
              key={solicitud.id}
              coordinate={{ latitude: solicitud.latitude, longitude: solicitud.longitude }}
              title={solicitud.descripcion}
              description={solicitud.ciudadano}
              pinColor={solicitud.color}
            />
          )
        ))}
      </MapView>
      <View style={styles.solicitudesContainer}>
        <FlatList
          data={solicitudes}
          renderItem={({ item }) => (
            <Solicitud solicitud={item} onPress={() => handlePressSolicitud(item.id)} />
          )}
          keyExtractor={item => item.id}
        />
      </View>
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
});

export default MapScreen;
