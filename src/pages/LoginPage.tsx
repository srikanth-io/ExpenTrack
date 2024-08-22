import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { signInWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from "../utils/Auth/fireBaseConfig";
import { Colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

type RootStackParamList = {
  Dashboard: undefined;
  PasswordResetPage: undefined;
  Registration: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Login = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    Toast.hide();

    const errorToast: { [key: string]: string } = {};

    // Input validation
    if (!usernameOrEmail && !password) {
      Toast.show({
        type: "error",
        text1: "Input Required",
        text2: "Please fill in all input fields.",
      });
      return;
    }

    if (!usernameOrEmail) {
      errorToast.usernameOrEmail = "Username or Email is required";
    }
    if (!password) {
      errorToast.password = "Password is required";
    }

    // Show validation errors
    if (errorToast.usernameOrEmail) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: errorToast.usernameOrEmail,
      });
    }
    if (errorToast.password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: errorToast.password,
      });
    }

    if (Object.keys(errorToast).length > 0) {
      return;
    }

    // Attempt to sign in
    try {
      await signInWithEmailAndPassword(auth, usernameOrEmail, password);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Login successful!",
      });
      navigation.navigate('Dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: errorMessage,
      });
    }
  };

  const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => (
      <View style={customStyles.successToast}>
        <Text style={customStyles.toastText}>{text1}</Text>
        <Text style={customStyles.toastSubText}>{text2}</Text>
      </View>
    ),
    error: ({ text1, text2 }) => (
      <View style={customStyles.errorToast}>
        <Text style={customStyles.toastText}>{text1}</Text>
        <Text style={customStyles.toastSubText}>{text2}</Text>
      </View>
    ),
    info: ({ text1, text2 }) => (
      <View style={customStyles.infoToast}>
        <Text style={customStyles.toastText}>{text1}</Text>
        <Text style={customStyles.toastSubText}>{text2}</Text>
      </View>
    ),
  };

  const customStyles = StyleSheet.create({
    successToast: {
      height: 60,
      width: "90%",
      backgroundColor: Colors.Light_Teal,
      padding: 10,
      borderRadius: 20, 
      justifyContent: "center",
      alignItems: "center",
    },
    errorToast: {
      height: 60,
      width: "90%",
      backgroundColor: Colors.Red,
      padding: 10,
      borderRadius: 20, 
      justifyContent: "center",
      alignItems: "center",
    },
    infoToast: {
      height: 60,
      width: "90%",
      backgroundColor: "#17a2b8",
      padding: 10,
      borderRadius: 20, 
      justifyContent: "center",
      alignItems: "center",
    },
    toastText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
    },
    toastSubText: {
      color: "#ffffff",
      fontSize: 14,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.LoginTextHead}>
          <Text style={styles.LoginText}>Hey, </Text>
          <Text style={styles.LoginTextTwo}>Welcome</Text>
          <Text style={styles.LoginTextThree}>Back</Text>
        </View>

        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            placeholder="Username or Email Address"
            keyboardType="email-address"
            autoCapitalize="none" 
          />
        </View>

        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.forgetPasswordContainer}
          onPress={() => navigation.navigate("PasswordResetPage")}
        >
          <Text style={styles.forgetPasswordText}>Forget Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={styles.registerButton}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </KeyboardAvoidingView>
  );
};

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_Color,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  LoginTextHead: {
    top: 10,
    paddingLeft: 5,
  },
  LoginText: {
    fontSize: 60,
    fontFamily: fonts.PoppinsBold,
    color: Colors.Dark_Teal,
  },
  LoginTextTwo: {
    fontSize: 60,
    bottom: 20,
    fontFamily: fonts.PoppinsBold,
    fontStyle: "italic",
    fontWeight: "bold",
    color: Colors.Light_Teal,
  },
  LoginTextThree: {
    fontSize: 60,
    top: -35,
    fontFamily: fonts.PoppinsBold,
    color: Colors.Dark_Teal,
  },
  forgetPasswordContainer: {
    alignItems: "flex-end",
  },
  forgetPasswordText: {
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Teal,
  },
  fieldContainer: {
    marginBottom: 20,
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
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: Colors.Teal,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 20,
    color: Colors.Background_Color,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
  },
  registerText: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: 16,
    color: Colors.Dark_Teal,
  },
  registerButton: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 16,
    color: Colors.Teal,
    marginLeft: 5,
  },
});