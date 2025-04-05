import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface codeState {
  cotcode?: string;
  taxcode?: string;
  imfcode?: string;
}

type codeProps = {
  code: codeState | null;
};

const initialState: codeProps = {
  code: null,
};

const codeSlice = createSlice({
  name: 'code_and_codestatus',
  initialState,
  reducers: {
    // This is the setUserId action
    setCode(state, action: PayloadAction<codeState>) {
      state.code = action.payload;
    },
    clearCode: (state) => {
      state.code = null; // Clear userId info
    },
  },
});

// Export the action creator and the reducer
export const {setCode, clearCode} = codeSlice.actions; // <-- Ensure this export is correct
export default codeSlice.reducer;
