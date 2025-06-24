'use client';

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeSlash } from 'iconsax-react';
import { Link } from 'react-router-dom';

const RegistComp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmationPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmationPassword: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: false }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((vis) => !vis);
  };

  const handleAddNewUser = async (e) => {
    e.preventDefault();

    const isValid = Object.values(formData).every((val) => val.trim() !== '');
    if (!isValid) {
      setFormErrors({
        fullName: formData.fullName.trim() === '',
        email: formData.email.trim() === '',
        password: formData.password === '',
        confirmationPassword: formData.confirmationPassword === '',
      });
      return;
    }

    if (formData.password !== formData.confirmationPassword) {
      toast.error('Password dan konfirmasi password tidak sesuai.');
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmationPassword: formData.confirmationPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Registered:', data);
        toast.success('Akun Anda berhasil dibuat.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        // const rawMessage = data.message || data.error || 'Gagal registrasi';
        // const message =
        //   typeof rawMessage === 'string'
        //     ? rawMessage
        //     : JSON.stringify(rawMessage);
        toast.error(
          'Password harus mengandung huruf besar, angka, dan karakter khusus'
        );
      }
    } catch (err) {
      console.log('Fetch error:', err);
      toast.error('Terjadi kesalahan, silakan coba lagi.');
    }
  };

  return (
    <section>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Register
          </h2>
          <form onSubmit={handleAddNewUser} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block mb-1 text-gray-600">
                Nama Lengkap:
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Fulan bin Fulan"
              />
              {formErrors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  Nama lengkap harus diisi
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
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
                  formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <p className="text-red-500">Email harus diisi dengan benar</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block mb-1 text-gray-600">
                Password:
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  formErrors.fullName ? 'border-red-500' : 'border-gray-300'
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

            {/* Confirmation Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmationPassword"
                className="block mb-1 text-gray-600"
              >
                Konfirmasi Password:
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="confirmationPassword"
                id="confirmationPassword"
                value={formData.confirmationPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {formErrors.confirmationPassword && (
                <p className="mt-1 text-sm text-red-500">
                  Konfirmasi Password harus diisi
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-700">
            Sudah punya akun?{' '}
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
