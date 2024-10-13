import { configureStore } from '@reduxjs/toolkit';
import { productApi } from './services/productApi';
import { orderApi } from './services/orderApi';
import { setupListeners } from '@reduxjs/toolkit/query'
import { createBrowserHistory } from 'history'
import { combineReducers } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'

// src/store.js
const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() })

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      orderApi.middleware,
      routerMiddleware,
    ]), // Add taskApi.middleware
  reducer: combineReducers({
    router: routerReducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer
  }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
export const history = createReduxHistory(store)