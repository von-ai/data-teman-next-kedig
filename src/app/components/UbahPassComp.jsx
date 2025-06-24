'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { fetchWithSessionRefresh } from '../utils/fetchWithSessionRefresh';

const UbahPassComp = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmationPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmationPassword
    ) {
      toast.error('Semua kolom harus diisi!');
      return;
    }

    if (formData.newPassword !== formData.confirmationPassword) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }

    try {
      setLoading(true);
      const res = await fetchWithSessionRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal mengganti password');
      }

      toast.success('Password berhasil diubah!');
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err) {
      toast.error(err.message || 'Terjadi kesalahan saat mengganti password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-800">
          Ubah Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Password Lama', name: 'oldPassword', type: 'password' },
            { label: 'Password Baru', name: 'newPassword', type: 'password' },
            {
              label: 'Konfirmasi Password Baru',
              name: 'confirmationPassword',
              type: 'password',
            },
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder={`Masukkan ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
          >
            {loading ? 'Memproses...' : 'Ubah Password'}
          </button>
        </form>

        <div className="text-center ">
          <button
            onClick={() => router.push('/profile')}
            className="inline-block px-5 py-2 w-full text-indigo-700 font-semibold border border-indigo-600 rounded-xl hover:bg-indigo-50 transition"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    </section>
  );
};
export default UbahPassComp;
