/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';

import {
  useGetOrdersListQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from '../services/orderApi';

import { useUpdateProductMutation } from '../services/productApi'; // Import product mutation
import { useNavigate } from 'react-router-dom';

const OrdersList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersListQuery(); // Fetch orders
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [updateProduct] = useUpdateProductMutation(); // Product update hook

  const [editOrderId, setEditOrderId] = useState(null); // Track which order is being edited
  const [editedOrder, setEditedOrder] = useState({}); // Track the values in the form

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8; // Display 8 orders per page

  // Filters
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState(''); // Filter by Type
  const [filterStatus, setFilterStatus] = useState(''); // Filter by Status

  const [totalRevenue, setTotalRevenue] = useState(0); // Track total revenue

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Handle status field changes
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setEditedOrder((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // Enable edit mode
  const handleEditClick = (order) => {
    setEditOrderId(order.id);
    setEditedOrder(order); // Initialize the form with the current order's values
  };

  const goToProducts = () => {
    navigate('/products');
  };

  // Save the changes
  const handleSave = async () => {
    const prevOrder = orders.find((order) => order.id === editOrderId); // Get the previous order before editing

    // Update the order status
    await updateOrder({
      id: editOrderId,
      updates: {
        status: editedOrder.status,
      },
    });

    // If the order is cancelled, update the product stock and total revenue
    if (editedOrder.status === 'cancelled') {
      // Update product stock
      await updateProduct({
        id: prevOrder.product.id, // Assuming `product` field exists in the order object
        updates: {
          quantity: prevOrder.product.quantity + prevOrder.quantity, // Add back the ordered quantity to stock
        },
      }).catch((error) => {
        console.error('Error updating product stock:', error);
      });

      // Update total revenue by subtracting the cancelled order's total
      setTotalRevenue((prevTotal) => prevTotal - prevOrder.total);
    }

    setEditOrderId(null); // Exit edit mode after saving
  };

  // Handle Filters
  useEffect(() => {
    let filtered = orders || [];

    if (filterType) {
      filtered = filtered.filter((order) => order.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    setFilteredOrders(filtered);

    // Calculate total revenue
    const total = filtered.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    setTotalRevenue(total);
  }, [orders, filterType, filterStatus]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders?.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredOrders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders...</p>;

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

        {/* Filter by Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Filter by Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-lg font-black">ORDERS:</h2>
        <div className="controls flex gap-2">
          <button
            onClick={goToProducts}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Products
          </button>
          <button
            onClick={refetch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Resync
          </button>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-100 border">Title</th>
              <th className="py-2 px-4 bg-gray-100 border">Description</th>
              <th className="py-2 px-4 bg-gray-100 border">Type</th>
              <th className="py-2 px-4 bg-gray-100 border">Price (€)</th>
              <th className="py-2 px-4 bg-gray-100 border">Quantity</th>
              <th className="py-2 px-4 bg-gray-100 border">Total</th>
              <th className="py-2 px-4 bg-gray-100 border">Status</th>
              <th className="py-2 px-4 bg-gray-100 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders?.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                {editOrderId === order.id ? (
                  <>
                    {/* Edit Mode: Only Status is Editable */}
                    <td className="py-2 px-4 border">{order.title}</td>
                    <td className="py-2 px-4 border">{order.description}</td>
                    <td className="py-2 px-4 border">{order.type}</td>
                    <td className="py-2 px-4 border">€{order.price}</td>
                    <td className="py-2 px-4 border">{order.quantity}</td>
                    <td className="py-2 px-4 border">€{order.total}</td>
                    <td className="py-2 px-4 border">
                      <select
                        name="status"
                        value={editedOrder.status}
                        onChange={handleStatusChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="p-2 rounded bg-green-500 hover:bg-green-600 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditOrderId(null)}
                        className="p-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* Display Mode */}
                    <td className="py-2 px-4 border text-gray-800">{order.title}</td>
                    <td className="py-2 px-4 border text-gray-600">{order.description}</td>
                    <td className="py-2 px-4 border text-gray-600">{order.type}</td>
                    <td className="py-2 px-4 border text-gray-600">€{order.price}</td>
                    <td className="py-2 px-4 border text-gray-600">{order.quantity}</td>
                    <td className="py-2 px-4 border text-gray-600">€{order.total}</td>
                    <td className="py-2 px-4 border text-gray-600">{order.status}</td>
                    <td className="py-2 px-4 border flex space-x-2">
                      <button
                        onClick={() => handleEditClick(order)}
                        className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
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

      {/* Total Revenue Display */}
      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold">Total Revenue: €{totalRevenue.toFixed(2)}</h3>
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
          disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersList;
