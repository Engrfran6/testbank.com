import {User} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // This is the setPin action
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

// Export the action creator and the reducer
export const {setUser, clearUser} = userSlice.actions; // <-- Ensure this export is correct
export default userSlice.reducer;
