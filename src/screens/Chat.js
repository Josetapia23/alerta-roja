import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../services/credenciales';
import MessageInput from '../components/cmChat/MessageInput';
import ChatHeader from '../components/cmChat/ChatHeader';
import ChatBubble from '../components/cmChat/ChatBubble';
import DateSeparator from '../components/cmChat/DateSeparator'; 

const Chat = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [messages, setMessages] = useState([]);
  const [currentUserName, setCurrentUserName] = useState('');

  // Obtener el nombre actual del usuario desde Firebase (Firestore)
  const fetchCurrentUserName = async () => {
    const userId = auth.currentUser.uid;
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setCurrentUserName(userData.nombres || 'Usuario');
    } else {
      setCurrentUserName('Usuario');
    }
  };

  useEffect(() => {
    fetchCurrentUserName();
  }, []);

  // Función para obtener mensajes desde Firebase
  useEffect(() => {
    const messagesRef = collection(firestore, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [groupId]);

  // Función para enviar un mensaje
  const sendMessage = async (inputText) => {
    if (inputText.trim().length > 0) {
      const { uid, displayName } = auth.currentUser;
  
      // Recuperar la información del usuario desde Firebase
      const userDoc = await getDoc(doc(firestore, 'users', uid));
      let name = displayName || 'Usuario';
      let role = 'Ciudadano'; // Valor por defecto
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        name = userData.nombres || displayName || 'Usuario'; // Asegurarse de que el nombre esté presente
        role = userData.role || 'Ciudadano'; // Recuperar el rol del usuario
      }
  
      // Enviar el mensaje con el nombre y el rol correcto
      await addDoc(collection(firestore, 'groups', groupId, 'messages'), {
        text: inputText,
        createdAt: new Date(),
        user: {
          _id: uid,
          name: name,
          role: role,
        },
      });
    }
  };

  // Función para renderizar cada mensaje y añadir el separador de fecha cuando cambie
  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.user._id === auth.currentUser.uid;
  
    const formattedTime = item.createdAt?.seconds
      ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString()
      : '';

    // Obtener la fecha del mensaje actual
    const currentMessageDate = item.createdAt?.seconds
      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
      : '';
    
    // Obtener la fecha del mensaje anterior, si existe
    const previousMessageDate = index < messages.length - 1
      ? new Date(messages[index + 1].createdAt.seconds * 1000).toLocaleDateString()
      : null;

    return (
      <View>
        {/* Mostrar el separador si la fecha del mensaje actual es distinta a la del anterior */}
        {currentMessageDate !== previousMessageDate && <DateSeparator date={currentMessageDate} />}
        
        {/* Renderizar la burbuja del mensaje */}
        <ChatBubble
          message={item.text}
          isCurrentUser={isCurrentUser}
          name={item.user.name || 'Usuario'} // Asegurarse de que el nombre esté presente
          time={formattedTime}
          role={item.user.role || 'Ciudadano'} // Asegurarse de que el rol esté presente
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Aquí llamamos al header personalizado */}
      <ChatHeader navigation={navigation} />

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted // Para mostrar los mensajes más recientes al final
      />

      {/* Componente de entrada de mensaje */}
      <MessageInput onSend={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default Chat;
