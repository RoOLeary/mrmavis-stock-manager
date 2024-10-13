/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';


const Home = () => {
    const [products, setProducts] = useState();
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleMoreInfoClick = (id:string) => {
        navigate(`/product/${id}`); // Navigate to /product/{id} when button is clicked
    };

    const fetchData = async () => {
        try {
            const response = await fetch('https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/products');
            const data = await response.json();
            setProducts(data)
        } catch (error) {
            console.log('error')
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const sortedProducts = products?.slice().sort((a, b) => b.createdAt - a.createdAt);

    return (
        <>
            <nav>
                <a href={'/'}>Home</a>
                <a href={'/orders'}>Orders</a>
            </nav>
            <div className="container mx-auto py-6 px-4">
                <h2 className="text-2xl font-bold mb-6">Product List</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedProducts && sortedProducts.map((product: { id: Key | null | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; isAvailable: any; }) => (
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
                            <div className='flex gap-2'>
                                <a className={`mt-4 p-2 rounded ${product.isAvailable ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`} onClick={() => handleMoreInfoClick(product.id)}>
                                    More Info
                                </a>
                                <button className={`mt-4 p-2 rounded ${product.isAvailable ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                                    Add to Cart
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </>

    );
}

export default Home; 