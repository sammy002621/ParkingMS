import { combineReducers, configureStore  } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';;
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userReducer";

const persitConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  userSlice: userReducer,
});

const persistedReducer = persistReducer(persitConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
