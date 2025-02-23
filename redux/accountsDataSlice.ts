import {Account} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AccountsState {
  data: Account[];
  transactions: [];
  cards: [];
  totalBanks: number;
  totalAvalaibleBalance: number;
  totalCurrentBalance: number;
  totalCredit: number;
  totalDebit: number;
}

type DataState = {
  data: AccountsState | null;
};

const initialState: DataState = {
  data: null,
};

const accountsDataSlice = createSlice({
  name: 'Accounts',
  initialState,
  reducers: {
    // This is the setAccountsData action
    setAccountsData(state, action: PayloadAction<AccountsState>) {
      state.data = action.payload;
    },
  },
});

// Export the action creator and the reducer
export const {setAccountsData} = accountsDataSlice.actions;
export default accountsDataSlice.reducer;
