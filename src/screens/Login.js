import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Image, TouchableOpacity, Text, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../services/credenciales';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderComLog from '../components/HaderComLog';
import TabSwitcher from '../components/TabSwitcher';
import InputField from '../components/InputField';
import RoleSelector from '../components/RoleSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';
import { sendPasswordResetEmail } from 'firebase/auth';
import messaging from '@react-native-firebase/messaging';



const Login = ({ navigation }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isLogin) {
        setPassword('');
        setConfirmPassword('');
      }
    });
    return unsubscribe;
  }, [navigation, isLogin]);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Error loading email from AsyncStorage', error);
      }
    };
    loadEmail();
  }, []);

  // Función para obtener el token del dispositivo
  const getDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('Token de dispositivo obtenido:', token);
      return token;
    } catch (error) {
      console.error('Error obteniendo el token de notificaciones:', error);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAlertMessage('Por favor ingresa tu correo y contraseña.');
      setAlertVisible(true);
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Obtener el token del dispositivo
      const fcmToken = await getDeviceToken();
  
      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
      } else {
        await AsyncStorage.removeItem('email');
      }
  
      // Obtener el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();
      const userRole = userData?.role;
  
      // Actualizar el token del usuario en la base de datos
      await setDoc(doc(firestore, 'users', user.uid), {
        fcmToken: fcmToken,  // Guardar el token
      }, { merge: true });
  
      if (userRole === 'Agente de Seguridad') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeAgente' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage('El Usuario o Contraseña son incorrectos');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleContinue = () => {
    if (role) {
      alert(`Continuar como ${role}`);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !nombres.trim() || !apellidos.trim() || !telefono.trim()) {
      setAlertMessage('Por favor rellena todos los campos');
      setAlertVisible(true);
      return;
    }
  
    // Validaciones adicionales omitidas por brevedad...
    
    setIsLoading(true);
    try {
      if (role === 'Agente de Seguridad') {
        const docRef = doc(firestore, 'agentes_seguridad', identificacion.trim());
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setAlertMessage('El número de identificación no es válido');
          setAlertVisible(true);
          setIsLoading(false);
          return;
        }
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;
  
      // Obtener el token del dispositivo
      const fcmToken = await getDeviceToken();
  
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        telefono: telefono.trim(),
        identificacion: role === 'Agente de Seguridad' ? identificacion.trim() : null,
        role: role,
        fcmToken: fcmToken,  // Guardar el token
      });
  
      // Redirigir a la vista correspondiente según el rol
      setAlertMessage('Registro exitoso. Usuario registrado correctamente');
      setAlertVisible(true);
  
      if (role === 'Agente de Seguridad') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeAgente' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage('No se pudo registrar el usuario');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setAlertMessage('Por favor ingresa tu correo electrónico');
      setAlertVisible(true);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setAlertMessage('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
      setAlertVisible(true);
      setShowResetPassword(false);
    } catch (error) {
      setAlertMessage('Hubo un error al enviar el correo de restablecimiento');
      setAlertVisible(true);
      console.log(error);
    }
  };


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/fondoLogin.png')} style={styles.backImage} />
      <HeaderComLog />
      <View style={styles.loginContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TabSwitcher isLogin={isLogin} setIsLogin={setIsLogin} setRole={setRole} />
          {isLogin ? (
            <>
              <InputField
                icon="envelope"
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <InputField
                icon="lock"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <View style={styles.rememberMeContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkedCheckbox]}>
                    {rememberMe && <Icon name="check" size={16} color="#FFF" />}
                  </View>
                  <Text style={styles.rememberMeText}>Recordar mi usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowResetPassword(true)}>
                  <Text style={styles.forgotPasswordText}>¿Contraseña olvidada?</Text>
                </TouchableOpacity>

              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button mode="contained" onPress={handleLogin} style={styles.loginButton} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : 'Ingresar'}
              </Button>

            </>

          ) : (
            <>
              {!role ? (
                <RoleSelector role={role} setRole={setRole} handleContinue={handleContinue} />
              ) : (
                <>
                  <InputField
                    icon="user"
                    placeholder="Nombre"
                    value={nombres}
                    onChangeText={setNombres}
                  />
                  <InputField
                    icon="user"
                    placeholder="Apellido"
                    value={apellidos}
                    onChangeText={setApellidos}
                  />
                  <InputField
                    icon="phone"
                    placeholder="Telefono"
                    value={telefono}
                    onChangeText={(text) => {
                      // Asegura que el valor solo contenga números y tenga un máximo de 10 caracteres
                      const formattedText = text.replace(/[^0-9]/g, '');
                      if (formattedText.length <= 10) {
                        setTelefono(formattedText); // Actualiza el estado solo si el número es de 10 dígitos o menos
                      }
                    }}
                    keyboardType="numeric" // Define el teclado numérico
                    maxLength={10} // Limita el máximo a 10 caracteres
                  />

                  <InputField
                    icon="envelope"
                    placeholder="Correo"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                  <InputField
                    icon="lock"
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <InputField
                    icon="lock"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  {role === 'Agente de Seguridad' && (
                    <InputField
                      icon="id-badge"
                      placeholder="Número de licencia."
                      value={identificacion}
                      onChangeText={setIdentificacion}
                    />
                  )}
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                  <Button mode="contained" onPress={handleRegister} style={styles.loginButton} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#FFF" /> : 'Registrar'}
                  </Button>
                </>
              )}
            </>
          )}
        </ScrollView>
        {showResetPassword && (
          <CustomAlert
            visible={showResetPassword}
            title="Recuperar Contraseña"
            message="Ingresa tu correo para recibir un enlace de restablecimiento de contraseña."
            onClose={() => setShowResetPassword(false)}
            showOkButton={false} // Oculta el botón OK
            showCloseButton={true} // Muestra el botón de cerrar (X)
          >
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
            />
            <Button mode="contained" onPress={handlePasswordReset} style={styles.resetButton}>
              Enviar correo
            </Button>
          </CustomAlert>
        )}
      </View>
      <CustomAlert
        visible={alertVisible}
        title="Información"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '50%',
    zIndex: -1,
  },
  loginContainer: {
    flex: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    marginTop: -40,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: '#EB2525',
  },
  rememberMeText: {
    fontSize: 14,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#EB2525',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: '#EB2525',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: '#EB2525',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default Login;
