// @ts-nocheck
import { useState, useEffect } from 'react';
import {
  useGetOrdersListQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from '../services/orderApi';
import { useUpdateProductMutation } from '../services/productApi';
import { useNavigate } from 'react-router-dom';

// Define the Order interface
interface Order {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
  product: {
    id: string;
    quantity: number;
  };
}

const OrdersList = () => {
  // Fetch orders with polling interval for real-time updates
  const { data: orders = [], isLoading, error, refetch } = useGetOrdersListQuery(null, {
    pollingInterval: 10000, // Poll every 10 seconds
  });
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [editOrderId, setEditOrderId] = useState<string | null>(null); // Track which order is being edited
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({}); // Track the values in the form

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterType, setFilterType] = useState(''); // Filter by Type
  const [filterStatus, setFilterStatus] = useState(''); // Filter by Status

  const [totalRevenue, setTotalRevenue] = useState(0); // Track total revenue
  const navigate = useNavigate();

  // Handle status field changes
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setEditedOrder((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // Enable edit mode
  const handleEditClick = (order: Order) => {
    setEditOrderId(order.id);
    setEditedOrder(order); // Initialize the form with the current order's values
  };

  const goToProducts = () => {
    navigate('/admin/products');
  };

  const manageStore = () => {
    navigate('/admin/manage-store');
  };

  // Save the changes
  const handleSave = async () => {
    const prevOrder = orders.find((order) => order.id === editOrderId); // Get the previous order before editing

    if (prevOrder) {
      // Update the order status
      await updateOrder({
        id: editOrderId!,
        updates: {
          status: editedOrder.status!,
        },
      });

      // If the order is cancelled, update the product stock and total revenue
      if (editedOrder.status === 'cancelled') {
        await updateProduct({
          id: prevOrder.product.id,
          updates: {
            quantity: prevOrder.product.quantity + prevOrder.quantity,
          },
        }).catch((error) => {
          console.error('Error updating product stock:', error);
        });

        setTotalRevenue((prevTotal) => prevTotal - prevOrder.total);
      }

      setEditOrderId(null);
      refetch();
    }
  };

  // Handle Filters and Sorting
  useEffect(() => {
    let filtered = orders;

    if (filterType) {
      filtered = filtered.filter((order) => order.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Sort by createdAt (descending)
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredOrders(filtered);

    // Calculate total revenue
    const total = filtered.reduce((sum, order) => sum + parseFloat(order.total?.toString() || '0'), 0);
    setTotalRevenue(total);
  }, [orders, filterType, filterStatus]);

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
      <div className="flex flex-col sm:flex-row justify-between mb-6 items-stretch space-y-4 sm:space-y-0 sm:space-x-4">
        <h2 className="text-lg font-black">ORDERS:</h2>
        <div className="controls flex flex-col sm:flex-row gap-2">
          <button
            onClick={goToProducts}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Products
          </button>
          <button
            onClick={manageStore}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Manage Store
          </button>
        </div>
      </div>

      {/* Mobile Layout: Order Cards */}
      <div className="block sm:hidden">
        {currentOrders?.map((order) => (
          <div key={order.id} className="bg-white border p-4 mb-4 rounded shadow-md text-left">
            <h3 className="font-bold text-lg">{order.title}</h3>
            <p className="text-gray-600">{order.description}</p>
            <p>
              <strong>Type:</strong> {order.type}
            </p>
            <p>
              <strong>Price:</strong> €{order.price}
            </p>
            <p>
              <strong>Quantity:</strong> {order.quantity}
            </p>
            <p>
              <strong>Total:</strong> €{order.total}
            </p>
            {editOrderId === order.id ? (
              <div className="mt-4">
                <select
                  value={editedOrder.status}
                  onChange={handleStatusChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditOrderId(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditClick(order)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Layout: Table */}
      <div className="hidden sm:block overflow-x-auto">
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
                <td className="py-2 px-4 border">{order.title}</td>
                <td className="py-2 px-4 border">{order.description}</td>
                <td className="py-2 px-4 border">{order.type}</td>
                <td className="py-2 px-4 border">€{order.price}</td>
                <td className="py-2 px-4 border">{order.quantity}</td>
                <td className="py-2 px-4 border">€{order.total}</td>
                <td className="py-2 px-4 border">
                  {editOrderId === order.id ? (
                    <select
                      value={editedOrder.status}
                      onChange={handleStatusChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    order.status
                  )}
                </td>
                <td className="py-2 px-4 border flex space-x-2">
                  {editOrderId === order.id ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </td>
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
