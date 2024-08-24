import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NotificationProps {
  type: 'balance' | 'expense' | 'remainingBalance';
  amount: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, amount, onClose }) => {
  let message = '';

  switch (type) {
    case 'balance':
      message = `Balance added: ₹${amount}`;
      break;
    case 'expense':
      message = `Expense added: ₹${amount}`;
      break;
    case 'remainingBalance':
      message = `Remaining balance: ₹${amount}`;
      break;
  }

  return (
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationText}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#444',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ff5c5c',
    borderRadius: 15,
    padding: 5,
    marginLeft: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Notification;
