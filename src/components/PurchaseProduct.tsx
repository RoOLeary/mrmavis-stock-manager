import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../services/productApi';
import { useNavigate } from 'react-router-dom';

const PurchaseProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const [quantity, setQuantity] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
    const navigate = useNavigate();
  const handleQuantityChange = (e) => setQuantity(e.target.value);

  const handleOrder = () => {
    // Add order logic here
    console.log(`Ordered ${quantity} of ${product.title}`);
    navigate('/product/checkout')
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted:', { cardNumber, expiryDate, cvv });
    // Hook up payment logic here
    navigate('/product/payment-successful')
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading product details...</p>;

  return (
    <div className="container mx-auto py-8">
      <a href="/">Back to Products</a>
      
      {/* Dummy Payment Form */}
      <div className="payment-form mt-12">
        <h3 className="text-2xl font-bold mb-4">Payment Information</h3>
        <form onSubmit={handlePaymentSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9123 4567"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Payment */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseProduct;
