import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { initializeDatabase, saveExpense, saveBalance, getBalance } from '../utils/Database/db';

const MIN_ITEM_NAME_LENGTH = 2;


const AddExpenses = () => {
  const [itemName, setItemName] = useState('');
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [balance, setBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully.');
        const currentBalance = await getBalance();
        setBalance(currentBalance || 0);
      } catch (error) {
        console.error('Error initializing database:', error);
        Alert.alert('Error', 'Failed to initialize database.');
      }
    };

    initDatabase();
  }, []);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const updateBalanceAfterExpense = async (expenseAmountValue: number) => {
    try {
      if (balance < expenseAmountValue) {
        Alert.alert('Limit Exceeded', 'Insufficient balance.');
        return false;
      }

      const updatedBalance = balance - expenseAmountValue;
      await saveBalance(updatedBalance);
      setBalance(updatedBalance);

      return true;
    } catch (error) {
      console.error('Error updating balance after expense:', error);
      Alert.alert('Error', 'Failed to update balance.');
      return false;
    }
  };

  const updateBalanceAfterAdd = async (newBalanceValue: number) => {
    try {
      const updatedBalance = balance + newBalanceValue;
      await saveBalance(updatedBalance);
      setBalance(updatedBalance);

      return true;
    } catch (error) {
      console.error('Error updating balance after adding amount:', error);
      Alert.alert('Error', 'Failed to update balance.');
      return false;
    }
  };

  const handleSave = async () => {
    // Check if itemName is valid
    if (itemName.length < MIN_ITEM_NAME_LENGTH) {
      Alert.alert('Validation Error', `Item name must contain at least ${MIN_ITEM_NAME_LENGTH} characters.`);
      return;
    }

    // Check if a date is selected
    if (!date) {
      Alert.alert('Validation Error', 'Please select a date.');
      return;
    }

    // Validate expense amount
    const expenseAmountValue = parseFloat(expenseAmount);
    if (isNaN(expenseAmountValue) || expenseAmountValue <= 0) {
      Alert.alert('Validation Error', 'Expense amount must be greater than 0.');
      return;
    }

    // Check if balance is sufficient
    const isBalanceUpdated = await updateBalanceAfterExpense(expenseAmountValue);
    if (!isBalanceUpdated) {
      return;
    }

    // Proceed to save the expense if all validations pass
    const expense = {
      itemName,
      date: formattedDate,
      expenseAmount: expenseAmountValue,
      description,
      image: image ? image.uri : null,
    };

    try {

      await saveExpense(expense);

      // Show success message
      Alert.alert('Success', 'Expense saved successfully!');

      // Reset the form
      setItemName('');
      setDate(new Date());
      setFormattedDate('');
      setExpenseAmount('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('Error', 'Failed to save expense.');
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setFormattedDate(currentDate.toLocaleDateString());
  };

  const handleOpenModal = () => setModalVisible(true);

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewBalance('');
  };

  const handleAddBalance = async () => {
    const newBalanceValue = parseFloat(newBalance);
    if (isNaN(newBalanceValue) || newBalanceValue <= 0) {
      Alert.alert('Validation Error', 'Balance amount must be greater than 0.');
      return;
    }

    const isBalanceUpdated = await updateBalanceAfterAdd(newBalanceValue);
    if (isBalanceUpdated) {
      handleCloseModal();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.balancePreview}>
          <Text style={styles.balanceText}>Remaining Balance: ₹{balance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addBalanceButton} onPress={handleOpenModal}>
            <Text style={styles.addBalanceButtonText}>Add Balance</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          {/* Form Fields */}
          <Text style={styles.label}>Item:</Text>
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
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}
          <View style={styles.space} />

          <Text style={styles.label}>Expense Amount:</Text>
          <TextInput
            style={styles.input}
            value={expenseAmount}
            onChangeText={text => setExpenseAmount(text.replace(/[^0-9.]/g, ''))} 
            keyboardType='number-pad'
            placeholder='₹0'
          />
          <View style={styles.space} />

          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.inputDes}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.space} />

          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              <Text style={styles.imagePickerText}>Add Picture</Text>
              {image && (
                <Image source={{ uri: image.uri }} style={styles.image} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Modal */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Balance</Text>
              <TextInput
                style={styles.modalInput}
                value={newBalance}
                onChangeText={text => setNewBalance(text.replace(/[^0-9.]/g, ''))} 
                keyboardType="number-pad"
                placeholder="₹0.0"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                  <Text style={styles.modalButtonText}>❌ Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleAddBalance}>
                  <Text style={styles.modalButtonText}>✔️ Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 15,
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
  addBalanceButton: {
    backgroundColor: Colors.WhiteSmoke,
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 10,
  },
  addBalanceButtonText: {
    color: Colors.Black,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: 'bold',
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
    top: 90,
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
    textAlignVertical: 'top',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: Colors.White,
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: 18,
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderColor: Colors.Gray,
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.Gray,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default AddExpenses;
