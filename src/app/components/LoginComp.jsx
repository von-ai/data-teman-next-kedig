'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react';
import { Eye, EyeSlash } from 'iconsax-react';
import { Link } from 'iconsax-react';

const LoginComp = () => {
  const [apiData, setApiData] = useState([]);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    nama: false,
    email: false,
    password: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setFormErrors({ ...formErrors, [name]: false });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = '//';
        const response = await fetch(url);
        const result = await response.json();
        setApiData(result.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const user = apiData.find(
      (user) =>
        user.email === formData.email && user.password === formData.password
    );
    if (user) {
      toast.success('login berhasil');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      toast.error('Email atau Password Salah! Silakan cek kembali');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* <Toaster position="top-right" /> */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-600">
              Email
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
              <p className="mt-1 text-sm text-red-500">
                Email harus diisi dengan benar.
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-gray-600">
              Password
            </label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your password"
            />

            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {passwordVisible ? (
                <Eye size="20" color="#000000" />
              ) : (
                <EyeSlash size="20" color="#000000" />
              )}
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-500">Password harus diisi.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700">
          <span>Belum punya akun?</span>{' '}
          <a
            href="/register"
            className="font-medium text-blue-700 hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default LoginComp;
