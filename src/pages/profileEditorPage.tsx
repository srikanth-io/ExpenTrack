import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const ProfileEditorPage: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string>('https://media.licdn.com/dms/image/v2/D5603AQHdC0RAcIH2mA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698160153100?e=2147483647&v=beta&t=2uYMCVYQBGMLnJLzO9Z7Xk0PSm1r7sPgdLW9OZB98XA');
  const [username] = useState('JohnDoe'); 
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('********');
  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();

  const handleSave = () => {
    Toast.show({
      type: 'successToast',
      text1: 'Profile Updated',
      text2: 'Your profile has been updated successfully.',
    });
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    Toast.show({
      type: 'infoToast',
      text1: 'Edit Mode',
      text2: 'You have enabled edit mode.',
    });
    setIsEditing(!isEditing);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Toast.show({
        type: 'errorToast',
        text1: 'Permission Denied',
        text2: 'You need to allow permission to access the media library.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const navigateToBalanceManager = () => {
    navigation.navigate('BalanceManager' as never);  
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.profilePhotoContainer}>
            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
            <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
              <Feather name="edit" size={24} color={Colors.Background_Color} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.fixedText}>{username}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={isEditing}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              editable={isEditing}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonEdit} onPress={handleEditToggle}>
                <Text style={styles.buttonText}><Feather name="edit" size={25} color={Colors.Background_Color} /></Text>
              </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={navigateToBalanceManager}>
            <Text style={styles.buttonText}>Add Balance</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={toastConfig as any} /> 
    </KeyboardAvoidingView>
  );
};

// Define the custom toast styles outside the component
const toastConfig = {
  successToast: ({ text1, text2 }: { text1: string; text2?: string }) => (
    <View style={customStyles.successToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  errorToast: ({ text1, text2 }: { text1: string; text2?: string }) => (
    <View style={customStyles.errorToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  infoToast: ({ text1, text2 }: { text1: string; text2?: string }) => (
    <View style={customStyles.infoToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
};

const customStyles = StyleSheet.create({
  successToast: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.Light_Teal, 
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorToast: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.Light_Red, 
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#17a2b8', // Blue background for info
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: '#ffffff', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSubText: {
    color: '#ffffff', // White text color for additional information
    fontSize: 14,
  },
  // Other styles...
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_Color,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.Dark_Teal,
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Dark_Teal,
    marginBottom: 5,
  },
  input: {
    height: 55,
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  fixedText: {
    height: 55,
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSave: {
    backgroundColor: Colors.Teal,
    marginBottom: 20,
    width: 270,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: Colors.Teal,
    marginBottom: 20,
    width: 100,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.Teal,
    marginBottom: 20,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 20,
    color: Colors.Background_Color,
  },
});

export default ProfileEditorPage;
