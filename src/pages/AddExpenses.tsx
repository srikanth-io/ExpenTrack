import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { initializeDatabase, saveExpense } from '../utils/Database/db';

const AddExpenses = () => {
  const [itemName, setItemName] = useState('');
  const [date, setDate] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully.');
      } catch (error) {
        console.error('Error initializing database:', error);
        Alert.alert('Error', 'Failed to initialize database.');
      }
    };

    initDatabase();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  const handleSave = async () => {
    const expense = {
      itemName,
      date,
      expenseAmount,
      description,
      image: image ? image.uri : null,
    };

    try {
      await saveExpense(expense);
      Alert.alert('Success', 'Expense saved successfully!');
      setItemName('');
      setDate('');
      setExpenseAmount('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('Error', 'Failed to save expense.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.balancePreview}>
        <Text style={styles.balanceText}>Balance: $10000</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Item Name:</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
        />
        <View style={styles.space} />

        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />
        <View style={styles.space} />

        <Text style={styles.label}>Expense Amount:</Text>
        <TextInput
          style={styles.input}
          value={expenseAmount}
          onChangeText={setExpenseAmount}
        />
        <View style={styles.space} />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.inputDes}
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />
        <View style={styles.space} />

        <TouchableOpacity style={styles.ButtonContainer}>
          <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
            <Text style={styles.imagePickerText}>Add Picture</Text>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.image} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    top : 50,
  },
  balancePreview: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: Colors.Grey,
    padding: 15,
    borderRadius: 15,
  },
  balanceText: {
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
    fontWeight : 'bold',
    fontSize: 18,
  },
  formContainer: {
    padding: 20,
    top : 30,
  },
  label: {
    fontFamily: fonts.PoppinsRegular,
    fontWeight : 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    maxHeight : 150,
    borderColor: Colors.Gray,
    borderWidth: 2,
    marginBottom: 10,
    padding: 10,
    borderRadius : 15,
  },
  inputDes: {
    height : 150,
    borderColor: Colors.Gray,
    borderWidth: 2,
    marginBottom: 10,
    padding: 10,
    borderRadius : 15,
  },
  space: {
    height: 15,
  },
  ButtonContainer : {
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent : 'space-evenly',
    top : 10,
  },
  imagePicker: {
    backgroundColor: Colors.Gray,
    padding: 10,
    height : 50,
    width : 150,
    borderRadius: 15,
    alignItems : 'center',
    justifyContent : 'center',
  },
  imagePickerText: {
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
    fontWeight : 'bold',
    fontSize: 18,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: Colors.Gray,
    padding: 10,
    height : 50,
    width : 200,
    borderRadius: 15,
    alignItems : 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
    fontWeight : 'bold',
    fontSize: 18,
  },
});

export default AddExpenses;