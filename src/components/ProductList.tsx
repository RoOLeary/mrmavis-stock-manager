/* eslint-disable @typescript-eslint/no-empty-object-type */
// @ts-nocheck
import { useState, useEffect } from 'react';
import {
  useGetProductListQuery,
  useToggleProductAvailabilityMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../services/productApi';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const { data: products, isLoading, error, refetch } = useGetProductListQuery(null, {
    pollingInterval: 15000,
  });

  const [toggleProductAvailability] = useToggleProductAvailabilityMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [filterName, setFilterName] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditedProduct(product);
  };

  const addProduct = () => {
    navigate('/product/add-product');
  };

  const goToOrders = () => {
    navigate('/admin/orders');
  };

  const manageStore = () => {
    navigate('/admin/manage-store');
  }

  const handleSave = async () => {
    await updateProduct({
      id: editedProduct?.id,
      updates: {
        title: editedProduct?.title,
        description: editedProduct?.description,
        price: editedProduct?.price,
        quantity: editedProduct?.quantity,
        type: editedProduct?.type,
        isAvailable: editedProduct?.quantity > 0,
      },
    });
    refetch();
    setEditProductId(null);
  };

  const getStockStatus = (product) => {
    if (product.quantity === 0) return 'Out of Stock';
    if (product.quantity > 0 && product.quantity <= 10) return 'Low Stock';
    return product.isAvailable ? 'Available' : 'Unavailable';
  };

  useEffect(() => {
    let filtered = products || [];

    if (filterType) {
      filtered = filtered.filter((product) => product.type === filterType);
    }
    if (filterAvailability) {
      filtered = filtered.filter((product) =>
        filterAvailability === 'available' ? product.isAvailable : !product.isAvailable
      );
    }
    if (filterName) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [products, filterType, filterAvailability, filterName]);

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Filter by Type</option>
          <option value="t-shirt">T-shirt</option>
          <option value="trousers">Trousers</option>
        </select>

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

        <input
          type="text"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Filter by Name"
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 items-stretch space-y-4 sm:space-y-0 sm:space-x-4">
        <h2 className="text-lg font-black">PRODUCTS: </h2>
        <div className="controls flex flex-col sm:flex-row gap-2">
          <button
            onClick={goToOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Orders
          </button>
          <button onClick={manageStore} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Manage Store
          </button>
        
          <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Product
          </button>
        </div>
      </div>

      {/* Product List Panel/Table */}
      <div className="block sm:hidden">
        {currentProducts?.map((product) => (
          <div key={product.id} className="bg-white border p-4 mb-4 rounded shadow-md text-left">
            <h3 className="font-bold text-lg">{product.title}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p>
              <strong>Type:</strong> {product.type}
            </p>
            <p>
              <strong>Price:</strong> €{product.price}
            </p>
            <p>
              <strong>Stock:</strong> {product.quantity} ({getStockStatus(product)})
            </p>
            {editProductId === product.id ? (
              <div className="mt-4 space-y-2">
                {/* Editable form */}
                <input
                  type="text"
                  name="title"
                  value={editedProduct.title}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="number"
                  name="quantity"
                  value={editedProduct.quantity}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditProductId(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleProductAvailability({ id: product.id, isAvailable: !product.isAvailable })}
                  className={`px-4 py-2 rounded ${product.isAvailable ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                  {product.isAvailable ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
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
                    <td className="py-2 px-4 flex space-x-2">
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
                    <td className="py-2 px-4 border">{product.title}</td>
                    <td className="py-2 px-4 border">{product.description}</td>
                    <td className="py-2 px-4 border">{product.type}</td>
                    <td className="py-2 px-4 border">€{product.price}</td>
                    <td className="py-2 px-4 border">{product.quantity}</td>
                    <td className="py-2 px-4 border">{getStockStatus(product)}</td>
                    <td className="py-2 px-4 flex space-x-2">
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
                        {product.isAvailable ? 'Disable' : 'Enable'}
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
