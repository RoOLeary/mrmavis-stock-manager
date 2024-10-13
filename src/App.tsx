// import { useState } from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux';
import { history, store } from './store';
import { Routes, Route } from 'react-router-dom'
import { HistoryRouter } from 'redux-first-history/rr6'

import './App.css'
import Home from './pages/Home';
import AddProduct from './components/AddProduct'
import ProductList from './components/ProductList'
import OrdersList from './components/OrdersList'
import ProductDetail from './components/ProductDetail'
import PurchaseProduct from './components/PurchaseProduct'
import ThankYou from './pages/ThankYou'

function App() {
  
  return (
    <ReduxStoreProvider store={store}>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/checkout" element={<PurchaseProduct />} />  
          <Route path="/product/add-product" element={<AddProduct />} />  
          <Route path="/product/payment-successful" element={<ThankYou />} />  

        </Routes>
      </HistoryRouter>
    </ReduxStoreProvider>
  )
}

export default App
