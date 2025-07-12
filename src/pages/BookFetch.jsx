import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";

function BookFetch() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    imgUrl: "",
    pdfUrl: "",
  });

  const [deletingBookId, setDeletingBookId] = useState(null);
  const [addingBook, setAddingBook] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios
      .get(`${baseURL}/api/books`, {
        headers: {
          apikey: "310424",
        },
      })
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch books.");
        setLoading(false);
      });
  };

  const openEditModal = (book) => {
    setCurrentBook(book);
    setFormData({
      name: book.name,
      imgUrl: book.imgUrl,
      pdfUrl: book.pdfUrl,
    });
    setEditModalOpen(true);
    navigate(`${location.pathname}?edit=${book._id}`);
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      imgUrl: "",
      pdfUrl: "",
    });
    setAddModalOpen(true);
    navigate(`${location.pathname}?add=new`);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${baseURL}/api/books/${currentBook._id}`, formData, {
        headers: {
          apikey: "310424",
        },
      })
      .then(() => {
        fetchBooks(); // refresh list
        setEditModalOpen(false);
        navigate(location.pathname); // clear query param
      })
      .catch(() => alert("Failed to update book."));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setAddingBook(true);
    
    axios
      .post(`${baseURL}/api/books`, formData, {
        headers: {
          apikey: "310424",
        },
      })
      .then(() => {
        fetchBooks(); // refresh list
        setAddModalOpen(false);
        navigate(location.pathname); // clear query param
      })
      .catch(() => alert("Failed to add book."))
      .finally(() => {
        setAddingBook(false);
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    setDeletingBookId(id);

    axios
      .delete(`${baseURL}/api/books/${id}`, {
        headers: {
          apikey: "310424",
        },
      })
      .then(() => {
        fetchBooks(); // refresh list
      })
      .catch(() => {
        alert("Failed to delete book.");
      })
      .finally(() => {
        setDeletingBookId(null);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          📚 Book Collection
        </h1>
        <button
          onClick={openAddModal}
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center gap-2 transition-colors duration-300"
        >
          <IoMdAdd size={18} /> Add Book
        </button>
      </div>

      {/* Status messages */}
      {loading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg mb-6 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading books...
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Books grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <img
                src={book.imgUrl}
                alt={book.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
            <div className="p-4 flex-grow">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">
                {book.name}
              </h2>
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  View PDF
                </a>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => openEditModal(book)}
                    className="flex-1 flex items-center justify-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors duration-300"
                  >
                    <FiEdit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className={`flex-1 flex items-center justify-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      deletingBookId === book._id
                        ? "opacity-70 pointer-events-none"
                        : "hover:bg-red-200 dark:hover:bg-red-900/50"
                    }`}
                  >
                    {deletingBookId === book._id ? (
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <>
                        <MdOutlineDeleteForever size={16} /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {!loading && books.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No books found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first book to the collection.</p>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center gap-2"
          >
            <IoMdAdd size={18} /> Add Your First Book
          </button>
        </div>
      )}
    {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn">
            <div className="absolute top-4 right-4">
              <button 
                type="button" 
                onClick={() => {
                  setEditModalOpen(false);
                  navigate(location.pathname);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg mr-3">
                <FiEdit size={20} />
              </span>
              Edit Book
            </h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Book Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  type="text"
                  name="imgUrl"
                  value={formData.imgUrl}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">PDF URL</label>
                <input
                  type="text"
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="https://example.com/document.pdf"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    navigate(location.pathname);
                  }}
                  className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn">
            <div className="absolute top-4 right-4">
              <button 
                type="button" 
                onClick={() => {
                  setAddModalOpen(false);
                  navigate(location.pathname);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg mr-3">
                <IoMdAdd size={20} />
              </span>
              Add New Book
            </h2>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Book Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  type="text"
                  name="imgUrl"
                  value={formData.imgUrl}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">PDF URL</label>
                <input
                  type="text"
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="https://example.com/document.pdf"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setAddModalOpen(false);
                    navigate(location.pathname);
                  }}
                  className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
                  disabled={addingBook}
                >
                  {addingBook ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>Add Book</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookFetch;