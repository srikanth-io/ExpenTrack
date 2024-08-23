import React from 'react';
import { View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import Toast from 'react-native-toast-message';

// Define the custom toast styles
const customStyles = StyleSheet.create({
  successToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  errorToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  infoToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#17a2b8',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  toastSubText: {
    color: '#fff',
    fontSize: 14,
  } as TextStyle,
});

// Define the Toast configuration types
interface ToastProps {
  text1: string;
  text2?: string;
}

// Toast configuration
export const toastConfig: Toast.Config = {
  successToast: ({ text1, text2 }: ToastProps) => (
    <View style={customStyles.successToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  errorToast: ({ text1, text2 }: ToastProps) => (
    <View style={customStyles.errorToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  infoToast: ({ text1, text2 }: ToastProps) => (
    <View style={customStyles.infoToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
};

export default toastConfig;
