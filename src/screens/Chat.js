import React, { useEffect, useState, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../services/credenciales';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const { groupId } = route.params;

  useEffect(() => {
    const messagesRef = collection(firestore, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesFirestore = snapshot.docs.map((doc) => {
        const message = doc.data();
        return {
          ...message,
          createdAt: message.createdAt.toDate(),
        };
      });
      setMessages(messagesFirestore);
    });

    return () => unsubscribe();
  }, [groupId]);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    await addDoc(collection(firestore, 'groups', groupId, 'messages'), {
      _id,
      createdAt,
      text,
      user,
    });
  }, [groupId]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.uid,
        name: auth?.currentUser?.displayName,
      }}
    />
  );
};

export default ChatScreen;
