import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { Feather } from '@expo/vector-icons';
import { initializeDatabase, saveExpense } from '../utils/Database/db';
import Balance from '../components/Balance';

const ProfileEditorPage: React.FC = () => {
  const [username] = useState('JohnDoe'); // Fixed value
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('********');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Save functionality goes here
    Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.profilePhotoContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.profilePhoto}
            />
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => Alert.alert('Edit Profile Photo', 'Edit photo functionality not implemented yet.')}
            >
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


          <TouchableOpacity style={styles.button}> 
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
    paddingVertical : 15,
    justifyContent : 'center',
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  buttonContainer: {
    marginTop: 20,
},
button: {
    backgroundColor: Colors.Teal,
    marginBottom : 20,
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
