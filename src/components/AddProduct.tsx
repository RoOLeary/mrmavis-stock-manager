// @ts-nocheck
import { useState } from 'react';
import { useCreateProductMutation } from '../services/productApi';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const AddProduct = () => {
  const [addProduct] = useCreateProductMutation(); // Hook to add a new product
  const navigate = useNavigate(); // Initialize the navigate hook
  const [productTitle, setProductTitle] = useState(''); // Local state for product title
  const [productDescription, setProductDescription] = useState(''); // Local state for product description
  const [productPrice, setProductPrice] = useState(''); // Local state for product price
  const [productQuantity, setProductQuantity] = useState(''); // Local state for product quantity
  const [productType, setProductType] = useState(''); // Local state for product type

  const handleSubmit = async () => {
    if (productTitle.trim()) {
      // Trigger the addProduct mutation
      await addProduct({
        title: productTitle,
        description: productDescription, // Product description
        price: productPrice,
        isAvailable: (productQuantity > 0) ? true : false, // Check availability based on quantity
        quantity: productQuantity, // Product quantity
        type: productType, // Product type
      });
      // Clear the input fields after adding
      setProductTitle('');
      setProductDescription('');
      setProductPrice('');
      setProductQuantity('');
      setProductType('');

      // Redirect to the /orders page after product creation
      navigate('/orders');
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
        <input
          type="text"
          value={productTitle}
          onChange={(e) => setProductTitle(e.target.value)}
          placeholder="Product Name"
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Product Description"
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>Select Product Type</option>
          <option value="t-shirt">T-shirt</option>
          <option value="trousers">Trousers</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Price (€)</label>
        <select
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>Select Price</option>
          <option value="10">€10.00</option>
          <option value="20">€20.00</option>
          <option value="30">€30.00</option>
          <option value="50">€50.00</option>
          <option value="100">€100.00</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Quantity</label>
        <select
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>Select Quantity</option>
          {[...Array(101).keys()].map((quantity) => (
            <option key={quantity} value={quantity}>
              {quantity}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
