import { collection, addDoc, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
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

// Function to Update Total 
export const updateTotalExpense = async (totalAmount: number) => {
  try {
    const totalExpenseDoc = doc(db, 'financialSummary', 'totalExpense'); // Collection 'financialSummary', document 'totalExpense'
    await setDoc(totalExpenseDoc, { amount: totalAmount });
    console.log('Total expense updated successfully');
  } catch (error) {
    console.error('Error updating total expense in Firestore:', error);
    throw new Error('Failed to update total expense.');
  }
};

// Function to Get the Balance
export const getBalance = async (): Promise<number> => {
  try {
    const balanceDoc = doc(db, 'balance', 'current'); // Collection 'balance', document 'current'
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
    const incomeDoc = doc(db, 'income', 'current'); // Collection 'income', document 'current'
    const docSnap = await getDoc(incomeDoc);
    const data = docSnap.exists() ? docSnap.data() : { amount: 0 };
    return data.amount || 0;
  } catch (error) {
    console.error('Error fetching income from Firestore:', error);
    throw new Error('Failed to fetch income.');
  }
};


// Function to Get Total Expense
export const getExpense = async (): Promise<number> => {
  try {
    const expenseDoc = doc(db, 'financialSummary', 'totalExpense'); // Document 'totalExpense' in collection 'financialSummary'
    const docSnap = await getDoc(expenseDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.amount || 0;
    } else {
      console.warn('No expense document found.');
      return 0;
    }
  } catch (error) {
    console.error('Error fetching expense from Firestore:', error);
    throw new Error('Failed to fetch expense.');
  }
};

// Function to Save Balance and Entry
export const saveBalance = async (newBalance: number, entry: { amount: number; name: string; category: string; bank: string; date: string }) => {
  try {
    // Update the balance document with the new amount
    const balanceDoc = doc(db, 'balance', 'current');
    await setDoc(balanceDoc, { amount: newBalance });

    // Save additional information about the balance entry
    await addDoc(collection(db, 'balanceEntries'), entry);

    console.log('Balance and entry saved successfully!');
  } catch (error) {
    console.error('Error saving balance:', error);
    throw new Error('Failed to save balance.');
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


type Expense = {
  expenseAmount: number;
  amount: number;
  name: string;
  category: string;
  bank: string;
  date: string;
};

// Function to Save Expenses
export const saveExpense = async (expense: Expense) => {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), expense);
    console.log('Expense document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding expense document: ', error);
    throw new Error('Failed to add expense document.');
  }
};

type BalanceEntry = {
  amount: number;
  name: string;
  category: string;
  bank: string;
  date: string;
};

// Function to Get Balance History
export const getBalanceHistory = async (): Promise<BalanceEntry[]> => {
  try {
    const balanceEntriesCollection = collection(db, 'balanceEntries'); // Adjust the collection name if necessary
    const snapshot = await getDocs(balanceEntriesCollection);
    const entriesList: BalanceEntry[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as BalanceEntry[];
    
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
    })) as unknown as Expense[];
    
    return expensesList;
  } catch (error) {
    console.error('Error fetching expense history from Firestore:', error);
    throw new Error('Failed to fetch expense history.');
  }
};



// Function to Update Income Entry
export const updateIncomeEntry = async (id: string, updatedData: { name?: string; date?: string; amount?: number; description?: string }) => {
  try {
    // Fetch the current income
    const incomeDoc = doc(db, 'incomeEntries', id);
    const incomeSnap = await getDoc(incomeDoc);
    const currentIncome = incomeSnap.exists() ? incomeSnap.data().amount : 0;

    // Update the income entry
    await setDoc(incomeDoc, updatedData, { merge: true });
    
    // Update balance based on the new amount
    const newIncome = updatedData.amount ?? currentIncome; // Use the updated amount or fallback to currentIncome
    const currentBalance = await getCurrentBalance();
    const balanceChange = (newIncome - currentIncome); // Calculate the change in balance
    const newBalance = currentBalance + balanceChange; // Update balance

    // Save the new balance
    const balanceDoc = doc(db, 'balance', 'current');
    await setDoc(balanceDoc, { amount: newBalance });

    console.log('Income entry and balance updated successfully!');
  } catch (error) {
    console.error('Error updating income entry:', error);
    throw new Error('Failed to update income entry.');
  }
};

// Function to Get the Current Balance
const getCurrentBalance = async (): Promise<number> => {
  try {
    const balanceDoc = doc(db, 'balance', 'current'); // Collection 'balance', document 'current'
    const docSnap = await getDoc(balanceDoc);
    const data = docSnap.exists() ? docSnap.data() : { amount: 0 };
    return data.amount || 0;
  } catch (error) {
    console.error('Error fetching balance from Firestore:', error);
    throw new Error('Failed to fetch balance.');
  }
};