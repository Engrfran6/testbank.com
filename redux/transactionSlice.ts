import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Transaction = {
  $id: string;
  amount: string;
  description: string;
  $createdAt: Date;
  type: string;
  status: string;
};

interface TransactionState {
  transaction: Transaction[];
}

const initialState: TransactionState = {
  transaction: [],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransaction(state, action: PayloadAction<Transaction[]>) {
      state.transaction = action.payload;
    },
    clearTransaction(state) {
      state.transaction = []; // ✅ Ensure this clears the transaction state
    },

    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transaction = [...state.transaction, action.payload]; // Add new transaction to the front
    },
  },
});

export const {setTransaction, clearTransaction, addTransaction} = transactionSlice.actions;
export default transactionSlice.reducer;
