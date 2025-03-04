import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface EmailPasswordState {
  email: string | null;
  password: string | null;
}

type DataState = {
  data: EmailPasswordState | null;
};

const initialState: DataState = {
  data: null,
};

const emailPasswordSlice = createSlice({
  name: 'emailPassword',
  initialState,
  reducers: {
    // This is the setEmailPassword action
    setEmailPassword(state, action: PayloadAction<EmailPasswordState>) {
      state.data = action.payload;
    },
    clearEmailPassword: (state) => {
      state.data = null; // Clear EmailPassword info
    },
  },
});

// Export the action creator and the reducer
export const {setEmailPassword} = emailPasswordSlice.actions; // <-- Ensure this export is correct
export default emailPasswordSlice.reducer;
