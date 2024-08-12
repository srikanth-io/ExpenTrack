
import '../utils/Database/db';

export namespace type {

export interface Expense {
    id?: number;
    itemName: string;
    date?: string | undefined;
    expenseAmount: number;
    description?: string;
    image?: string;
  }
  
  interface Balance {
    id: number;
    amount: number;
    Balance : number;
  }
  
  export type SQLiteResult = {
    changes: {
      changes: number;
    };
    lastInsertRowId: number;
  };
  
export type RootStackParamList = {
  HomePage: undefined;
  EditExpense: { expense: Expense };
};

export type ExpenseItem = Expense;
}

