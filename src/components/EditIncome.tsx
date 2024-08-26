import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; 
import { updateIncomeEntry } from '../utils/Database/db'; 
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import Balance from './Balance';


const EditIncome = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { entry } = route.params || {};

  // State for managing editable fields
  const [isEditing, setIsEditing] = useState(false);

  // State for input values
  const [name, setName] = useState(entry?.name || '');
  const [date, setDate] = useState(entry?.date || '');
  const [amount, setAmount] = useState(entry?.amount.toString() || ''); 

  // Handler for save action
  const handleSave = async () => {
    try {
      if (!name || !date || !amount) {
        Alert.alert('Validation Error', 'Please fill in all fields.');
        return;
      }

      // Update the income entry
      await updateIncomeEntry(entry?.id, {
        name,
        date,
        amount: parseFloat(amount.replace('₹', '').trim()), 
      });

      // Log the updated value to the console
      console.log('Updated Income Entry:', {
        id: entry?.id,
        name,
        date,
        amount: parseFloat(amount.replace('₹', '').trim())
      });

      // Navigate back to the previous screen
      navigation.goBack();

      Alert.alert('Success', 'Changes saved successfully!');
      setIsEditing(false); 
      
    } catch (error) {
      console.error('Error updating income entry:', error);
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Balance />
        <View style={styles.formContainer}>
          <Text style={styles.TextField}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            editable={isEditing}
          />

          <View style={styles.space} />

          <Text style={styles.TextField}>Date:</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Date"
            editable={isEditing}
          />

          <View style={styles.space} />
        
          <Text style={styles.TextField}>Amount:</Text>
          <TextInput
            style={styles.input}
            value={`₹ ${amount}`}
            onChangeText={text => setAmount(text.replace('₹', '').trim())} 
            placeholder="Amount"
            editable={isEditing}
            keyboardType="numeric"
          />

          <View style={styles.space} />


          <View style={styles.buttonContainer}>
            {isEditing ? (
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
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
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  space: {
    height: 15,
  },
  input: {
    height: 60,
    backgroundColor: Colors.Pale_Teal,
    paddingHorizontal: 15,
    borderRadius: 15,
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.Teal,
    marginBottom: 20,
    width: 240,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 20,
    color: Colors.Background_Color,
  },
  TextField: {
    fontSize: 16,
    color: Colors.Dark_Teal,
    paddingBottom: 5,
    paddingLeft: 5,
    fontFamily: fonts.PoppinsSemiBold,
  }
});

export default EditIncome;
