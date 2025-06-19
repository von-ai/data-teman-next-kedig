'use client';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from 'next/image';
// import noneImage from '../../../public/noneImage.svg';
import { Toaster, toast } from 'react-hot-toast';

const DataComp = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = '#';
        const response = await fetch(url);
        const result = await response.json();
        console.log('Data dari API:', result);
        setApiData(result.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();
  }, []);

  async function handleDelete(item) {
    try {
      const res = await fetch('#', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([item._id]),
      });
      const data = await res.json();
      console.log(data);

      toast.success('data berhasil dihapus');

      setApiData((prevData) =>
        prevData.filter((dataItem) => dataItem._id !== item._id)
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
          {apiData.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <Image
                src={item.gambar || '../../../public/noneImage.svg'}
                alt="Foto Temanmu"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">Deskripsi: {item.deksripsi}</p>
                <p className="text-gray-600">Alamat: {item.alamat}</p>
                <p className="text-gray-600">
                  Tanggal Lahir: {formatDate(item.tanggal_lahir)}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/edit-data/${item._id}`}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg text-sm"
                  >
                    Edit
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
