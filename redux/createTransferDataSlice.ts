import {CreateTransactionProps} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TransferState {
  TransactionDetails: CreateTransactionProps | null;
  accountId: string | null;
  otp: string | null;
}

const initialState: TransferState = {
  TransactionDetails: null,
  accountId: null,
  otp: null,
};

const TransactionDetailsSlice = createSlice({
  name: 'createTransfer',
  initialState,
  reducers: {
    // This is the setPin action
    setTransactionDetails(state, action: PayloadAction<CreateTransactionProps>) {
      state.TransactionDetails = action.payload;
    },
    setAccountId(state, action: PayloadAction<string>) {
      state.accountId = action.payload;
    },
    setOtp(state, action: PayloadAction<string>) {
      state.otp = action.payload;
    },
    clearTansactionDetails(state) {
      state.TransactionDetails = null;
    },
  },
});

// Export the action creator and the reducer
export const {setTransactionDetails, setAccountId, setOtp, clearTansactionDetails} =
  TransactionDetailsSlice.actions; // <-- Ensure this export is correct
export default TransactionDetailsSlice.reducer;
