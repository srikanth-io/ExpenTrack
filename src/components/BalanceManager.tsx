import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getBalance, saveBalance, getIncome, saveIncome } from '../utils/Database/db'; 
import Balance from './Balance';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const BalanceManager: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [bank, setBank] = useState<string>('');
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const navigation = useNavigation();

  const fetchBalanceAndIncome = useCallback(async () => {
    try {
      const currentBalance = await getBalance() || 0;
      const totalIncome = await getIncome() || 0;
      setBalance(currentBalance);
      setIncome(totalIncome); 
    } catch (error) {
      console.error('Error fetching balance or income:', error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error',
        text2: 'Failed to fetch balance or income.',
      });
    }
  }, []);

  useEffect(() => {
    fetchBalanceAndIncome();
  }, [fetchBalanceAndIncome]);

  const handleAddBalance = async () => {
    const newAmount = parseFloat(amount);
    if (isNaN(newAmount) || newAmount <= 0 || !name || !category || !bank) {
      Toast.show({
        type: 'errorToast',
        text1: 'Validation Error',
        text2: 'All fields must be filled and amount must be greater than 0.',
      });
      return;
    }
  
    try {
      const updatedBalance = balance + newAmount;
      const updatedIncome = income + newAmount;
  
      const balanceEntry = {
        amount: newAmount,
        name,
        category,
        bank,
        date: new Date().toISOString(),
      };
  
      await saveBalance(updatedBalance, balanceEntry);
      await saveIncome(updatedIncome);
  
      setBalance(updatedBalance);
      setIncome(updatedIncome);
  
      Toast.show({
        type: 'successToast',
        text1: 'Success',
        text2: 'Balance added successfully!',
      });
  
      setAmount('');
      setName('');
      setCategory('');
      setBank('');
      setIsDataChanged(false);
    } catch (error) {
      console.error('Error updating balance:', error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error',
        text2: 'Failed to update balance.',
      });
    }
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Balance />
        <View style={styles.MainContainer}>
          <Text style={styles.AddBalanceText}>Add Balance</Text>
          <View style={styles.subContainer}>
            <Text style={styles.RupeesTxt}>₹</Text>
            <TextInput
              style={styles.AmountText} 
              value={amount}
              keyboardType="numeric"
              onChangeText={setAmount}
              placeholder="0.0"
            />
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.Dark_Teal}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
              placeholderTextColor={Colors.Dark_Teal}
            />
            <TextInput
              style={styles.input}
              placeholder="Bank"
              value={bank}
              onChangeText={setBank}
              placeholderTextColor={Colors.Dark_Teal}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddBalance}>
              <Text style={styles.addButtonText}>Add Balance</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  MainContainer: {
    flex: 1,
    marginTop: 163.5,
    backgroundColor: Colors.Light_Teal,
    padding: 20,
    marginHorizontal: -20,
    borderRadius: 20,
    paddingBottom: 30,
  },
  AddBalanceText: {
    fontSize: 16,
    paddingHorizontal: 10,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Background_Color,
  },
  subContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 'auto',
    top: -10,
  },
  RupeesTxt: {
    paddingHorizontal: 10,
    fontSize: 50,
    marginBottom: 30,
    color: Colors.Text_Color,
    fontFamily: fonts.PoppinsSemiBold,
  },
  AmountText: {
    paddingHorizontal: 10,
    left: -15,
    fontSize: 50,
    marginBottom: 30,
    color: Colors.Text_Color,
    fontFamily: fonts.PoppinsSemiBold,
  },
  formContainer: {
    backgroundColor: Colors.Pale_Teal,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    justifyContent: 'center',
  },
  input: {
    height: 60,
    backgroundColor: Colors.Background_Color,
    fontFamily: fonts.PoppinsSemiBold,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: Colors.Dark_Teal,
    marginBottom: 10,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: Colors.Teal,
    padding: 20,
    marginTop: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 18,
    color: Colors.Background_Color,
  },
});

const customStyles = StyleSheet.create({
  successToast: {
    padding: 15,
    backgroundColor: Colors.Dark_Teal,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  errorToast: {
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 16,
  },
  toastSubText: {
    color: 'white',
    fontFamily: fonts.PoppinsMedium,
    fontSize: 14,
  },
});

export default BalanceManager;
