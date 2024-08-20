import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function NotifyIcons() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity onPress={() => {
        navigation.navigate('Notification' as never);
        console.log("Error")
      }}>
        
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

});

