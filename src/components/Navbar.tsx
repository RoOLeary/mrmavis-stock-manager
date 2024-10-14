import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Title */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-yellow-400">
            PRODUCT/ORDER MANAGER 
          </Link>
        </div>

        {/* Menu Items for larger screens */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellow-400">
            Store
          </Link>
          <Link to="/admin/products" className="hover:text-yellow-400">
            Admin
          </Link>
        </div>

        {/* Hamburger Icon for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none text-white hover:text-yellow-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <Link
            to="/"
            onClick={toggleMenu}
            className="block py-2 px-4 hover:bg-gray-700"
          >
            Home
          </Link>
          <Link
            to="/store"
            onClick={toggleMenu}
            className="block py-2 px-4 hover:bg-gray-700"
          >
            Store
          </Link>
          <Link
            to="/admin"
            onClick={toggleMenu}
            className="block py-2 px-4 hover:bg-gray-700"
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
