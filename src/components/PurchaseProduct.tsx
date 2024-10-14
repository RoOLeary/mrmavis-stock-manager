import { useState } from 'react';
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

  const [errors, setErrors] = useState({ cardNumber: '', expiryDate: '', cvv: '' }); // State to store validation errors

  const [updateProduct] = useUpdateProductMutation(); // Hook to update product quantity
  const [createOrder] = useCreateOrderMutation(); // Hook to create a new order

  // Handle quantity change
  const handleQuantityChange = (e: { target: { value: any; }; }) => setQuantity(e.target.value);

  // Basic validation function
  const validatePaymentDetails = () => {
    let valid = true;
    const newErrors = { cardNumber: '', expiryDate: '', cvv: '' };

    // Validate card number (16 digits, grouped by 4)
    const cardNumberRegex = /^(\d{4} \d{4} \d{4} \d{4})$/;
    if (!cardNumberRegex.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be in the format 1234 5678 9123 4567';
      valid = false;
    }

    // Validate expiry date (MM/YY)
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDateRegex.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in the format MM/YY';
      valid = false;
    }

    // Validate CVV (3 digits)
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
      newErrors.cvv = 'CVV must be a 3-digit number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle payment form submit
  const handlePaymentSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Check if the payment details are valid
    if (!validatePaymentDetails()) {
      return;
    }

    // 1. Update the product stock by reducing the quantity
    await updateProduct({
      id: product.id,
      updates: {
        quantity: product.quantity - quantity, // Reduce product quantity
      },
    });

    // 2. Create a new order with the submitted information
    await createOrder({
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: quantity, // Store the ordered quantity
      // @ts-ignore
      total: (product.price * quantity).toFixed(2), // Calculate the total price
      status: 'paid', // Mark the order as paid
      type: product.type,
      orderId: Math.floor(Math.random() * 1000), // Dummy order ID
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
                  className={`border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cardNumber ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className={`border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className={`border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvv ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
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
