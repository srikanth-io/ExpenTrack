import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Platform, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileEditorPage: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string>('https://via.placeholder.com/150');
  const [username] = useState('JohnDoe'); 
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('********');
  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();

  const handleSave = () => {
    Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow permission to access the media library.');
      return;
    }

    // Open image picker
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
    navigation.navigate('BalanceManager');
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
            {isEditing ? (
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleEditToggle}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={navigateToBalanceManager}>
            <Text style={styles.buttonText}>Add Balance</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
