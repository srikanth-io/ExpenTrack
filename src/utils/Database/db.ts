import { collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Auth/fireBaseConfig'; 

// Function to Save a Balance Entry
export const saveBalanceEntry = async (balanceEntry: any) => {
  try {
    await addDoc(collection(db, 'balanceEntries'), balanceEntry);
    console.log('Balance entry saved successfully!');
  } catch (error) {
    console.error('Error saving balance entry:', error);
    throw new Error('Failed to save balance entry.');
  }
};

// Function to Update the Balance
export const updateBalance = async (newBalance: number) => {
  try {
    const balanceDoc = doc(db, 'balance', 'current'); // Collection 'balance', document 'current'
    await setDoc(balanceDoc, { amount: newBalance });
    console.log('Balance updated successfully!');
  } catch (error) {
    console.error('Error updating balance:', error);
    throw new Error('Failed to update balance.');
  }
};

// Function to Get the Balance
export const getBalance = async (): Promise<number> => {
  try {
    const balanceDoc = doc(db, 'balance', 'current'); // Adjust collection and document id as necessary
    const docSnap = await getDoc(balanceDoc);
    const data = docSnap.exists() ? docSnap.data() : { amount: 0 };
    return data.amount || 0;
  } catch (error) {
    console.error('Error fetching balance from Firestore:', error);
    throw new Error('Failed to fetch balance.');
  }
};

// Function to Get Income
export const getIncome = async (): Promise<number> => {
  try {
    const incomeDoc = doc(db, 'income', 'current'); // Adjust collection and document id as necessary
    const docSnap = await getDoc(incomeDoc);
    const data = docSnap.exists() ? docSnap.data() : { amount: 0 };
    return data.amount || 0;
  } catch (error) {
    console.error('Error fetching income from Firestore:', error);
    throw new Error('Failed to fetch income.');
  }
};

// Function to Save Income
export const saveIncome = async (newIncome: number) => {
  try {
    const incomeDoc = doc(db, 'income', 'current'); // Collection 'income', document 'current'
    await setDoc(incomeDoc, { amount: newIncome });
    console.log('Income updated successfully!');
  } catch (error) {
    console.error('Error saving income:', error);
    throw new Error('Failed to save income.');
  }
};

type Expense = any;

// Function to Save Expenses
export const saveExpense = async (expense: Expense) => {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), expense);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

type BalanceEntry = any;

// Function to Get Balance History
export const getBalanceHistory = async (): Promise<BalanceEntry[]> => {
  try {
    const balanceEntriesCollection = collection(db, 'balanceEntries'); // Adjust the collection name if necessary
    const snapshot = await getDocs(balanceEntriesCollection);
    const entriesList: BalanceEntry[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BalanceEntry[];
    
    return entriesList;
  } catch (error) {
    console.error('Error fetching balance history from Firestore:', error);
    throw new Error('Failed to fetch balance history.');
  }
};


// Function to Get Expense History
export const getExpenseHistory = async (): Promise<Expense[]> => {
  try {
    const expensesCollection = collection(db, 'expenses'); // Adjust the collection name if necessary
    const snapshot = await getDocs(expensesCollection);
    const expensesList: Expense[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
    
    return expensesList;
  } catch (error) {
    console.error('Error fetching expense history from Firestore:', error);
    throw new Error('Failed to fetch expense history.');
  }
};