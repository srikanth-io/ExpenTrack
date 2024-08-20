import * as SQLite from 'expo-sqlite';
import { type } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Balance = { amount: number };

let isDataChanged = false;

type Database = ReturnType<typeof SQLite.openDatabaseSync>;

const openDatabase = async (): Promise<Database> => {
  return SQLite.openDatabaseSync('expense.db');
};

const dbPromise = openDatabase();

export const initializeDatabase = async (): Promise<void> => {
  try {
    const db = await dbPromise;

    // Create tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        category TEXT,
        itemName TEXT NOT NULL,
        date TEXT NOT NULL,
        expenseAmount REAL NOT NULL,
        description TEXT,
        image TEXT
      );
    `);
    console.log('Expenses table created or already exists.');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS income (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        categories TEXT,
        bankName TEXT NOT NULL
      );
    `);

    console.log('income table created or already exists.');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS balance (
        id INTEGER PRIMARY KEY NOT NULL,
        amount REAL NOT NULL
      );
    `);

    console.log('balance table created or already exists.');

    // Initialize balance if not present
    const result = await db.getFirstAsync('SELECT * FROM balance WHERE id = 1');
    if (!result) {
      await db.runAsync('INSERT INTO balance (id, amount) VALUES (1, 0)');
    }

    console.log('Database initialized and tables created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Function to Save Balance
// Assuming you're using AsyncStorage or any other database

export const saveBalance = async (newBalance: number, balanceEntry: { amount: number; name: string; category: string; bank: string; date?: string; }) => {
  try {
    // Save the updated balance
    await AsyncStorage.setItem('balance', newBalance.toString());

    // Retrieve existing balance history
    const balanceHistory = await AsyncStorage.getItem('balanceHistory');
    const parsedHistory = balanceHistory ? JSON.parse(balanceHistory) : [];

    // Append the new balance entry to the history
    parsedHistory.push(balanceEntry);

    // Save the updated history back to storage
    await AsyncStorage.setItem('balanceHistory', JSON.stringify(parsedHistory));
  } catch (error) {
    console.error('Failed to save balance:', error);
  }
};

// export const getBalanceHistory = async () => {
//   try {
//     const balanceHistory = await AsyncStorage.getItem('balanceHistory');
//     return balanceHistory ? JSON.parse(balanceHistory) : [];
//   } catch (error) {
//     console.error('Failed to fetch balance history:', error);
//     return [];
//   
// };



export const getBalanceHistory = async (): Promise<any[]> => {
  try {
    // Mock data for testing
    const data = [
      { id: 1, date: '2024-08-20T00:00:00Z', name: 'John Doe', amount: 500, category: 'Salary', bank: 'Bank A' },
      { id: 2, date: '2024-08-19T00:00:00Z', name: 'Jane Smith', amount: 200, category: 'Gift', bank: 'Bank B' }
    ];
    return data;
  } catch (error) {
    console.error('Error fetching balance history:', error);
    return []; // Return an empty array in case of error
  }
};



// Function to Get Balance
export const getBalance = async () => {
  try {
    const balance = await AsyncStorage.getItem('balance');
    return balance ? parseFloat(balance) : 0.0;
  } catch (error) {
    console.error('Failed to fetch income:', error);
    return 0.0;
  }
};
// Function to Save Expense
export const saveExpense = async (expense: type.Expense): Promise<void> => {
  try {
    const db = await dbPromise;

    await db.runAsync(
      'INSERT INTO expenses (category, itemName, date, expenseAmount, description, image) VALUES (?, ?, ?, ?, ?, ?)',
      expense.category ?? null,         
      expense.itemName ?? null,
      expense.date ?? null,
      expense.expenseAmount,
      expense.description ?? null,
      expense.image ?? null
    );

    // Set change tracker to true
    isDataChanged = true;

    const currentBalance = await getBalance();
    const newBalance = currentBalance - expense.expenseAmount;
await saveBalance(newBalance, { amount: newBalance, name: '', category: '', bank: '' });

    console.log('Expense saved!');
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};


// Function to Get Recent Expenses
export const getRecentExpenses = async (): Promise<type.Expense[]> => {
  try {
    const db = await dbPromise;
    return await db.getAllAsync<type.Expense>('SELECT * FROM expenses ORDER BY id DESC LIMIT 10');
  } catch (error) {
    console.error('Error retrieving recent expenses:', error);
    throw error;
  }
};

// Function to Get All Expenses
export const getAllExpenses = async (): Promise<type.Expense[]> => {
  try {
    const db = await dbPromise;
    return await db.getAllAsync<type.Expense>('SELECT * FROM expenses ORDER BY date DESC');
  } catch (error) {
    console.error('Error retrieving all expenses:', error);
    throw error;
  }
};

// Function to Get Expense by ID
export const getExpenseById = async (id: number): Promise<type.Expense | undefined | null> => {
  try {
    const db = await dbPromise;
    return await db.getFirstAsync<type.Expense>('SELECT * FROM expenses WHERE id = ?', id);
  } catch (error) {
    console.error('Error retrieving expense by ID:', error);
    throw error;
  }
};

// Function to save the income to the database
export const saveIncome = async (income: number) => {
  try {
    await AsyncStorage.setItem('income', JSON.stringify(income));
  } catch (error) {
    console.error('Failed to save income:', error);
  }
};

// Function to fetch the income from the database
export const getIncome = async (): Promise<number> => {
  try {
    const income = await AsyncStorage.getItem('income');
    return income ? JSON.parse(income) : 0;
  } catch (error) {
    console.error('Failed to fetch income:', error);
    return 0;
  }
};