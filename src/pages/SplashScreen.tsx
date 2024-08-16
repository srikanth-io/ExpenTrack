import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font'; 
import { Colors } from '../utils/colors'; 

const { height, width } = Dimensions.get('screen');

const SplashScreen = () => {
  // Load fonts here
  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('../../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../../assets/fonts/Poppins-Thin.ttf'),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.png')} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Dark_Teal, 
  },
  image: {
    height: height,
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF', 
    marginTop: 10,
    fontSize: 16, 
    fontFamily: 'Poppins-Regular',
  },
});

export default SplashScreen;
