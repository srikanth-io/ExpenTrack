import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getRecentExpenses, getBalance } from '../utils/Database/db';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Profile from '../components/profile&Notification';

interface Expense {
  id?: number;
  itemName: string;
  date?: string | null;
  expenseAmount: number;
  description?: string;
  image?: string;
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
          <Text style={styles.balanceText}>Amount Balance</Text>
          <Text style={styles.balanceTextAmount}>₹ {balance.toFixed(2)}</Text>
        </View>
      </View>
        <IncomeAndExpense/>
        <View style={{top : -190, left : 10, }}>
        <Profile />
        </View>
      <View style={styles.recentExpensesContainer}>
        <Text style={styles.recentExpensesText}>Recent Expenses</Text>
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
                <Text style={styles.expenseText}>{item.itemName}</Text>
              ) : null}
              {item.date ? (
                <Text style={styles.expenseText}>{item.date}</Text>
              ) : null}
              {item.expenseAmount ? (
                <Text style={styles.expenseText}>{item.expenseAmount.toFixed(2)}</Text>
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
    backgroundColor : Colors.Dark100,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    height: 100,
    top : 10,
    marginTop : 20,
    
  },
  balanceContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  balanceTextAmount: {
    fontSize: 40,
    color: Colors.Second_color,
    fontFamily: fonts.PoppinsBold,
  },
  balanceText: {
    fontSize: 18,
    color: Colors.Third_color,
    fontFamily: fonts.PoppinsRegular,
  },
  recentExpensesContainer: {
    padding: 10,
    marginBottom: 2,
  },
  recentExpensesText: {
    fontSize: 25,
    color: Colors.Bottom_color,
    fontFamily: fonts.PoppinsRegular,
  },
  expenseContainer: {
    backgroundColor: Colors.Third_color,
    padding: 10,
    borderRadius: 20,
    marginBottom: 13,
  },
  expenseInfoContainer: {
    flex: 1,
  },
  expenseText: {
    fontSize: 16,
    color: Colors.Background_Color,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default HomePage;
