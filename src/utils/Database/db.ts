import * as SQLite from 'expo-sqlite';
import { type } from '../types';

type Balance = any;

type Database = ReturnType<typeof SQLite.openDatabaseAsync>;

const openDatabase = async (): Promise<Database> => {
  return await SQLite.openDatabaseAsync('expense.db');
};

const dbPromise = openDatabase();

export const initializeDatabase = async (): Promise<void> => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        category TEXT NOT NULL,
        itemName TEXT NOT NULL,
        date TEXT NOT NULL,
        expenseAmount REAL NOT NULL,
        description TEXT,
        image TEXT
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS balance (
        id INTEGER PRIMARY KEY NOT NULL,
        amount REAL NOT NULL
      );
    `);

    const result = await db.getFirstAsync('SELECT * FROM balance WHERE id = 1');
    if (!result) {
      await db.runAsync('INSERT INTO balance (id, amount) VALUES (1, 0)');
    }

    console.log('Database initialized and tables created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Function to save an expense
export const saveExpense = async (expense: type.Expense): Promise<void> => {
  try {
    const db = await dbPromise;

    // Insert the expense with category
    const result = await db.runAsync(
      'INSERT INTO expenses (category, itemName, date, expenseAmount, description, image) VALUES (?, ?, ?, ?, ?, ?)',
      expense.category,         
      expense.itemName,
      expense.date ?? null,
      expense.expenseAmount,
      expense.description ?? null,
      expense.image ?? null
    );

    // Update the balance
    const currentBalance = await getBalance();
    const newBalance = currentBalance - expense.expenseAmount;
    await saveBalance(newBalance);

    console.log('Expense saved successfully!', result.lastInsertRowId, result.changes);
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};

// Function to get recent expenses
export const getRecentExpenses = async (): Promise<type.Expense[]> => {
  try {
    const db = await dbPromise;
    const recentExpenses = await db.getAllAsync<type.Expense>('SELECT * FROM expenses ORDER BY id DESC LIMIT 10');
    return recentExpenses;
  } catch (error) {
    console.error('Error retrieving recent expenses:', error);
    throw error;
  }
};

// Function to get all expenses
export const getAllExpenses = async (): Promise<type.Expense[]> => {
  try {
    const db = await dbPromise;
    const allRows = await db.getAllAsync<type.Expense>('SELECT * FROM expenses ORDER BY date DESC');
    return allRows;
  } catch (error) {
    console.error('Error retrieving expenses:', error);
    throw error;
  }
};

// Function to get an expense by ID
export const getExpenseById = async (id: number): Promise<type.Expense | undefined | null> => {
  try {
    const db = await dbPromise;
    const expense = await db.getFirstAsync<type.Expense>('SELECT * FROM expenses WHERE id = ?', id);
    return expense;
  } catch (error) {
    console.error('Error retrieving expense by ID:', error);
    throw error;
  }
};

// Function to get the balance
export const getBalance = async (): Promise<number> => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync<Balance>('SELECT amount FROM balance WHERE id = 1');
    const balance = result?.amount ?? 0;
    return balance;
  } catch (error) {
    console.error('Error retrieving balance:', error);
    throw error;
  }
};

// Function to save the balance with non-negative check
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

    console.log('Balance saved successfully!');
  } catch (error) {
    console.error('Error saving balance:', error);
    throw error;
  }
};

// Function to update an expense
export const updateExpense = async (expense: type.Expense): Promise<void> => {
  try {
    const db = await dbPromise;

    // Get the current expense to update balance
    const currentExpense = await getExpenseById(expense.id);

    if (currentExpense) {
      // Update the expense
      await db.runAsync(
        'UPDATE expenses SET category = ?, itemName = ?, date = ?, expenseAmount = ?, description = ?, image = ? WHERE id = ?',
        expense.category,           
        expense.itemName,
        expense.date ?? null,
        expense.expenseAmount,
        expense.description ?? null,
        expense.image ?? null,
        expense.id
      );

      // Update the balance
      const currentBalance = await getBalance();
      const newBalance = currentBalance + (currentExpense.expenseAmount - expense.expenseAmount);
      await saveBalance(newBalance);

      console.log('Expense updated successfully!');
    }
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};
