import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

function BannerFetch() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ imgUrl: "" });
  const [currentId, setCurrentId] = useState(null);

const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    axios
      .get(`${baseURL}/api/banners`, {
        headers: { apikey: "310424" },
      })
      .then((res) => {
        setBanners(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch banners.");
        setLoading(false);
      });
  };

  const openAddModal = () => {
    setFormData({ imgUrl: "" });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setFormData({ imgUrl: banner.imgUrl });
    setCurrentId(banner._id);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isEditMode
      ? `${baseURL}/api/banners/${currentId}`
      : `${baseURL}/api/banners`;

    const method = isEditMode ? "put" : "post";

    axios[method](url, formData, {
      headers: { apikey: "310424" },
    })
      .then(() => {
        fetchBanners();
        setModalOpen(false);
      })
      .catch(() => alert("Failed to submit banner."));
  };

  const handleDeleteBanner = (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    axios
      .delete(`${baseURL}/api/banners/${id}`, {
        headers: { apikey: "310424" },
      })
      .then(() => fetchBanners())
      .catch(() => alert("Failed to delete banner."));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          🖼️ Banner Management
        </h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center gap-2 transition-colors duration-300"
        >
          <IoMdAdd size={18} /> Add Banner
        </button>
      </div>

      {/* Status messages */}
      {loading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg mb-6 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading banners...
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Banners grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative group">
              <img
                src={banner.imgUrl}
                alt="Banner"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=Banner+Image';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <a 
                    href={banner.imgUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-gray-800 rounded-full p-2 mx-1 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                {banner.imgUrl.split('/').pop() || 'Banner'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(banner)}
                  className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors duration-300"
                >
                  <FiEdit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner._id)}
                  className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-300"
                >
                  <MdOutlineDeleteForever size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && banners.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No banners found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first banner to the collection.</p>
          <button
            onClick={openAddModal}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center gap-2"
          >
            <IoMdAdd size={18} /> Add Your First Banner
          </button>
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn">
            <div className="absolute top-4 right-4">
              <button 
                type="button" 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className={`${isEditMode ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'} p-2 rounded-lg mr-3`}>
                {isEditMode ? <FiEdit size={20} /> : <IoMdAdd size={20} />}
              </span>
              {isEditMode ? "Edit Banner" : "Add New Banner"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  type="text"
                  name="imgUrl"
                  value={formData.imgUrl}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              {formData.imgUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={formData.imgUrl} 
                      alt="Banner Preview" 
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2.5 ${isEditMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg transition-colors duration-300 flex items-center gap-2`}
                >
                  {isEditMode ? "Save Changes" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerFetch;
