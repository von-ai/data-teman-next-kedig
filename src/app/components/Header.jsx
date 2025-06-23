'use client';

// import { Logout } from 'iconsax-react';
import React from 'react';

export const Header = () => {
  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!res.ok) throw new Error('Gagal logout');
      window.location.href = '/';
    } catch (err) {
      console.error('❌ Logout error:', err);
      alert('Logout gagal. Coba lagi ya~');
    }
  };

  return (
    <header className="bg-indigo-900 p-4 relative flex items-center justify-end">
      <h2 className="absolute left-1/2 transform -translate-x-1/2 text-white text-[1.5rem] font-bold">
        Data Teman
      </h2>
      <div className=" mr-8">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-semibold transition-all"
        >
          Log out
        </button>
      </div>
      {/* <div className="md:hidden">
        <Logout
          onClick={handleLogout}
          color="white"
          className="text-red-500 group-hover:text-red-600 transition cursor-pointer"
        />
      </div> */}
    </header>
  );
};
