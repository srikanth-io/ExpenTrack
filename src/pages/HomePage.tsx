import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getRecentExpenses, getBalance } from '../utils/Database/db';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

interface Expense {
  id?: number;
  itemName: string;
  date?: string | null;
  expenseAmount: number;
  description?: string;
  image?: string;
}

interface Item {
  id?: undefined;
  name: string;
}

export type RootStackParamList = {
  HomePage: undefined;
  EditExpense: { expense: Expense };
};

type HomePageNavigationProp = NavigationProp<RootStackParamList, 'HomePage'>;

const HomePage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balance, setBalance] = useState<number>(0.0);
  const navigation = useNavigation<HomePageNavigationProp>(); 

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const recentExpenses = await getRecentExpenses();
        setExpenses(recentExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const balance = await getBalance();
        setBalance(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchExpenses();
    fetchBalance();
    
    // Set up polling
    const intervalId = setInterval(async () => {
      await fetchExpenses();
      await fetchBalance();
    }, 1000); // Poll every second

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Remaining Balance: ₹ {balance.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.recentExpensesContainer}>
        <Text style={styles.recentExpensesText}>Recent Expenses of Past 10 records:</Text>
      </View>
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.expenseContainer} 
            onPress={() => navigation.navigate('EditExpense', { expense: item })}
          >
            <View style={styles.expenseInfoContainer}>
              {item.itemName ? (
                <Text style={styles.expenseText}>Item: {item.itemName}</Text>
              ) : null}
              {item.date ? (
                <Text style={styles.expenseText}>Date: {item.date}</Text>
              ) : null}
              {item.expenseAmount ? (
                <Text style={styles.expenseText}>Expense Amount: {item.expenseAmount.toFixed(2)}</Text>
              ) : null}
              {item.description ? (
                <Text style={styles.expenseText}>Description: {item.description}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id?.toString() ?? '0'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    height: 100,
    backgroundColor: Colors.Gray,
  },
  balanceContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  balanceText: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: fonts.PoppinsBold,
  },
  recentExpensesContainer: {
    backgroundColor: Colors.Gray,
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  recentExpensesText: {
    fontSize: 18,
    color: Colors.White, 
    fontFamily: fonts.PoppinsRegular,
  },
  expenseContainer: {
    backgroundColor: Colors.Grey,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  expenseInfoContainer: {
    flex: 1,
  },
  expenseText: {
    fontSize: 16,
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default HomePage;
