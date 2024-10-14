/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { useState, useEffect } from 'react';

const ManageStore = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState('all'); // Filter state

  // Fetch products from mockapi
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data); // Initialize filtered products with all data
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filtering
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterType(value);

    if (value === 'all') {
      setFilteredProducts(products); // Show all products
    } else {
      setFilteredProducts(products.filter((product) => product.type === value)); // Filter by type
    }
  };

  // Function to replenish stock
  const replenishStock = async (product) => {
    let replenishedQuantity;

    if (product.type === 't-shirt') {
      replenishedQuantity = product.quantity + 20;
    } else if (product.type === 'trousers') {
      replenishedQuantity = product.quantity + 15;
    }

    // Ensure quantity does not exceed 100
    if (replenishedQuantity > 100) {
      replenishedQuantity = 100;
    }

    // Update product stock on the server (mockapi)
    try {
      const response = await fetch(`https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: replenishedQuantity }),
      });

      if (response.ok) {
        // Update local state after successful update
        const updatedProducts = products.map((p) =>
          p.id === product.id ? { ...p, quantity: replenishedQuantity } : p
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-6">Manage Store - Replenish Stock</h2>

      {/* Filter Section */}
      <div className="mb-4 flex flex-col sm:flex-row justify-end sm:space-x-4">
        {/* Filter by Type */}
        <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col items-end">
          <label htmlFor="filter" className="block text-sm font-black text-gray-700 mb-2 text-right">Filter by Type</label>
          <select
            id="filter"
            value={filterType}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full sm:w-1/2 md:w-full focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Products</option>
            <option value="t-shirt">T-shirts</option>
            <option value="trousers">Trousers</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <ul className="flex flex-col gap-4">
        {filteredProducts.map((product) => (
          <li
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row sm:justify-between items-center"
          >
            {/* Product Info */}
            <div className="sm:flex-grow sm:flex sm:justify-between items-start flex-col">
              <div>
                <h1 className="text-lg font-semibold mb-2 sm:mb-0 text-left">{product.title}</h1>
                <p>{product.description}</p>
              </div>
              <p className="text-gray-700 font-bold mb-2 sm:mb-0">Stock: {product.quantity}</p>
            </div>

            {/* Button to Replenish Stock */}
            <button
              className="mt-4 sm:mt-0 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              onClick={() => replenishStock(product)}
            >
              Replenish Stock
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageStore;
