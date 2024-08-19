import * as SQLite from 'expo-sqlite';
import { Income, type } from '../types';

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

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS income (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        source TEXT,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS balance (
        id INTEGER PRIMARY KEY NOT NULL,
        amount REAL NOT NULL
      );
    `);

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
export const saveBalance = async (amount: number): Promise<void> => {
  try {
    const db = await dbPromise;
    const nonNegativeAmount = Math.max(0, amount); 
    const existingBalance = await db.getFirstAsync('SELECT * FROM balance WHERE id = 1');

    if (existingBalance) {
      await db.runAsync('UPDATE balance SET amount = ? WHERE id = 1', nonNegativeAmount);
    } else {
      await db.runAsync('INSERT INTO balance (id, amount) VALUES (1, ?)', nonNegativeAmount);
    }

    console.log('Balance saved!');
  } catch (error) {
    console.error('Error saving balance:', error);
    throw error;
  }
};

// Function to Get Balance
export const getBalance = async (): Promise<number> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync<Balance>('SELECT amount FROM balance WHERE id = 1');
    return result?.amount ?? 0;
  } catch (error) {
    console.error('Error retrieving balance:', error);
    throw error;
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
    await saveBalance(newBalance);

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

// Function to Save Income
export const saveIncome = async (income: type.Income): Promise<void> => {
  try {
    const db = await dbPromise;

    await db.runAsync(
      'INSERT INTO income (source, amount, date, description) VALUES (?, ?, ?, ?)',
      income.source ?? null,         
      income.amount,
      income.date ?? null,
      income.description ?? null
    );

    // Update income summary
    const currentSummary = await db.getFirstAsync<type.Income>('SELECT total_income FROM income WHERE date = ?', income.date);
    const newTotalIncome = (currentSummary?.total_income ?? 0) + income.amount;
    await saveIncomeSummary(newTotalIncome, income.date);

    // Set change tracker to true
    isDataChanged = true;

    const currentBalance = await getBalance();
    const newBalance = currentBalance + income.amount;
    await saveBalance(newBalance);

    console.log('Income saved and summary updated!');
  } catch (error) {
    console.error('Error saving income:', error);
    throw error;
  }
};

// Function to Save Income Summary
export const saveIncomeSummary = async (totalIncome: number, date: string): Promise<void> => {
  try {
    const db = await dbPromise;

    await db.runAsync(
      'INSERT INTO income (source, amount, date, description) VALUES (?, ?, ?, ?)',
      'Summary',
      totalIncome,
      date,
      null
    );

    console.log('Income summary saved!');
  } catch (error) {
    console.error('Error saving income summary:', error);
    throw error;
  }
};

// Function to Get Recent Income Summary
export const getRecentIncomeSummary = async (): Promise<Income[]> => {
  try {
    const db = await dbPromise;
    return await db.getAllAsync<Income>('SELECT * FROM income ORDER BY date DESC LIMIT 10');
  } catch (error) {
    console.error('Error retrieving recent income summary:', error);
    throw error;
  }
};

// Function to Get All Income
export const getAllIncome = async (): Promise<Income[]> => {
  try {
    const db = await dbPromise;
    return await db.getAllAsync<Income>('SELECT * FROM income ORDER BY date DESC');
  } catch (error) {
    console.error('Error retrieving income:', error);
    throw error;
  }
};
