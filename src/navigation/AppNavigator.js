import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../services/credenciales';
import { doc, getDoc } from 'firebase/firestore';
import SplashScreen from '../screens/SplashScreen';
import Home from '../screens/Home';
import Chat from '../screens/Chat';
import Login from '../screens/Login';
import Ajustes from '../screens/Ajustes';
import HomeAgente from '../screens/HomeAgente';
import MapScreen from '../screens/MapScreen';
import AjustesAgentes from '../screens/AjustesAgentes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtener el rol del usuario desde Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        const userData = userDoc.data();
        const userRole = userData?.role;

        // Guardar el rol del usuario en AsyncStorage
        await AsyncStorage.setItem('role', userRole);

        setUser({ ...user, role: userRole });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Ajustes" component={Ajustes} options={{ headerShown: false }} />
        <Stack.Screen name="HomeAgente" component={HomeAgente} options={{ headerShown: false }} />
        <Stack.Screen name="AjustesAgentes" component={AjustesAgentes} options={{ headerShown: false }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
