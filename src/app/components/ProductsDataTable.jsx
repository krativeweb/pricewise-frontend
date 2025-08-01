'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const ProductsDataTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // DataTable columns
  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
      wrap: true,
    },
 {
  name: 'Price',
  selector: row => row.price,
  sortable: true,
  width: '200px',
  format: row => row.price
},
    {
      name: 'Source',
      selector: row => row.source,
      sortable: true,
      width: '150px',
    },
    {
      name: 'URL',
      selector: row => row.url,
      cell: row => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Link
        </a>
      ),
      width: '100px',
    },
    {
      name: 'Image',
      selector: row => row.image,
      cell: row => (
        <img
          src={row.image}
          alt={row.title}
          className="w-16 h-16 object-cover"
        />
      ),
      width: '100px',
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      wrap: true,
      maxWidth: '200px',
    },
    {
      name: 'Specs',
      selector: row => row.specs || 'N/A',
      sortable: true,
      wrap: true,
      maxWidth: '200px',
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://pricewise-scraper-v2-2.onrender.com/api/products');
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setMessage(`Loaded ${response.data.count} products`);
      } else {
        setMessage('Failed to load products');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      ['title', 'source', 'description', 'specs'].some(key =>
        product[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSync = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get('https://pricewise-scraper-v2.vercel.app/api/scrape');
      if (response.data.success) {
        setMessage(response.data.message);
        await fetchProducts();
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTruncate = async () => {
    if (!confirm('Are you sure you want to delete all products?')) return;

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.delete('https://pricewise-scraper-v2-2.onrender.com/api/products');
      if (response.data.success) {
        setProducts([]);
        setFilteredProducts([]);
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Full-page loader for initial fetch
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSync}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Syncing...' : 'Sync Products'}
          </button>
          <button
            onClick={handleTruncate}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {loading ? 'Deleting...' : 'Delete All'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredProducts}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        noDataComponent="No products found"
        theme="default"
        customStyles={{
          table: {
            style: {
              border: '1px solid #e2e8f0',
            },
          },
          headRow: {
            style: {
              backgroundColor: '#f7fafc',
              fontWeight: 'bold',
            },
          },
          cells: {
            style: {
              border: '1px solid #e2e8f0',
              padding: '8px',
            },
          },
        }}
      />
    </div>
  );
};

export default ProductsDataTable;
