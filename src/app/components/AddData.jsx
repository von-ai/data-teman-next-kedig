'use client';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchWithSessionRefresh } from '../utils/fetchWithSessionRefresh';

const AddData = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    birthDate: '',
    photoLink: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddNewData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/data`;
      const response = await fetchWithSessionRefresh(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('✨ Data berhasil ditambahkan!');
        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      } else {
        const err = await response.json();
        toast.error(err.message || 'Gagal menambahkan data.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br  from-indigo-50 via-white to-white flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-black tracking-wide">
          Tambah Data Teman
        </h2>

        <form className="space-y-4">
          {[
            { label: 'Nama', name: 'name', type: 'text' },
            { label: 'Deskripsi', name: 'description', type: 'text' },
            { label: 'Alamat', name: 'address', type: 'text' },
            { label: 'Tanggal Lahir', name: 'birthDate', type: 'date' },
            { label: 'Gambar (link)', name: 'photoLink', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="text-gray-700 font-medium">
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800 transition"
                placeholder={`Masukkan ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddNewData}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-xl transition shadow-md"
          >
            Tambah Sekarang
          </button>
        </form>
        <div className="text-center">
          <a href="/home">
            <button className="w-full inline-block px-6 py-2 text-indigo-700 font-semibold border border-indigo-600 rounded-xl hover:bg-indigo-50 hover:shadow transition duration-200">
              Kembali
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AddData;
