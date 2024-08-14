import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.outlineWrapper}>
        <Image
          source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQHdC0RAcIH2mA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698160153100?e=2147483647&v=beta&t=2uYMCVYQBGMLnJLzO9Z7Xk0PSm1r7sPgdLW9OZB98XA' }}
          style={styles.profileImage}
        />
      </View>
      <View>
      <Ionicons name="notifications-outline" size={50} color="white" />     
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'row',
  },
  outlineWrapper: {
    padding: 2,
    borderRadius: 62, 
    borderWidth: 3,
    borderColor: 'white',
    height : 50,
    width : 50,
    alignItems : 'center',
    justifyContent : 'center'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 60,
    borderColor : 'black',
    borderWidth : 2,
  },
});
