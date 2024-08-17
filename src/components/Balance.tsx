import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getBalance } from '../utils/Database/db';
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
    <TouchableOpacity style={styles.balanceContainer} onPress={navigateToBalanceManager}>
      <Text style={styles.balanceText}>Amount Balance</Text>
      <Text style={styles.balanceTextAmount}>₹ {balance.toFixed(2)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    marginTop : -10,
  },
  balanceTextAmount: {
    fontSize: 40,
    color: Colors.Teal,
    fontFamily: fonts.PoppinsBold,
  },
  balanceText: {
    fontSize: 18,
    top : 10,
    color: Colors.Light_Teal,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default Balance;
