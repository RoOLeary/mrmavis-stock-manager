import { useLocation } from 'react-router-dom';

// @ts-expect-error
const ThankYou = ({ orderNum }:string) => {

    const location = useLocation();
    const { orderId } = location.state || {}; // Get the orderId from state
  
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your order has been placed successfully.
        </p>
        <p className="text-xl font-semibold text-green-600 mb-4">
        {orderId && <p>Your Order ID is: {orderId}</p>}
        </p>
        <p className="text-lg text-gray-600 mb-6">
          We will notify you when your order is on the way.
        </p>

        <div className="flex justify-center space-x-4">
          <a
            href="/"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Back to Store
          </a>
          <a
            href="/admin/orders"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            View Orders
          </a>
          <a
            href="/admin/products"
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            Manage Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
