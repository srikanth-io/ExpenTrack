import * as SQLite from 'expo-sqlite';
import { type } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Balance = { amount: number };

let isDataChanged = false;

const editExpense = async (updatedExpense: type.Expense) => {
  const originalExpense = await getExpenseById(updatedExpense.id);

  if (originalExpense) {
    await saveExpense(updatedExpense, originalExpense.expenseAmount);
  }
};

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
          await updateExpense(updateExpense as any);
    }
    
    console.log('Database initialized and tables created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Function to Save Balance
// Assuming you're using AsyncStorage or any other database


// Function to Update Expense by ID
export const updateExpense = async (expense: type.Expense): Promise<void> => {
  try {
    const db = await dbPromise;
    
    await db.runAsync(
      'UPDATE expenses SET category = ?, itemName = ?, date = ?, expenseAmount = ?, description = ?, image = ? WHERE id = ?',
      expense.category ?? null,
      expense.itemName ?? null,
      expense.date ?? null,
      expense.expenseAmount,
      expense.description ?? null,
      expense.image ?? null,
      expense.id
    );

    console.log('Expense updated successfully!');
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};



export const saveExpense = async (expense: type.Expense, originalExpenseAmount?: number): Promise<void> => {
  try {
    const db = await dbPromise;

    if (originalExpenseAmount !== undefined) {
      // Update existing expense
      await db.runAsync(
        'UPDATE expenses SET category = ?, itemName = ?, date = ?, expenseAmount = ?, description = ?, image = ? WHERE id = ?',
        expense.category ?? null,
        expense.itemName ?? null,
        expense.date ?? null,
        expense.expenseAmount,
        expense.description ?? null,
        expense.image ?? null,
        expense.id // Assuming the ID of the expense is passed in the expense object
      );

      // Adjust the balance based on the difference
      const currentBalance = await getBalance();
      const balanceDifference = originalExpenseAmount - expense.expenseAmount;
      const newBalance = currentBalance + balanceDifference;

      await saveBalance(newBalance, { amount: newBalance, name: '', category: '', bank: '' });
    } else {
      // Insert new expense
      await db.runAsync(
        'INSERT INTO expenses (category, itemName, date, expenseAmount, description, image) VALUES (?, ?, ?, ?, ?, ?)',
        expense.category ?? null,
        expense.itemName ?? null,
        expense.date ?? null,
        expense.expenseAmount,
        expense.description ?? null,
        expense.image ?? null
      );

      // Subtract the expense amount from the balance
      const currentBalance = await getBalance();
      const newBalance = currentBalance - expense.expenseAmount;

      await saveBalance(newBalance, { amount: newBalance, name: '', category: '', bank: '' });
    }

    console.log('Expense saved!');
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};



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
    return []; 
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

function saveBalance(newBalance: number, arg1: { amount: number; name: string; category: string; bank: string; }) {
  throw new Error('Function not implemented.');
}
