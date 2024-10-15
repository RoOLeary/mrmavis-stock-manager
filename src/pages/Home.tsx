// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productImg_tshirt from  './../assets/tshirt.png'; 
import productImg_trousers from './../assets/trousers.png';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productTypeFilter, setProductTypeFilter] = useState('all'); // For filtering by type
    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const [productsPerPage, setProductsPerPage] = useState(8); // Display 8 products per page by default

    const navigate = useNavigate(); // Initialize the useNavigate hook

   

    const handleMoreInfoClick = (id: string) => {
        navigate(`/product/${id}`); // Navigate to /product/{id} when button is clicked
    };

    // Fetch data function
    const fetchData = async () => {
        try {
            const response = await fetch('https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/products');
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data); // Initialize filtered products
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    // Polling: Fetch data every 15 seconds
    useEffect(() => {
        fetchData(); // Fetch initial data
        const intervalId = setInterval(fetchData, 15000); // Polling interval of 15 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    // Handle product type filtering
    const handleFilterChange = (e) => {
        const value = e.target.value;
        setProductTypeFilter(value);

        if (value === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product?.type === value));
        }
    };

    // Handle number of products per page change
    const handleProductsPerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setProductsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing products per page
    };

    // Handle pagination
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

    return (
        <>
            <div className="container mx-auto py-6 px-4">
                <h2 className="text-2xl font-bold mb-6">LATEST PRODUCTS</h2>

                {/* Filter Section */}
                <div className="mb-4 flex flex-col sm:flex-row justify-end sm:space-x-4">
                    {/* Filter by Type */}
                    <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col items-end">
                        <label htmlFor="filter" className="block text-sm font-black text-gray-700 mb-2 text-right">Filter by Type</label>
                        <select
                            id="filter"
                            value={productTypeFilter}
                            onChange={handleFilterChange}
                            className="border p-2 rounded w-full sm:w-1/2 md:w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Products</option>
                            <option value="t-shirt">T-shirts</option>
                            <option value="trousers">Trousers</option>
                        </select>
                    </div>

                    {/* Products per page */}
                    <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col items-end">
                        <label htmlFor="productsPerPage" className="block text-sm font-black text-gray-700 mb-2 text-right">Products per Page</label>
                        <select
                            id="productsPerPage"
                            value={productsPerPage}
                            onChange={handleProductsPerPageChange}
                            className="border p-2 rounded w-full sm:w-1/2 md:w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={4}>4</option>
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                            <option value={16}>16</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts?.map((product) => (
                        <li key={product.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                            {/* Placeholder Image */}
                            <img
                                src={product.type === 't-shirt' ? productImg_tshirt : productImg_trousers }
                                alt={product.title}
                                className="w-32 h-32 object-cover rounded mb-4"
                            />
                            <h1 className="text-lg font-semibold mb-2 text-center">{product.title}</h1>
                            <p className="text-gray-500 mb-2 text-center">{product.description}</p>
                            <p className="text-gray-700 font-bold mb-2 text-center">€{product.price}</p>
                            <p className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'} text-center`}>
                                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    className={`mt-4 p-2 rounded ${product.quantity > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white`}
                                    onClick={() => handleMoreInfoClick(product.id)}
                                    disabled={product.quantity === 0}
                                >
                                    {product.quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

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
        </>
    );
};

export default Home;
