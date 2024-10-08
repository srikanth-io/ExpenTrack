
import '../utils/Database/db';

export namespace type {

export interface Expense {
    index: number;
    category: any;
    id?: number | any;
    itemName: string;
    date?: string | undefined | null;
    expenseAmount: number;
    description?: string;
    image?: string;
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


export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  token: string;
};


export type Income = {
  source: null;
  amount(arg0: string, arg1: any, amount: any, arg3: any, arg4: any): unknown;
  date: null;
  description: null;
  Income : any;
}
