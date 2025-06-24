'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBarComp = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full sm:max-w-md bg-white px-4 py-2 border border-gray-300 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-indigo-400 transition"
    >
      <Search size="20" color="#4b5563" className="mr-1" />
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Cari teman..."
        className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
      />
      <button
        type="submit"
        className="text-sm font-semibold text-indigo-600 hover:underline"
      >
        Cari
      </button>
    </form>
  );
};

export default SearchBarComp;
