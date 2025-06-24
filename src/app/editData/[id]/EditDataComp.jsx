'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { fetchWithSessionRefresh } from '@/app/utils/fetchWithSessionRefresh';

const EditDataComp = () => {
  const router = useRouter();
  const { id } = useParams();

  const [data, setData] = useState({
    name: '',
    description: '',
    address: '',
    birthDate: '',
    photoLink: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetchWithSessionRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${id}`,
          { method: 'GET' }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Gagal mengambil data');

        const result = json.data || json;

        setData({
          name: result.name || '',
          description: result.description || '',
          address: result.address || '',
          birthDate: result.birthDate ? result.birthDate.slice(0, 10) : '',
          photoLink: result.photoLink || '',
        });
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Update gagal');
      }

      toast.success('Data berhasil diupdate');
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (err) {
      console.error('Error updating:', err);
      toast.error(err.message || 'Error saat update');
    }
  };

  if (loading) return <p className="text-center py-4">Loading…</p>;

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-800 tracking-wide">
          Edit Data Teman
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={data[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800 transition"
                placeholder={`Masukkan ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-xl transition shadow-md"
          >
            Simpan Perubahan
          </button>

          <button
            type="button"
            onClick={() => router.push('/home')}
            className="w-full py-2 mt-2 border border-indigo-600 text-indigo-700 hover:bg-indigo-50 rounded-xl font-semibold transition"
          >
            Kembali
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditDataComp;
