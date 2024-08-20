import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getBalance } from '../utils/Database/db'; 
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

type RootStackParamList = {
  Balance: undefined;
  BalanceManager: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Balance'>;

const Balance: React.FC = () => {
  const [balance, setBalance] = useState<number>(0.0);
  const [isBalanceUpdated, setIsBalanceUpdated] = useState<boolean>(true); 
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const dbBalance = await getBalance(); 
        setBalance(dbBalance);
        setIsBalanceUpdated(false); 
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    if (isBalanceUpdated) {
      fetchBalance();
    }
  }, [isBalanceUpdated]); 

  const navigateToBalanceManager = () => {
    navigation.navigate('BalanceManager'); 
  };

  return (
    <TouchableOpacity style={styles.balanceContainer}>
      <TouchableOpacity onPress={navigateToBalanceManager}>
        <Text style={styles.balanceText}>Amount Balance</Text>
        <Text style={styles.balanceTextAmount}>₹ {balance.toFixed(2)}</Text> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.EditIconbalance} onPress={navigateToBalanceManager}>
        <EvilIcons name="pencil" size={40} color={Colors.Teal} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    flex: 1,
    padding: 5,
    left: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -15,
    width: '60%',
  },
  balanceTextAmount: {
    fontSize: 40,
    color: Colors.Teal,
    fontFamily: fonts.PoppinsBold,
  },
  balanceText: {
    alignItems: 'center',
    fontSize: 18,
    left: 15,
    top: 10,
    color: Colors.Light_Teal,
    fontFamily: fonts.PoppinsRegular,
  },
  EditIconbalance: {
    left: 6,
    top: 0,
  }
});

export default Balance;
