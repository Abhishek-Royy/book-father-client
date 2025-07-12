import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroPage from "./pages/HeroPage";
import BookFetch from "./pages/BookFetch";
import BannerFetch from "./pages/BannerFetch";
import CategoryFetch from "./pages/CategoryFetch";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLayout><HeroPage /></AdminLayout>} />
        <Route path="/book-fetch" element={<AdminLayout><BookFetch /></AdminLayout>} />
        <Route path="/banner-fetch" element={<AdminLayout><BannerFetch /></AdminLayout>} />
        <Route path="/category-fetch" element={<AdminLayout><CategoryFetch /></AdminLayout>} />
      </Routes>
    </>
  );
}

export default App;
