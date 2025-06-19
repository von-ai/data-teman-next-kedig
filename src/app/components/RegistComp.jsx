'use client';

import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from 'react';
import { Eye, EyeSlash } from 'iconsax-react';
import { Link } from 'react-router-dom';

const RegistComp = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    nama: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // State to track if password is visible or not
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Reset form error when user starts typing in a field
    setFormErrors({ ...formErrors, [name]: false });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    // cek value ada isinya atau tidak
    const isFormValid = Object.values(formData).every((value) => value !== '');
    if (!isFormValid) {
      setFormErrors({
        nama: formData.nama === '',
        email: formData.email === '',
        password: formData.password === '',
        confirmPassword: formData.confirmPassword === '',
      });
      return;
    }
    // cek password sama atau nda
    if (formData.password !== formData.confirmPassword) {
      toast.error('Pasword dan konfirmasi password tidak sesuai.');
      return;
    }
    try {
      const url = '#';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            name: formData.nama,
            email: formData.email,
            password: formData.password,
          },
        ]),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data added successfully:', result);
        toast.success('Akun Anda berhasil dibuat');

        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        console.log('Failed to add data:', response.statusText);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <section>
      {/* <Toaster /> */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Register
          </h2>
          <form onSubmit={handleAddNewUser} className="space-y-6">
            <div className="mb-4">
              <label htmlFor="nama" className="block mb-1 text-gray-600">
                Nama Lengkap:
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                value={formData.nama}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  formErrors.nama ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Fulan bin Fulan"
              />
              {formErrors.nama && (
                <p className="mt-1 text-sm text-red-500">
                  Nama lengkap harus diisi
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 text-gray-600">
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <p className="text-red-500">Email harus diisi dengan benar</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block mb-1 text-gray-600">
                Password:
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'} // Use text type if passwordVisible is true
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Password"
              />

              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <Eye size="20" color="#000000" />
                ) : (
                  <EyeSlash size="20" color="#000000" />
                )}
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  Password harus diisi
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-gray-600"
              >
                Konfirmasi Password:
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'} // Use text type if passwordVisible is true
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  formErrors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                } `}
                placeholder="Konfirmasi Password"
              />

              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <Eye size="20" color="#000000" />
                ) : (
                  <EyeSlash size="20" color="#000000" />
                )}
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  Konfirmasi Password harus diisi
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-700">
            <span>Sudah punya akun?</span>{' '}
            <a
              href="/login"
              className="font-medium text-blue-700 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegistComp;
