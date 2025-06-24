'use client';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { fetchWithSessionRefresh } from '../utils/fetchWithSessionRefresh';

const ProfileComp = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithSessionRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          { credentials: 'include' }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message);

        setUser(json.data);
      } catch (error) {
        toast.error('Gagal memuat profil');
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleDelete = async () => {
    const confirmed = confirm('Yakin ingin menghapus akun ini?');
    if (!confirmed) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Gagal menghapus akun');
      toast.success('Akun berhasil dihapus');
      setTimeout(() => (window.location.href = '/'), 1500);
    } catch (err) {
      toast.error('Terjadi kesalahan saat menghapus akun');
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-indigo-50 via-white to-white py-12 px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-indigo-800 text-center">
          Profil Pengguna
        </h2>

        {user ? (
          <div className="space-y-3">
            <p>
              <span className="font-medium text-gray-700">ID:</span> {user.id}
            </p>
            <p>
              <span className="font-medium text-gray-700">Nama Lengkap:</span>{' '}
              {user.fullName}
            </p>
            <p>
              <span className="font-medium text-gray-700">
                Terdaftar Sejak:
              </span>{' '}
              {formatDate(user.registeredAt)}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Memuat data profil...</p>
        )}

        <div className="flex flex-col gap-4 pt-4">
          <button
            onClick={() => router.push('/ubahProfile')}
            className="w-full py-2 text-indigo-700 border border-indigo-600 hover:bg-indigo-50 hover:shadow transition duration-200 font-semibold rounded-xl shadow"
          >
            Ubah Profil
          </button>
          <button
            onClick={() => router.push('/ubahPassword')}
            className="w-full py-2 text-indigo-700 font-semibold border border-indigo-600 rounded-xl hover:bg-indigo-50 hover:shadow transition duration-200 shadow"
          >
            Ubah Password
          </button>

          <button
            onClick={() => router.push('/home')}
            className="inline-block px-5 py-2 w-full text-indigo-700 font-semibold border border-indigo-600 rounded-xl hover:bg-indigo-50 transition"
          >
            Kembali
          </button>

          <button
            onClick={handleDelete}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow"
          >
            Hapus Akun
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileComp;
