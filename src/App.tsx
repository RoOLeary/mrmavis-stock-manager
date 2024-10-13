// import { useState } from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux';
import { history, store } from './store';
import { Routes, Route } from 'react-router-dom'
import { HistoryRouter } from 'redux-first-history/rr6'

import './App.css'
import Home from './pages/Home';
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'

function App() {
  
  return (
    <ReduxStoreProvider store={store}>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          
        </Routes>
      </HistoryRouter>
    </ReduxStoreProvider>
  )
}

export default App
