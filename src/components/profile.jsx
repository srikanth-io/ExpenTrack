import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const Profile = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQHdC0RAcIH2mA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698160153100?e=2147483647&v=beta&t=2uYMCVYQBGMLnJLzO9Z7Xk0PSm1r7sPgdLW9OZB98XA' }} 
        style={styles.profileImage}
      />
      <Text style={styles.profileText}>Profile</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 60, 
    marginBottom: 20,
    borderWidth : 5,
    padding : 15,
    borderColor : 'white'
  },
  profileText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
