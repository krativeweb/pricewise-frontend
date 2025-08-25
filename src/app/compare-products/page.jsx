'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

// ✅ Full page loader
const Loader = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-white/70 z-50">
    <svg
      className="animate-spin h-12 w-12 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  </div>
);

const ProductsDataTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const backendBase = 'https://pricewise-scraper-v2.vercel.app';

  // ✅ DataTable columns (as per new API)
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    {
      name: 'Image',
      selector: row => row.image,
      cell: row => (
        <img
          src={row.image}
          alt={row.product_name_live}
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
      width: '100px',
    },
    { 
      name: 'Product Name (Live)', 
      selector: row => row.product_name_live, 
      sortable: true, 
      wrap: true 
    },
  
    { 
      name: 'Price (Pricewise)', 
      selector: row => row.price_pricewiseinsulation || 'N/A', 
      width: '150px' 
    },
    {
      name: 'Link (Pricewise)',
      selector: row => row.link_pricewiseinsulation,
      cell: row =>
        row.link_pricewiseinsulation ? (
          <a
            href={row.link_pricewiseinsulation}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Visit
          </a>
        ) : (
          'N/A'
        ),
      width: '150px',
    },
    { 
      name: 'Price (NoGap)', 
      selector: row => row.price_nogapinsulation || 'N/A', 
      width: '150px' 
    },
    {
      name: 'Link (NoGap)',
      selector: row => row.link_nogapinsulation,
      cell: row =>
        row.link_nogapinsulation ? (
          <a
            href={row.link_nogapinsulation}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Visit
          </a>
        ) : (
          'N/A'
        ),
      width: '150px',
    },
  ];

  // ✅ Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendBase}/api/compare-products`);
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setMessage(`✅ Loaded ${response.data.count} matched products`);
      } else {
        setMessage('❌ Failed to load products');
      }
    } catch (error) {
      setMessage(`⚠️ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    const filtered = products.filter(product =>
      ['product_name_live', 'price_pricewiseinsulation', 'price_nogapinsulation'].some(key =>
        product[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="container mx-auto p-4 relative">
      {/* ✅ Show loader full page */}
      {loading && <Loader />}

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Matched Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.includes('Error') || message.includes('❌')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredProducts}
        pagination
        highlightOnHover
        striped
        noDataComponent="No matched products found"
        customStyles={{
          table: { style: { border: '1px solid #e2e8f0' } },
          headRow: { style: { backgroundColor: '#f7fafc', fontWeight: 'bold' } },
          cells: { style: { border: '1px solid #e2e8f0', padding: '8px' } },
        }}
      />
    </div>
  );
};

export default ProductsDataTable;
