import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../utils/colors';

const Profile = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.outlineWrapper}>
        <Image
          source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQHdC0RAcIH2mA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698160153100?e=2147483647&v=beta&t=2uYMCVYQBGMLnJLzO9Z7Xk0PSm1r7sPgdLW9OZB98XA' }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={28} style = {{color : Colors.Teal}}/>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 8, 
    top : -30,
    right : 10,
  },
  outlineWrapper: {
    padding: 5,
    borderRadius: 62,
    borderWidth: 3,
    borderColor: Colors.Bottom_color,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, 
    borderColor: 'black',
    borderWidth: 2,
  },
});
