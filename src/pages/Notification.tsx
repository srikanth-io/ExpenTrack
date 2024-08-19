import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, ReactNode } from 'react';
import Toast from 'react-native-toast-message';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Example: Adding a welcome notification on load
    addNotification('Welcome! Your balance is updated.');
  }, []);

  const addNotification = (message: string) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date(),
    };
    setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
    showInAppNotification(message);
  };

  const showInAppNotification = (message: any) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'top', // Customize the toast position if needed
      visibilityTime: 4000, // Customize how long the toast is visible
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item: {
            message: ReactNode;
            timestamp: any; id: { toString: () => any; }; 
}) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>{item.timestamp.toLocaleString()}</Text>
          </View>
        )}
      />
      <Toast ref={(ref: any) => Toast.setRef(ref)} />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  message: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
