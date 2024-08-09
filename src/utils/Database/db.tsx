import * as SQLite from 'expo-sqlite';

const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('expense.db');
};

const dbPromise = openDatabase();

export const initializeDatabase = async () => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        itemName TEXT NOT NULL,
        date TEXT NOT NULL,
        expenseAmount INTEGER NOT NULL,
        description TEXT,
        image TEXT
      );
    `);
    console.log('Database initialized and table created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const saveExpense = async (expense: { itemName: string; date: string; expenseAmount: string; description: string; }) => {
  try {
    const db = await dbPromise;
    const expenseAmount = parseInt(expense.expenseAmount, 10);
    if (isNaN(expenseAmount)) {
      throw new Error('Invalid expense amount');
    }

    const result = await db.runAsync(
      'INSERT INTO expenses (itemName, date, expenseAmount, description, image) VALUES (?, ?, ?, ?, ?)',
      expense.itemName,
      expense.date,
      expenseAmount,
      expense.description,
      // expense.image,
    );

    console.log('Expense saved successfully!', result.lastInsertRowId, result.changes);
    console.log(expense)
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};

export const getRecentExpenses = async () => {
  try {
    const db = await dbPromise;
    const recentExpenses = await db.getAllAsync('SELECT * FROM expenses ORDER BY id DESC LIMIT 7');
    return recentExpenses;
  } catch (error) {
    console.error('Error retrieving recent expenses:', error);
  }
};

export const getAllExpenses = async () => {
  try {
    const db = await dbPromise;
    const allRows = await db.getAllAsync('SELECT * FROM expenses');
    return allRows;
  } catch (error) {
    console.error('Error retrieving expenses:', error);
  }
};

export const getExpenseById = async (id) => {
  try {
    const db = await dbPromise;
    const expense = await db.getFirstAsync('SELECT * FROM expenses WHERE id = ?', id);
    return expense;
  } catch (error) {
    console.error('Error retrieving expense by ID:', error);
  }
};

export const getBalance = async () => {
  try {
    const db = await dbPromise;
    const result = await db.getFirstAsync('SELECT SUM(expenseAmount) as balance FROM expenses');
    const balance = result?.balance || 0;
    return balance;
  } catch (error) {
    console.error('Error retrieving balance:', error);
  }
};