import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface PinState {
  pin: string | null;
}

const initialState: PinState = {
  pin: null,
};

const pinSlice = createSlice({
  name: 'pin',
  initialState,
  reducers: {
    // This is the setPin action
    setPin(state, action: PayloadAction<string>) {
      state.pin = action.payload;
    },
    clearPin: (state) => {
      state.pin = null; // Clear pin info
    },
  },
});

// Export the action creator and the reducer
export const {setPin, clearPin} = pinSlice.actions; // <-- Ensure this export is correct
export default pinSlice.reducer;
