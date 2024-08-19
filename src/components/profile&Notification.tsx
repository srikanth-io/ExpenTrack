import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import Notification from '../pages/Notification';
  
  const Profile = () => {
    const navigation = useNavigation();
    return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.outlineWrapper} onPress={() => navigation.navigate('ProfileEditorPage')}>
        <Image
          source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQHdC0RAcIH2mA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698160153100?e=2147483647&v=beta&t=2uYMCVYQBGMLnJLzO9Z7Xk0PSm1r7sPgdLW9OZB98XA' }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Notification')}>
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
    borderColor: Colors.Teal,
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 37,
    height: 37,
    borderRadius: 20, 
    borderColor: Colors.Dark_Teal,
    borderWidth: 2,
  },
  iconContainer : {
  }
});
