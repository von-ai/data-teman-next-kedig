'use client';

import { Logout } from 'iconsax-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-indigo-900 p-4 relative flex items-center justify-end">
      <h2 className="absolute left-1/2 transform -translate-x-1/2 text-white text-[1.5rem] font-bold">
        Data Teman
      </h2>
      <a href="/">
        <div className="md:block hidden mr-8">
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-semibold transition-all">
            Log out
          </button>
        </div>
        <div className="md:hidden">
          <Logout
            color="white"
            className="text-red-500 group-hover:text-red-600 transition"
          />
        </div>
      </a>
    </header>
  );
};
