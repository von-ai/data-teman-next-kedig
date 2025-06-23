'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const EditDataComp = ({ id }) => {
  const router = useRouter();
  // const { id } = useParams();

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
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${id}`,
          { credentials: 'include' }
        );
        const json = await res.json();
        setData({
          name: json.name,
          description: json.description,
          address: json.address,
          birthDate: json.birthDate.slice(0, 10),
          photoLink: json.photoLink,
        });
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
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
      if (!res.ok) throw new Error('Update gagal');
      toast.success('Data berhasil diupdate');
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Error saat update');
    }
  };

  if (loading) return <p>Loading…</p>;
  return (
    <>
      <section className="max-w-md mx-auto bg-white p-10 md:p-6 rounded-md shadow-md">
        <Toaster />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nama" className="block text-gray-800">
              Name:
              <input
                type="text"
                name="name"
                value={data.name || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="deskripsi" className="block text-gray-800">
              Deskripsi:
              <input
                type="text"
                name="description"
                value={data.description || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="alamat" className="block text-gray-800">
              Alamat:
              <input
                type="text"
                name="address"
                value={data.address || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="birthDate" className="block text-gray-800">
              Tanggal Lahir:
              <input
                type="date"
                name="birthDate"
                value={data.birthDate || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="photoLink" className="block text-gray-800">
              Gambar (link):
              <input
                type="text"
                name="photoLink"
                value={data.photoLink || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:bg-indigo-900 w-full"
          >
            Update Data
          </button>
        </form>
      </section>
    </>
  );
};
export default EditDataComp;
