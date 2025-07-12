import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";

function CategoryFetch() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", imgUrl: "", books: [] });

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`${baseURL}/api/categories`, {
        headers: { apikey: "310424" },
      })
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch categories.");
        setLoading(false);
      });
  };

  const fetchBooks = () => {
    axios
      .get(`${baseURL}/api/books`, {
        headers: { apikey: "310424" },
      })
      .then((res) => {
        setBooks(res.data);
      })
      .catch(() => {
        console.error("Failed to fetch books.");
      });
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      imgUrl: category.imgUrl,
      books: category.books?.map((b) => b._id) || [],
    });
    setEditModalOpen(true);
    navigate(`${location.pathname}?edit=${category._id}`);
  };

  const openAddModal = () => {
    setFormData({ name: "", imgUrl: "", books: [] });
    setAddModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookSelect = (selectedOptions) => {
    const selected = selectedOptions.map(option => option.value);
    setFormData({ ...formData, books: selected });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${baseURL}/api/categories/${currentCategory._id}`, formData, {
        headers: { apikey: "310424" },
      })
      .then(() => {
        setEditModalOpen(false);
        fetchCategories();
        navigate(location.pathname);
      })
      .catch(() => alert("Failed to update category."));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/categories`, formData, {
        headers: { apikey: "310424" },
      })
      .then(() => {
        setAddModalOpen(false);
        fetchCategories();
      })
      .catch(() => alert("Failed to add category."));
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    axios
      .delete(`${baseURL}/api/categories/${id}`, {
        headers: { apikey: "310424" },
      })
      .then(() => fetchCategories())
      .catch(() => alert("Failed to delete category."));
  };

  const ModalForm = ({ onSubmit, onCancel, title, submitLabel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white text-black rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>

        <div>
          <label className="block mb-1 font-semibold">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Image URL</label>
          <input
            type="text"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Select Books</label>
          <Select
            isMulti
            name="books"
            options={books.map(book => ({ value: book._id, label: book.name }))}
            value={books
              .filter(book => formData.books.includes(book._id))
              .map(book => ({ value: book._id, label: book.name }))}
            onChange={handleBookSelect}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: 'var(--tw-bg-opacity)',
                borderColor: state.isFocused ? '#4f46e5' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 1px #4f46e5' : null,
                '&:hover': {
                  borderColor: state.isFocused ? '#4f46e5' : '#9ca3af'
                }
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : 'white',
                zIndex: 9999
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isSelected 
                  ? '#4f46e5' 
                  : state.isFocused 
                    ? document.documentElement.classList.contains('dark') ? '#374151' : '#e0e7ff'
                    : document.documentElement.classList.contains('dark') ? '#1f2937' : 'white',
                color: state.isSelected 
                  ? 'white' 
                  : document.documentElement.classList.contains('dark') ? '#f9fafb' : '#1f2937'
              }),
              multiValue: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e0e7ff'
              }),
              multiValueLabel: (baseStyles) => ({
                ...baseStyles,
                color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#4f46e5'
              }),
              multiValueRemove: (baseStyles) => ({
                ...baseStyles,
                color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#4f46e5',
                '&:hover': {
                  backgroundColor: document.documentElement.classList.contains('dark') ? '#4b5563' : '#c7d2fe',
                  color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#4338ca'
                }
              }),
              input: (baseStyles) => ({
                ...baseStyles,
                color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#1f2937'
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#1f2937'
              })
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: '#4f46e5',
                primary75: '#6366f1',
                primary50: '#818cf8',
                primary25: '#e0e7ff',
                neutral0: document.documentElement.classList.contains('dark') ? '#1f2937' : 'white',
                neutral5: document.documentElement.classList.contains('dark') ? '#374151' : '#f9fafb',
                neutral10: document.documentElement.classList.contains('dark') ? '#4b5563' : '#f3f4f6',
                neutral20: document.documentElement.classList.contains('dark') ? '#6b7280' : '#e5e7eb',
                neutral30: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#d1d5db',
                neutral40: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#9ca3af',
                neutral50: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#6b7280',
                neutral60: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563',
                neutral70: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
                neutral80: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#1f2937',
                neutral90: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#111827',
              },
            })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">📚 Categories</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
        >
          <IoMdAdd size={20} />
          Add Category
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-4">
          <svg className="animate-spin h-5 w-5 mr-3 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-gray-500 dark:text-gray-300">Loading categories...</p>
        </div>
      )}
      {error && <p className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <div className="relative">
              <img
                src={category.imgUrl}
                alt={category.name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=Category+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
              <h2 className="absolute bottom-3 left-4 text-xl font-bold text-white">
                {category.name}
              </h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Books in this category:
                </h3>
                <div className="max-h-24 overflow-y-auto pr-2">
                  {category.books && category.books.length > 0 ? (
                    <ul className="space-y-1">
                      {category.books.map((book, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block"></span>
                          {book.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      No books in this category
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openEditModal(category)}
                  className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors duration-300 flex items-center gap-1"
                >
                  <FiEdit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-300 flex items-center gap-1"
                >
                  <MdOutlineDeleteForever size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && categories.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No categories found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first category to organize your books.</p>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center gap-2 transition-colors duration-300"
          >
            <IoMdAdd size={18} /> Add Your First Category
          </button>
        </div>
      )}

      {editModalOpen && (
        <ModalForm
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setEditModalOpen(false);
            navigate(location.pathname);
          }}
          title="✏️ Edit Category"
          submitLabel="Save Changes"
        />
      )}

      {addModalOpen && (
        <ModalForm
          onSubmit={handleAddSubmit}
          onCancel={() => setAddModalOpen(false)}
          title="➕ Add New Category"
          submitLabel="Create Category"
        />
      )}
    </div>
  );
}

export default CategoryFetch;
