import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { auth } from '../utils/Auth/fireBaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const Register: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isUsernameFinal, setIsUsernameFinal] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    username?: string | null;
    name?: string | null;
    email?: string | null;
    password?: string | null;
    termsAccepted?: string | null;
  }>({});

  const handleRegister = async () => {
    Toast.hide(); 

    const errorToast: {
      username?: string;
      name?: string;
      email?: string;
      password?: string;
      termsAccepted?: string;
    } = {};

    if (!username && !name && !email && !password && !termsAccepted) {
      Toast.show({
        type: "errorToast", 
        text1: "Input Required",
        text2: "Please fill in all input fields.",
      });
      return;
    }

    if (!username) errorToast.username = "Username is required";
    if (!name) errorToast.name = "Name is required";
    if (!email) errorToast.email = "Email is required";
    if (!password) errorToast.password = "Password is required";
    if (!termsAccepted) errorToast.termsAccepted = "Terms must be accepted";

    // Show individual toast messages
    if (errorToast.username) {
      Toast.show({
        type: 'errorToast',
        text1: 'Validation Error',
        text2: errorToast.username,
      });
    }
    if (errorToast.name) {
      Toast.show({
        type: 'errorToast',
        text1: 'Validation Error',
        text2: errorToast.name,
      });
    }
    if (errorToast.email) {
      Toast.show({
        type: 'errorToast',
        text1: 'Validation Error',
        text2: errorToast.email,
      });
    }
    if (errorToast.password) {
      Toast.show({
        type: 'errorToast',
        text1: 'Validation Error',
        text2: errorToast.password,
      });
    }
    if (errorToast.termsAccepted) {
      Toast.show({
        type: 'errorToast',
        text1: 'Validation Error',
        text2: errorToast.termsAccepted,
      });
    }

    // If any errors are present, return early
    if (Object.keys(errorToast).length > 0) {
      setErrors(errorToast);
      return;
    }

    try {
      // Register the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user profile with the username
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      Toast.show({
        type: 'successToast',
        text1: 'Success',
        text2: 'Registration successful!',
      });

      navigation.navigate('Login'); 
    } catch (error) {
      let errorMessage = 'Registration failed';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }

      Toast.show({
        type: 'errorToast',
        text1: 'Registration Error',
        text2: errorMessage,
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
          <View style={styles.RegisterTextHead}>
            <Text style={styles.RegisterText}>Let's get</Text>
            <Text style={styles.RegisterTextTwo}>Started</Text>
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input }
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prev) => ({ ...prev, username: null }));
              }}
              placeholder="Username"
              editable={!isUsernameFinal}
            />
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="Name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="Password"
              secureTextEntry
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              Agree to Terms and Conditions
            </Text>
            <Switch
              value={termsAccepted}
              onValueChange={(value) => {
                setTermsAccepted(value);
                setErrors((prev) => ({ ...prev, termsAccepted: null }));
              }}
              thumbColor={termsAccepted ? Colors.Teal : Colors.Pale_Teal}
              trackColor={{ false: Colors.Light_Teal, true: Colors.Dark_Teal }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButton}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
};

// Define the custom toast styles outside the component
const toastConfig = {
  successToast: ({ text1, text2 }) => (
    <View style={customStyles.successToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  errorToast: ({ text1, text2 }) => (
    <View style={customStyles.errorToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  infoToast: ({ text1, text2 }) => (
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
    backgroundColor: Colors.Red,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoToast: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.Light_Red,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: Colors.Dark_Teal,
    fontSize: 16,
    fontFamily: fonts.PoppinsMedium,
  },
  toastSubText: {
    color: Colors.Dark_Green,
    fontSize: 14,
    fontFamily: fonts.PoppinsRegular,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: Colors.Background_Color,
  },
  RegisterTextHead: {
    paddingLeft: 5,
  },
  RegisterText: {
    fontSize: 60,
    fontFamily: fonts.PoppinsBold,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Colors.Light_Teal,
  },
  RegisterTextTwo: {
    fontSize: 60,
    bottom: 10,
    paddingHorizontal: 50,
    fontFamily: fonts.PoppinsBold,
    color: Colors.Dark_Teal,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    top: 20,
    justifyContent: 'center',
  },
  fieldContainer: {
    marginBottom: 15,
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
  errorInput: {
    backgroundColor: Colors.Light_Red,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal : 10,
    justifyContent : 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    marginHorizontal : 5,
    color: Colors.Dark_Teal,
    fontFamily : fonts.PoppinsSemiBold,
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.Teal,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 20,
    color: Colors.Background_Color,
  },
  loginContainer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    fontFamily : fonts.PoppinsMedium,
    color: Colors.Dark_Teal,
    marginRight: 5,
  },
  loginButton: {
    fontSize: 16,
    color: Colors.Teal,
    fontFamily: fonts.PoppinsSemiBold,
  },
});

export default Register;
