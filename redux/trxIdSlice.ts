import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TrxState {
  trxId: string | null;
}

const initialState: TrxState = {
  trxId: null,
};

const trxSlice = createSlice({
  name: 'trxId',
  initialState,
  reducers: {
    // This is the settrxId action
    setTrxId(state, action: PayloadAction<string>) {
      state.trxId = action.payload;
    },
    clearTrxId: (state) => {
      state.trxId = null; // Clear trxId info
    },
  },
});

// Export the action creator and the reducer
export const {setTrxId, clearTrxId} = trxSlice.actions; // <-- Ensure this export is correct
export default trxSlice.reducer;
