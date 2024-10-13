/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productTypeFilter, setProductTypeFilter] = useState('all'); // For filtering by type
    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const productsPerPage = 8; // Display 8 products per page

    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleMoreInfoClick = (id: string) => {
        navigate(`/product/${id}`); // Navigate to /product/{id} when button is clicked
    };

    const fetchData = async () => {
        try {
            const response = await fetch('https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/products');
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data); // Initialize filtered products
        } catch (error) {
            console.log('error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle product type filtering
    const handleFilterChange = (e) => {
        const value = e.target.value;
        setProductTypeFilter(value);

        if (value === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.type === value));
        }
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
            <nav>
                <a href="/">Home</a>
                <a href="/orders">Orders</a>
            </nav>
            <div className="container mx-auto py-6 px-4">
                <h2 className="text-2xl font-bold mb-6">Product List</h2>

                {/* Filter Dropdown */}
                <div className="mb-4">
                    <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
                    <select
                        id="filter"
                        value={productTypeFilter}
                        onChange={handleFilterChange}
                        className="border p-2 rounded w-full max-w-xs focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Products</option>
                        <option value="t-shirt">T-shirts</option>
                        <option value="trousers">Trousers</option>
                    </select>
                </div>

                {/* Product Grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts?.map((product) => (
                        <li key={product.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                            {/* Placeholder Image */}
                            <img
                                src="https://via.placeholder.com/150"
                                alt={product.title}
                                className="w-32 h-32 object-cover rounded mb-4"
                            />
                            <h1 className="text-lg font-semibold mb-2 text-center">{product.title}</h1>
                            <p className="text-gray-500 mb-2 text-center">{product.description}</p>
                            <p className="text-gray-700 font-bold mb-2 text-center">€{product.price}</p>
                            <p className={`text-sm ${product.isAvailable ? 'text-green-600' : 'text-red-500'} text-center`}>
                                {product.isAvailable ? "In Stock" : "Out of Stock"}
                            </p>
                            <div className="flex gap-2">
                                <a
                                    className={`mt-4 p-2 rounded ${product.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white`}
                                    onClick={() => handleMoreInfoClick(product.id)}
                                >
                                    More Info
                                </a>
                               
                                <button
                                    className={`mt-4 p-2 rounded ${product.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white`}
                                    onClick={() => handleMoreInfoClick(product.id)}
                                    disabled={!product.isAvailable}
                                >
                                   Buy Now
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
