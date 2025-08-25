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

  // ✅ DataTable columns including wp_post_title & match_score
  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
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
      width: '120px',
    },
    {
      name: 'Source',
      selector: row => row.source,
      sortable: true,
      width: '120px',
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
    {
      name: 'Matched WP Title',
      selector: row => row.wp_post_title || 'N/A',
      sortable: true,
      wrap: true,
      maxWidth: '200px',
    },
    {
      name: 'Match Score',
      selector: row => row.match_score,
      sortable: true,
      width: '120px',
    },
  ];

  // Fetch matched products from backend API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/compare-products'); // 👈 your modified API route
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setMessage(`Loaded ${response.data.count} matched products`);
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

  // Search filter (includes wp_post_title also)
  useEffect(() => {
    const filtered = products.filter(product =>
      ['title', 'source', 'description', 'specs', 'wp_post_title'].some(key =>
        product[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="container mx-auto p-4">
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
            message.includes('Error')
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
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        noDataComponent="No matched products found"
        theme="default"
        customStyles={{
          table: {
            style: { border: '1px solid #e2e8f0' },
          },
          headRow: {
            style: { backgroundColor: '#f7fafc', fontWeight: 'bold' },
          },
          cells: {
            style: { border: '1px solid #e2e8f0', padding: '8px' },
          },
        }}
      />
    </div>
  );
};

export default ProductsDataTable;
