import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getAuth } from 'firebase/auth';
import { signOut } from 'firebase/auth'; 

const ProfileEditorPage: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string>('https://media.licdn.com/dms/image/v2/D5603AQHdC0RAcIH2mA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698160153100?e=2147483647&v=beta&t=2uYMCVYQBGMLnJLzO9Z7Xk0PSm1r7sPgdLW9OZB98XA');
  const [username, setUsername] = useState('JohnDoe'); 
  const [name, setName] = useState('John Doe');
  const [email] = useState('johndoe@example.com');
  const [password, setPassword] = useState('********');
  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth(); 
  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        if (isEditing) {
          e.preventDefault();
          Alert.alert(
            'Discard changes?',
            'You have unsaved changes. Are you sure you want to leave?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
            ]
          );
        }
      };

      const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);

      return () => {
        unsubscribe();
      };
    }, [isEditing, navigation])
  );

  const handleSaveAndNavigate = () => {
    if (isEditing) {
      Alert.alert(
        'Save changes?',
        'You have unsaved changes. Please save them before leaving.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: () => {
            setIsEditing(false);
            Toast.show({
              type: 'successToast',
              text1: 'Profile Updated',
              text2: 'Your profile has been updated successfully.',
            });
            setTimeout(() => {
              navigation.goBack();
            }, 2000);
          }},
        ]
      );
    } else {
      Toast.show({
        type: 'successToast',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
      });
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  };

  const handleEditToggle = () => {
    Toast.show({
      type: 'infoToast', 
      text1: isEditing ? 'Edit Mode Disabled' : 'Edit Mode Enabled',
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Toast.show({
        type: 'infoToast',
        text1: 'Logged Out',
        text2: 'You have been logged out successfully.',
      });
      navigation.navigate(Login);
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Logout Error',
        text2: error.message,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.profilePhotoContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
              <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                <EvilIcons name="pencil" size={35} color={Colors.Background_Color} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[
                styles.input,
                isEditing ? styles.editingInput : styles.defaultInput,
              ]}
              value={username}
              onChangeText={setUsername}
              editable={isEditing}
              placeholder="Enter your Username"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[
                styles.input,
                isEditing ? styles.editingInput : styles.defaultInput,
              ]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.fixedText}>{email}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                isEditing ? styles.editingInput : styles.defaultInput,
              ]}
              value={password}
              onChangeText={setPassword}
              editable={isEditing}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonSave} onPress={handleSaveAndNavigate}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonEdit} onPress={handleEditToggle}>
              <Text style={styles.buttonText}>
                <Feather name="edit" size={25} color={Colors.Background_Color} />
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.LogoutButtonContainer} onPress={handleLogout}>
            <Text style={styles.LogoutText}>
              <Feather name="log-out" size={25} color={Colors.Background_Color} style={styles.LogoutIcon} />
              Logout
            </Text>
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
    backgroundColor: '#17a2b8', 
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: '#ffffff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSubText: {
    color: '#ffffff',
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
    position: 'relative',
    bottom: 0,
    left : 85,
    right: 0,
    top : -40,
    width : 55,
    padding : 7,
    backgroundColor: Colors.Dark_Teal,
    borderRadius: 50,
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
    paddingHorizontal : 15,
    height: 60,
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 15,

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
    flex : 1,
    backgroundColor: Colors.Teal,
    marginBottom: 20,
    width: 100,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent : 'center',
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
  defaultInput: {
    backgroundColor: Colors.Teal,
    color: '#ffffff',
  },
  editingInput: {
    backgroundColor: Colors.Pale_Teal,
    color: 'darkgreen',
  },
  LogoutButtonContainer : {
    backgroundColor: Colors.Teal,
    marginBottom: 20,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent : 'space-evenly'
  },
  LogoutText : {
    fontSize : 20,
    fontFamily: fonts.PoppinsSemiBold,
    color : Colors.Text_Color,
    paddingLeft : 10,
  },
  LogoutIcon : {
  }
});

export default ProfileEditorPage;
