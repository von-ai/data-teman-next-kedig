'use client';
import { AddCircle } from 'iconsax-react';
import DataComp from './DataComp';
import { Header } from './Header';
import { useState, useEffect } from 'react';

const HomeComp = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          { credentials: 'include' }
        );
        const result = await res.json();
        if (res.ok && result?.data?.fullName) {
          setUserName(result.data.fullName);
        } else {
          setUserName('Teman ✨');
        }
      } catch (err) {
        console.error('Gagal ambil user:', err);
        setUserName('Teman ✨');
      }
    };

    fetchUser();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 drop-shadow-sm">
            ✨ Welcome, {userName} ✨
          </h1>

          <a href="/tambahData">
            <div className="hidden md:block">
              <button className="bg-indigo-700 hover:bg-indigo-800 transition text-white px-6 py-2 rounded-xl shadow-md font-semibold tracking-wide">
                + Tambah Data
              </button>
            </div>
            <div className="md:hidden block">
              <AddCircle size="36" color="#4f46e5" />
            </div>
          </a>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <DataComp />
        </div>
      </div>
    </section>
  );
};

export default HomeComp;
