'use client';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
// import { toast } from "react-toastify";

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
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data added successfully:', result);
        toast.success('data berhasil ditambahkan');

        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      } else {
        toast('Data tidak berhasil di Input');
        console.log('Failed to add data:', response.statusText);
        console.log(response);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md mb-8">
      <Toaster />
      <form>
        <div className="mb-4">
          <label htmlFor="nama" className="block text-gray-800">
            Nama:
          </label>
          <input
            type="text"
            name="name"
            id="nama"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="deskripsi" className="block text-gray-800">
            Deskripsi:
          </label>
          <input
            type="text"
            name="description"
            id="deskripsi"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="alamat" className="block text-gray-800">
            Alamat:
          </label>
          <input
            type="text"
            name="address"
            id="alamat"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tanggal_lahir" className="block text-gray-800">
            Tanggal Lahir:
          </label>
          <input
            type="date"
            name="birthDate"
            id="tanggal_lahir"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="gambar" className="block text-gray-800">
            Gambar (link):
          </label>
          <input
            type="text"
            name="photoLink"
            id="gambar"
            value={formData.photoLink}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddNewData}
          className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:bg-indigo-900 w-full"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddData;
