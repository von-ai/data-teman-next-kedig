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
      console.error('❌ Error updating:', err);
      toast.error(err.message || 'Error saat update');
    }
  };

  if (loading) return <p className="text-center py-4">Loading…</p>;

  return (
    <section className="max-w-md mx-auto bg-white p-10 md:p-6 rounded-md shadow-md">
      <Toaster />
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Deskripsi', name: 'description', type: 'text' },
          { label: 'Alamat', name: 'address', type: 'text' },
          { label: 'Tanggal Lahir', name: 'birthDate', type: 'date' },
          { label: 'Gambar (link)', name: 'photoLink', type: 'text' },
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-4">
            <label htmlFor={name} className="block text-gray-800">
              {label}:
              <input
                type={type}
                name={name}
                value={data[name] || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>
        ))}

        <button
          type="submit"
          className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:bg-indigo-900 w-full"
        >
          Update Data
        </button>
      </form>
    </section>
  );
};

export default EditDataComp;
