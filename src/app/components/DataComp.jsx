'use client';
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import Image from 'next/image';
// import noneImage from '../../../public/noneImage.svg';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

const DataComp = () => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/data`;
        console.log('🔍 Fetching from:', url);

        const response = await fetch(url, {
          credentials: 'include',
        });
        const result = await response.json();
        if (Array.isArray(result)) {
          setApiData(result);
        } else if (Array.isArray(result.data)) {
          setApiData(result.data);
        } else {
          toast.error('⚠️ Format data tidak sesuai:', result);
          setApiData([]);
        }
      } catch (err) {
        console.error('❌ Gagal mengambil data dari server:', err);
        toast.error('Gagal mengambil data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  async function handleDelete(item) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify([item.id]),
      });
      const data = await res.json();
      console.log(data);

      toast.success('data berhasil dihapus');

      setApiData((prevData) =>
        prevData.filter((dataItem) => dataItem.id !== item.id)
      );
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  function formatDate(dateString) {
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1]) - 1;
    const day = dateParts[2];
    const monthName = months[monthIndex];
    return `${day} ${monthName} ${year}`;
  }
  return (
    <>
      <section className="min-h-screen bg-gray-50 px-4 py-10">
        <Toaster position="top-right" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.isArray(apiData) &&
            apiData.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white shadow-md rounded-xl overflow-hidden"
              >
                <img
                  src={item.photoLink || '/noneImage.svg'}
                  width={300}
                  height={400}
                  alt="Foto Temanmu"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">Deskripsi: {item.description}</p>
                  <p className="text-gray-600">Alamat: {item.address}</p>
                  <p className="text-gray-600">
                    Tanggal Lahir: {formatDate(item.birthDate)}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                    >
                      Delete
                    </button>
                    {/* <a
                      href={`/editData/${item.id}`}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg text-sm"
                    >
                      Edit
                    </a> */}
                    <Link href={`/editData/${item.id}`}>
                      <button className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg text-sm">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default DataComp;
