import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateProductMutation } from '../services/productApi'; // Import product mutation
import { useCreateOrderMutation } from '../services/orderApi'; // Import order mutation

const PurchaseProduct = () => {
  const { state } = useLocation(); // Get product and quantity from the passed state
  const product = state?.product;
  const [quantity, setQuantity] = useState(state?.quantity || 1); // Default to 1 if quantity is not passed
  const navigate = useNavigate();
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [updateProduct] = useUpdateProductMutation(); // Hook to update product quantity
  const [createOrder] = useCreateOrderMutation(); // Hook to create a new order

  const handleQuantityChange = (e) => setQuantity(e.target.value);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // 1. Update the product stock by reducing the quantity
    await updateProduct({
      id: product.id,
      updates: {
        quantity: product.quantity - quantity // Reduce product quantity
      }
    });

    // 2. Create a new order with the submitted information
    await createOrder({
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: quantity, // Store the ordered quantity
      total: (product.price * quantity).toFixed(2), // Calculate the total price
      status: 'paid', // Mark the order as paid
      type: product.type,
      orderId: Math.floor(Math.random() * 1000) // Dummy order ID
    });

    // 3. Navigate to the payment success page
    navigate('/product/payment-successful');
  };

  return (
    <div className="container mx-auto py-8">
      {product && (
        <div>
          <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-green-600 mb-4">€{product.price}</p>

          {/* Quantity Selector */}
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <select
            value={quantity}
            onChange={handleQuantityChange}
            className="border rounded p-2 w-24 mb-4"
          >
            {[...Array(product.quantity).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>

          {/* Total Price */}
          <p className="text-lg font-semibold text-gray-600 mb-6">
            Total Price: €{(product.price * quantity).toFixed(2)}
          </p>

          {/* Payment Form */}
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

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
              >
                Submit Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseProduct;
