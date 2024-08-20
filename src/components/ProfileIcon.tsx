import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ProfileIcon = () => {
    const navigation = useNavigation();

  return (
    <View >
    <TouchableOpacity style={styles.outlineWrapper} onPress={() => navigation.navigate('ProfileEditorPage' as never)}>
      <Image
        source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQHdC0RAcIH2mA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698160153100?e=2147483647&v=beta&t=2uYMCVYQBGMLnJLzO9Z7Xk0PSm1r7sPgdLW9OZB98XA' }}
        style={styles.profileImage}
      />
    </TouchableOpacity>
    </View>
  )
}

export default ProfileIcon

const styles = StyleSheet.create({
    outlineWrapper: {
        padding: 5,
        borderRadius: 62,
        borderWidth: 2,
        borderColor: Colors.Pale_Teal,
        height: 45,
        width: 45,
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
})