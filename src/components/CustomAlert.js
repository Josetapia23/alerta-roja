import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomAlert = ({ visible, title, message, onClose, children, showOkButton = true, showCloseButton = false }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.alertContainer}>
          
          {/* Botón de cierre (X) */}
          {showCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="times" size={20} color="#EB2525" />
            </TouchableOpacity>
          )}

          <Icon name="info-circle" size={24} color="#EB2525" />
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>

          {/* Renderiza el contenido personalizado (children) */}
          {children}

          {/* Renderiza el botón OK solo si showOkButton es true */}
          {showOkButton && (
            <TouchableOpacity onPress={onClose} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative', // Para poder posicionar la "X"
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#EB2525',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default CustomAlert;
