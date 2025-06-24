'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { fetchWithSessionRefresh } from '@/app/utils/fetchWithSessionRefresh';

const UbahProfileComp = () => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithSessionRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`
        );
        const json = await res.json();
        if (res.ok && json.success) {
          setFullName(json.data.fullName || '');
        } else {
          throw new Error('Gagal memuat profil');
        }
      } catch (err) {
        toast.error(err.message || 'Gagal mengambil data profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithSessionRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal memperbarui profil');
      }

      toast.success('Profil berhasil diperbarui!');
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err) {
      toast.error(err.message || 'Terjadi kesalahan saat memperbarui');
    }
  };

  if (loading) return <p className="text-center py-10">Memuat data...</p>;

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Ubah Profil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="fullName"
              className="text-gray-700 font-medium mb-1"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
          >
            Simpan Perubahan
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => router.push('/profile')}
            className="inline-block w-full px-5 py-2 text-indigo-700 font-semibold border border-indigo-600 rounded-xl hover:bg-indigo-50 transition"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    </section>
  );
};

export default UbahProfileComp;
