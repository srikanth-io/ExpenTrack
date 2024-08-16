import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

type CustomTabBarButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
};

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: Colors.Background_Color,
    width: 70,
    height: 70,
    elevation: 5, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default CustomTabBarButton;
