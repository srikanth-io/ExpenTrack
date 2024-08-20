import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { useNavigation } from '@react-navigation/native';

const IncomeAndExpense = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeData = await getIncomeFromDB();
        const expenseData = await getExpenseFromDB();

        setIncome(incomeData);
        setExpense(expenseData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleIncomePress = () => {
    navigation.navigate('IncomeList' as never);
  };

  const handleExpensePress = () => {
    navigation.navigate('ExpensesList' as never);
  };

  return (
    <View style={styles.amountsContainer}>
      <View style={styles.IncExpContainer}>
        <TouchableOpacity style={styles.IncContainer} onPress={handleIncomePress}>
          <Image style={{ tintColor: Colors.Teal, height: 50, width: 50 }} source={require('../../assets/CustomIcons/income.png')} />
          <View>
            <Text style={styles.IncomeAmountsText}>Income</Text>
            <Text style={styles.IncomeAmounts}>₹ {income}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ExpContainer} onPress={handleExpensePress}>
          <Image style={{ tintColor: Colors.Red, height: 50, width: 50 }} source={require('../../assets/CustomIcons/expense.png')} />
          <View>
            <Text style={styles.ExpenseAmountText}>Expense</Text>
            <Text style={styles.ExpenseAmount}>₹ {expense}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    top : -10,
  },
  IncExpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    top: -60,
    gap: 30,
    borderRadius: 20,
  },
  IncContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.Pale_Teal,
    justifyContent: 'center',
    padding: 15,
    gap: 5,
    borderRadius: 20,
  },
  ExpContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.Light_Red,
    justifyContent: 'center',
    padding: 15,
    gap: 5,
    borderRadius: 20,
  },
  IncomeAmountsText: {
    fontSize: 18,
    color: Colors.Teal,
    fontFamily: fonts.PoppinsSemiBold,
  },
  IncomeAmounts: {
    fontSize: 25,
    color: Colors.Teal,
    fontFamily: fonts.PoppinsBold,
  },
  ExpenseAmountText: {
    fontSize: 18,
    color: Colors.Red,
    fontFamily: fonts.PoppinsSemiBold,
  },
  ExpenseAmount: {
    fontSize: 25,
    color: Colors.Red,
    fontFamily: fonts.PoppinsBold,
  },
});

export default IncomeAndExpense;

// Example functions to fetch data from DB
async function getIncomeFromDB() {
  // Replace with actual database fetching logic
  return 1000; // Dummy value
}

async function getExpenseFromDB() {
  // Replace with actual database fetching logic
  return 3000; // Dummy value
}
