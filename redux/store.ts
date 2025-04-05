import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import accountsReducer from './accountsDataSlice';
import codeReducer from './codeSlice';
import transferReducer from './createTransferDataSlice';
import transactionReducer from './transactionSlice';
import trxIdReducer from './trxIdSlice';
import userReducer from './userSlice';

// Combine all reducers into a single root reducer
const appReducer = combineReducers({
  transaction: transactionReducer,
  user: userReducer,
  accounts: accountsReducer,
  transfer: transferReducer,
  code: codeReducer,
  trxId: trxIdReducer,
});

// Configure persistence
const persistConfig = {
  key: 'root',
  storage,
};

// Root reducer that resets state on logout
const rootReducer = (state: any, action: any) => {
  if (action.type === 'LOGOUT') {
    storage.removeItem('persist:root'); // ✅ Ensure persisted storage is cleared
    return appReducer(undefined, action); // ✅ Reset all slices
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
