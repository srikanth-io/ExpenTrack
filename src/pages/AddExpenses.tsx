import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, Platform, KeyboardAvoidingView, ScrollView, Modal, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { Feather } from '@expo/vector-icons';
import { saveExpense, getBalance, updateBalance } from '../utils/Database/db'; 
import Toast from 'react-native-toast-message';
import Balance from '../components/Balance';

type Expense = {
  itemName: string;
  date: string; 
  expenseAmount: number;
  description: string;
  category: string | null;
  image: string | null;
};

type Category = {
  label: string;
  value: string | null;
};

type AddExpensesNavigationProp = {
  navigation: any; 
}

const MIN_ITEM_NAME_LENGTH = 2;

const AddExpenses: React.FC<AddExpensesNavigationProp> = ({ navigation }) => {
  const categories: Category[] = [
    { label: 'None', value: null },
    { label: 'Food', value: 'food' },
    { label: 'Transport', value: 'transport' },
    { label: 'Income', value: 'income' },
    { label: 'Petrol', value: 'petrol' },
    { label: 'Groceries', value: 'groceries' },
    { label: 'Snacks', value: 'snacks' },
    { label: 'Festival', value: 'festival' },
    { label: 'Others', value: 'others' },
  ];

  const now = new Date();
  const [itemName, setItemName] = useState('');
  const [date, setDate] = useState(now);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick image.',
      });
    }
  };

  const handleSave = async () => {
    if (itemName.length < MIN_ITEM_NAME_LENGTH) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: `Item name must contain at least ${MIN_ITEM_NAME_LENGTH} characters.`,
      });
      return;
    }

    if (!date) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a date.',
      });
      return;
    }

    if (!selectedCategory) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a category.',
      });
      return;
    }

    const expenseAmountValue = parseFloat(expenseAmount);
    if (isNaN(expenseAmountValue) || expenseAmountValue <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Expense amount must be greater than 0.',
      });
      return;
    }

    try {
      // Fetch current balance
      const currentBalance = await getBalance();

      // Calculate updated balance
      const updatedBalance = currentBalance - expenseAmountValue;

      if (updatedBalance < 0) {
        Toast.show({
          type: 'error',
          text1: 'Insufficient Balance',
          text2: 'The expense amount exceeds the current balance.',
        });
        return;
      }

      // Prepare expense object
      const expense: Expense = {
        itemName,
        date: date.toISOString(),
        expenseAmount: expenseAmountValue,
        description,
        category: selectedCategory,
        image: image?.uri || null,
      };

      // Save the expense
      await saveExpense(expense);

      // Update the balance in the database
      await updateBalance(updatedBalance);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Expense saved successfully!',
      });

      // Reset the form
      setItemName('');
      setDate(now);
      setExpenseAmount('');
      setDescription('');
      setImage(null);
      setSelectedCategory(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving expense:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save expense.',
      });
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (event.type === 'set' && selectedDate) {
      if (selectedDate > now) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Date',
          text2: 'Future dates are not allowed.',
        });
        return;
      }

      setDate(selectedDate); 
    }
  };

  const handleDatePickerPress = () => {
    setShowDatePicker(true);
  };

  const handleSelectCategory = (value: string | null) => {
    setSelectedCategory(value);
    setModalVisible(false);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Balance />
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Name"
            />
          </View>
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.pickerButtonText}>
                {selectedCategory
                  ? categories.find((cat) => cat.value === selectedCategory)?.label
                  : 'Select Category'}
              </Text>
              <Feather name="chevron-down" size={24} color={Colors.Dark_Green} />
            </TouchableOpacity>
            <Modal
              transparent={true}
              visible={modalVisible}
              animationType="fade"
              onRequestClose={handleModalClose}
            >
              <TouchableWithoutFeedback onPress={handleModalClose}>
                <View style={styles.modalContainer}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <FlatList
                        data={categories}
                        keyExtractor={(item) => item.value || item.label}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => handleSelectCategory(item.value)}
                          >
                            <Text style={styles.modalItemText}>{item.label}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={handleDatePickerPress}
            >
              <Text style={styles.datePickerText}>
                {new Date(date).toLocaleDateString()} 
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={now}
              />
            )}
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={expenseAmount}
              onChangeText={(text) =>
                setExpenseAmount(text.replace(/[^0-9.]/g, ''))
              }
              keyboardType="number-pad"
              placeholder="Expense amount"
            />
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.DesInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description here..."
              multiline
            />
          </View>
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handleImagePick}
            >
              <Text style={styles.imagePickerText}>Select Image</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.selectedImage} />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default AddExpenses;

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
  DesInput: {
    height: 150,
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 15,
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
    textAlignVertical: 'top',
    padding: 10,
  },
  datePickerButton: {
    backgroundColor: Colors.Pale_Teal,
    padding: 15,
    borderRadius: 15,
  },
  datePickerText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 16,
    color: Colors.Dark_Teal,
  },
  imagePickerButton: {
    backgroundColor: Colors.Light_Teal,
    padding: 10,
    borderRadius: 15,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 18,
    color: Colors.Dark_Teal,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
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
  pickerButton: {
    height: 55,
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Green,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 15,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    marginBottom: 5,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
});
