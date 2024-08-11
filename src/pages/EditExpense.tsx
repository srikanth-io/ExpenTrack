import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { updateExpense, getBalance } from '../utils/Database/db'; // import the updateExpense function

const EditExpense = ({ route, navigation }) => {
  const { expense } = route.params; // Get the passed expense data from navigation
  const [itemName, setItemName] = useState(expense.itemName);
  const [date, setDate] = useState(new Date(expense.date));
  const [formattedDate, setFormattedDate] = useState(expense.date);
  const [expenseAmount, setExpenseAmount] = useState(expense.expenseAmount);
  const [description, setDescription] = useState(expense.description);
  const [image, setImage] = useState(expense.image ? { uri: expense.image } : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const currentBalance = await getBalance();
      setBalance(currentBalance);
    };

    fetchBalance();
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
    const updatedExpense = {
      id: expense.id,
      itemName,
      date: formattedDate,
      expenseAmount,
      description,
      image: image ? image.uri : null,
    };

    try {
      await updateExpense(updatedExpense); // Function to update the expense in the database
      Alert.alert('Success', 'Expense updated successfully!');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Error updating expense:', error);
      Alert.alert('Error', 'Failed to update expense.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setFormattedDate(currentDate.toLocaleDateString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.balancePreview}>
        <Text style={styles.balanceText}>Balance: ${balance}</Text>
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
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>{formattedDate || 'Select Date'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode='date'
            display='default'
            onChange={onChangeDate}
          />
        )}
        <View style={styles.space} />

        <Text style={styles.label}>Expense Amount:</Text>
        <TextInput
          style={styles.input}
          value={expenseAmount}
          onChangeText={setExpenseAmount}
          keyboardType='number-pad'
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
    top: 50,
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
    fontWeight: 'bold',
    fontSize: 18,
  },
  formContainer: {
    padding: 20,
    top: 30,
  },
  label: {
    fontFamily: fonts.PoppinsRegular,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    maxHeight: 150,
    borderColor: Colors.Gray,
    borderWidth: 2,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
  },
  inputDes: {
    height: 150,
    borderColor: Colors.Gray,
    borderWidth: 2,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
  },
  space: {
    height: 15,
  },
  datePickerButton: {
    borderColor: Colors.Gray,
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  datePickerText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: 18,
  },
  ButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    top: 10,
  },
  imagePicker: {
    backgroundColor: Colors.Gray,
    padding: 10,
    height: 50,
    width: 150,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: 'bold',
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
    height: 50,
    width: 200,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default EditExpense;
