
import '../utils/Database/db';

export namespace type {

export interface Expense {
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
  Income : any;
}
