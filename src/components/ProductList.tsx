import React, { useState, useEffect } from 'react';
import AddProduct from './AddProduct';
import {
  useGetProductListQuery,
  useToggleProductAvailabilityMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../services/productApi';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const { data: products, isLoading, error, refetch } = useGetProductListQuery(); // Fetch tasks
  const [toggleProductAvailability] = useToggleProductAvailabilityMutation(); // Hook to toggle product availability
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [editProductId, setEditProductId] = useState(null); // Track which product is being edited
  const [editedProduct, setEditedProduct] = useState({}); // Track the values in the form

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Display 8 products per page

  // Filters
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [filterName, setFilterName] = useState('');

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Handle field changes
  const handleInputChange = (e: { target: { name: never; value: never; }; }) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Enable edit mode
  const handleEditClick = (product: React.SetStateAction<{}>) => {
    setEditProductId(product.id);
    setEditedProduct(product); // Initialize the form with the current product's values
  };

  const addProduct = () => {
    navigate('/product/add-product');
  };

  const goToOrders = () => {
    navigate('/orders');
  };

  // Save the changes
  const handleSave = () => {
    updateProduct({
      id: editedProduct?.id,           // ID of the product being updated
      updates: {                      // Only pass the fields you want to update
        title: editedProduct?.title,
        description: editedProduct?.description,
        price: editedProduct?.price,
        quantity: editedProduct?.quantity,
        type: editedProduct?.type,
        isAvailable: editedProduct?.quantity > 0 // Only set isAvailable to true if quantity is greater than 0
      }
    });
    setEditProductId(null);  // Exit edit mode after saving
  };

  // Stock Status Logic (displayed based on quantity)
  const getStockStatus = (product: never) => {
    if (product.quantity === 0) return 'Out of Stock'; // Override if quantity is 0
    if (product.quantity > 0 && product.quantity <= 10) return 'Low Stock';
    return product.isAvailable ? 'Available' : 'Unavailable'; // Use isAvailable when quantity > 0
  };

  // Handle Filters
  useEffect(() => {
    let filtered = products || [];

    if (filterType) {
      filtered = filtered.filter(product => product.type === filterType);
    }
    if (filterAvailability) {
      filtered = filtered.filter(product =>
        filterAvailability === 'available'
          ? product.isAvailable
          : !product.isAvailable
      );
    }
    if (filterName) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, filterType, filterAvailability, filterName]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      
      {/* Filter Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Filter by Type</option>
          <option value="t-shirt">T-shirt</option>
          <option value="trousers">Trousers</option>
        </select>

        {/* Filter by Availability */}
        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Filter by Availability</option>
          <option value="available">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        {/* Filter by Name */}
        <input
          type="text"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Filter by Name"
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between mb-6 items-center max-md:flex-col max-md:items-start">
        <h2 className='text-lg font-black'>PRODUCTS: </h2>
        <div className="controls flex max-md:flex-col gap-2">
          <button onClick={goToOrders} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Orders
          </button>
          <button onClick={refetch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Batch Import
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Upload New Stock
          </button>
          <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Product
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-100 border">Title</th>
              <th className="py-2 px-4 bg-gray-100 border">Description</th>
              <th className="py-2 px-4 bg-gray-100 border">Type</th>
              <th className="py-2 px-4 bg-gray-100 border">Price (€)</th>
              <th className="py-2 px-4 bg-gray-100 border">Stock Units</th>
              <th className="py-2 px-4 bg-gray-100 border">Availability</th>
              <th className="py-2 px-4 bg-gray-100 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts?.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                {editProductId === product.id ? (
                  <>
                    {/* Edit Mode */}
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        name="title"
                        value={editedProduct.title || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        name="description"
                        value={editedProduct.description || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <select
                        name="type"
                        value={editedProduct.type || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="t-shirt">T-shirt</option>
                        <option value="trousers">Trousers</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        name="price"
                        value={editedProduct.price || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        name="quantity"
                        value={editedProduct.quantity || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border text-gray-600">
                      {getStockStatus(editedProduct)}
                    </td>
                    <td className="py-2 px-4 border flex space-x-2">
                      <button
                        onClick={() => toggleProductAvailability({ id: editedProduct.id, isAvailable: editedProduct.quantity > 0 })}
                        className={`p-2 rounded ${editedProduct.quantity > 0 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                      >
                        {editedProduct.quantity > 0 ? 'Mark as OOS' : 'Mark as Available'}
                      </button>
                      <button
                        onClick={handleSave}
                        className="p-2 rounded bg-green-500 hover:bg-green-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditProductId(null)}
                        className="p-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* Display Mode */}
                    <td className="py-2 px-4 border text-gray-800">{product.title}</td>
                    <td className="py-2 px-4 border text-gray-600">{product.description}</td>
                    <td className="py-2 px-4 border text-gray-600">{product.type}</td>
                    <td className="py-2 px-4 border text-gray-600">€{product.price}</td>
                    <td className="py-2 px-4 border text-gray-600">{product.quantity}</td>
                    <td className="py-2 px-4 border text-gray-600">
                      {getStockStatus(product)}
                    </td>
                    <td className="py-2 px-4 border flex space-x-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleProductAvailability({ id: product.id, isAvailable: !product.isAvailable })}
                        className={`p-2 rounded ${product.isAvailable ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                      >
                        {product.quantity === 0 ? 'Re-Stock' : product.isAvailable ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 rounded bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded ml-2 hover:bg-gray-400"
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
