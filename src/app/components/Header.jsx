'use client';
import React from 'react';
import { LogOut } from 'lucide-react';

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
    <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 shadow-md px-6 py-4 rounded-b-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-sm">
          Data Teman
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-white hidden sm:inline font-medium">
            Halo, Admin 💼
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
