import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getBalance, saveBalance } from '../utils/Database/db';
import Balance from './Balance';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const BalanceManager: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [bank, setBank] = useState<string>('');
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await getBalance();
        setBalance(currentBalance || 0);
      } catch (error) {
        console.error('Error fetching balance:', error);
        Toast.show({
          type: 'errorToast',
          text1: 'Error',
          text2: 'Failed to fetch balance.',
        });
      }
    };

    fetchBalance();
  }, []);

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
      console.log(balance, ' amount balance')
      await saveBalance(updatedBalance, { amount: newAmount, name, category, bank });
      setBalance(updatedBalance);
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

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        if (isDataChanged) {
          e.preventDefault();
          Alert.alert(
            'Discard changes?',
            'You have unsaved changes. Are you sure you want to leave?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Discard', style: 'destructive', onPress: () => navigation.navigate('Home') },
            ]
          );
        }
      };

      navigation.addListener('beforeRemove', onBeforeRemove);

      return () => {
        navigation.removeListener('beforeRemove', onBeforeRemove);
      };
    }, [navigation, isDataChanged])
  );

  const handleChangeAmountInput = (text: string) => {
    setAmount(text.replace(/[^0-9.]/g, ''));
    setIsDataChanged(true);
  };

  const handleChangeNameInput = (text: string) => {
    setName(text);
    setIsDataChanged(true);
  };

  const handleChangeCategoryInput = (text: string) => {
    setCategory(text);
    setIsDataChanged(true);
  };

  const handleChangeBankInput = (text: string) => {
    setBank(text);
    setIsDataChanged(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.balanceContainer}>
          <Balance />
        </View>
        <View style={styles.MainContainer}>
          <Text style={styles.AmountText}>Add Balance</Text>
          <View style = {styles.subContainer}>
          <Text style={styles.RupeesTxt}>₹</Text>
          <TextInput
            style={styles.AmountInput}
            value={amount}
            onChangeText={handleChangeAmountInput}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={Colors.Text_Color}
          />
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={handleChangeNameInput}
              placeholder="Enter name"
            />
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={handleChangeCategoryInput}
              placeholder="Select Category"
            />
            <TextInput
              style={styles.input}
              value={bank}
              onChangeText={handleChangeBankInput}
              placeholder="Enter bank name"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddBalance}>
            <Text style={styles.addButtonText}>Add Balance</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={{
        successToast: ({ text1, text2 = '' }: { text1: string, text2?: string }) => (
          <View style={customStyles.successToast}>
            <Text style={customStyles.toastText}>{text1}</Text>
            {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
          </View>
        ),
        errorToast: ({ text1, text2 }: { text1: string, text2?: string }) => (
          <View style={customStyles.errorToast}>
            <Text style={customStyles.toastText}>{text1}</Text>
            {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
          </View>
        ),
      }} />
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
  MainContainer: {
    backgroundColor: Colors.Light_Teal,
    paddingTop: 40,
    paddingBottom: 65,
    padding: 20,
    marginHorizontal: -20,
    borderRadius: 20,
    borderTopWidth: 0.1,
  },
  subContainer  : {
    flexDirection : 'row',
    top : -10,
    marginBottom : -15,
  },
  RupeesTxt : {
    paddingHorizontal: 10,
    fontSize: 50,
    marginBottom: 30,
    color: Colors.Text_Color,
    fontFamily: fonts.PoppinsSemiBold,
  },
  AmountText: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: Colors.Text_Color,
    fontFamily: fonts.PoppinsSemiBold,
  },
  balanceContainer: {
    flex :1,
    marginBottom: 160,
    left : -70,
    top : 30,
    alignItems: 'center',
  },
  AmountInput: {
    fontFamily: fonts.PoppinsSemiBold,
    paddingHorizontal: 10,
    left : -10,
    fontSize: 50,
    color: Colors.Background_Color,
    marginBottom: 30,
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
    justifyContent : 'center',
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
    marginTop : 10,
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
    height: 50,
    width: '90%',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorToast: {
    height: 50,
    width: '90%',
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSubText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default BalanceManager;
