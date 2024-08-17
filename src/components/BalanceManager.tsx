import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getBalance, saveBalance } from '../utils/Database/db';
import Balance from './Balance';

const BalanceManager: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [bank, setBank] = useState<string>('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await getBalance();
        setBalance(currentBalance || 0);
      } catch (error) {
        console.error('Error fetching balance:', error);
        Alert.alert('Error', 'Failed to fetch balance.');
      }
    };

    fetchBalance();
  }, []);

  const handleAddBalance = async () => {
    const newAmount = parseFloat(amount);
    if (isNaN(newAmount) || newAmount <= 0 || !name || !category || !bank) {
      Alert.alert('Validation Error', 'All fields must be filled and amount must be greater than 0.');
      return;
    }

    try {
      const updatedBalance = balance + newAmount;
      await saveBalance(updatedBalance, { amount: newAmount, name, category, bank });
      setBalance(updatedBalance);
      Alert.alert("Balance Saved Successfully!");
      setAmount('');
      setName('');
      setCategory('');
      setBank('');
    } catch (error) {
      console.error('Error updating balance:', error);
      Alert.alert('Error', 'Failed to update balance.');
    }
  };

  const handleChangeAmountInput = (text: string) => {
    setAmount(text.replace(/[^0-9.]/g, ''));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.balanceContainer}>
          <Balance/>
        </View>
        <View style= {styles.MainContainer}>
       <>
       <Text style = {styles.AmountText} >Add Balance</Text>
        <TextInput
            style={styles.AmountInput}
            value={amount}
            onChangeText={handleChangeAmountInput}
            keyboardType="numeric"
            placeholder="₹ 0.00"
            placeholderTextColor={Colors.Text_Color}
          />
       
        <View style={styles.formContainer}>
         
          
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
          />
          
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Select Category"
          />
          
          <TextInput
            style={styles.input}
            value={bank}
            onChangeText={setBank}
            placeholder="Enter bank name"
          />
          
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBalance}>
           <Text style={styles.addButtonText}>Add Balance</Text>
        </TouchableOpacity>

         </>
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
    padding: 0,
  },
  MainContainer : {
    backgroundColor : Colors.Light_Teal,
    paddingTop: 40,
    paddingBottom: 65,
    padding : 20,
    marginLeft: -20, 
    marginRight: -20,
    borderRadius : 20,
    borderTopWidth : 0.1,
  },
  AmountText : {
    paddingHorizontal : 10,
    fontSize : 16,
    color : Colors.Text_Color,
    fontFamily : fonts.PoppinsSemiBold,
  },
  balanceContainer: {
    marginBottom: 160,
    alignItems: 'center',
  },
  balanceText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 24,
    color: Colors.Pale_Teal,
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
  },
  AmountInput : {
    fontFamily : fonts.PoppinsSemiBold,
    paddingHorizontal: 10,
    fontSize: 50,
    color: Colors.Background_Color,
    marginBottom : 30,
  },
  input: {
    height: 60,
    backgroundColor: Colors.Background_Color,
    fontFamily : fonts.PoppinsSemiBold,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: Colors.Dark_Teal,
    marginBottom: 20,
    top : 10,
    justifyContent : 'center',
  },
  addButton: {
    backgroundColor: Colors.Teal,
    padding: 20,
    marginTop : 20,
    top : 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 18,
    color: Colors.Background_Color,
  },
});

export default BalanceManager;
