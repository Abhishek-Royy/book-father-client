import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBook, FiLayers, FiImage, FiUsers } from "react-icons/fi";
import axios from "axios";

function HeroPage() {
  const [bookCount, setBookCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [bannerCount, setBannerCount] = useState(0);

  useEffect(() => {
    const headers = { apikey: "310424" };

    axios.get("https://bookfatherbackendfinal.onrender.com/api/books", { headers })
      .then(res => setBookCount(res.data.length))
      .catch(err => console.error("Failed to fetch books:", err));

    axios.get("https://bookfatherbackendfinal.onrender.com/api/categories", { headers })
      .then(res => setCategoryCount(res.data.length))
      .catch(err => console.error("Failed to fetch categories:", err));

    axios.get("https://bookfatherbackendfinal.onrender.com/api/banners", { headers })
      .then(res => setBannerCount(res.data.length))
      .catch(err => console.error("Failed to fetch banners:", err));
  }, []);

  // Updated stats with dynamic values
  const stats = [
    { title: "Total Books", value: bookCount, icon: <FiBook size={24} />, color: "bg-blue-500" },
    { title: "Categories", value: categoryCount, icon: <FiLayers size={24} />, color: "bg-green-500" },
    { title: "Active Banners", value: bannerCount, icon: <FiImage size={24} />, color: "bg-purple-500" },
  ];

  // (no change)
  const recentActivity = [
    { action: "New book added", item: "The Great Gatsby", time: "2 hours ago" },
    { action: "Category updated", item: "Science Fiction", time: "5 hours ago" },
    { action: "Banner removed", item: "Summer Sale", time: "1 day ago" },
    { action: "New book added", item: "To Kill a Mockingbird", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      {/* (no change) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome to <span className="text-green-600 dark:text-green-400">BookFather Hub</span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your books, categories, and banners from this admin dashboard.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* (rest of the component unchanged) */}
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Books management */}
        <Link to="/book-fetch" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Books Management</h2>
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <FiBook size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Add, edit, or remove books from your collection.</p>
          <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">Manage Books →</div>
        </Link>

        {/* Categories management */}
        <Link to="/category-fetch" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Categories</h2>
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <FiLayers size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Organize your books with custom categories.</p>
          <div className="text-green-600 dark:text-green-400 font-medium text-sm">Manage Categories →</div>
        </Link>

        {/* Banners management */}
        <Link to="/banner-fetch" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Banners</h2>
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <FiImage size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Update promotional banners for your platform.</p>
          <div className="text-purple-600 dark:text-purple-400 font-medium text-sm">Manage Banners →</div>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroPage;
