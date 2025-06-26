"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeSlash } from "iconsax-react";
import xss from "xss";

const LoginComp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const sanitizeInput = (input) => {
    return xss(input.trim(), {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script"],
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const hasXSSAttempt = (original, sanitized) => {
    return original.trim() !== sanitized;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 255) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: false });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const { email, password } = formData;
    const errors = { email: false, password: false };
    let isValid = true;

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!email.trim()) {
      errors.email = true;
      isValid = false;
      toast.error("Email harus diisi");
      return { isValid, errors, sanitizedData: null };
    }

    if (!password.trim()) {
      errors.password = true;
      isValid = false;
      toast.error("Password harus diisi");
      return { isValid, errors, sanitizedData: null };
    }

    if (hasXSSAttempt(email, sanitizedEmail)) {
      errors.email = true;
      isValid = false;
      toast.error("Email tidak valid");
      return { isValid, errors, sanitizedData: null };
    }

    if (hasXSSAttempt(password, sanitizedPassword)) {
      errors.password = true;
      isValid = false;
      toast.error("Password tidak valid");
      return { isValid, errors, sanitizedData: null };
    }

    if (!isValidEmail(sanitizedEmail)) {
      errors.email = true;
      isValid = false;
      toast.error("Format email tidak valid");
      return { isValid, errors, sanitizedData: null };
    }

    if (sanitizedEmail.length > 191) {
      errors.email = true;
      isValid = false;
      toast.error("Email melampaui batas maksimal.");
      return { isValid, errors, sanitizedData: null };
    }

    if (sanitizedPassword.length < 6) {
      errors.password = true;
      isValid = false;
      toast.error("Password minimal 6 karakter");
      return { isValid, errors, sanitizedData: null };
    }

    if (sanitizedPassword.length > 191) {
      errors.password = true;
      isValid = false;
      toast.error("Password melampaui batas maksimal.");
      return { isValid, errors, sanitizedData: null };
    }

    return {
      isValid,
      errors,
      sanitizedData: {
        email: sanitizedEmail,
        password: sanitizedPassword,
      },
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { isValid, errors, sanitizedData } = validateForm();

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
          body: JSON.stringify(sanitizedData),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Login berhasil!");
        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
      } else if (response.status === 401) {
        toast.error("Kredensial tidak valid. Silakan coba lagi.");
      } else if (response.status === 429) {
        toast.error("Terlalu banyak percobaan. Silakan coba lagi nanti.");
      } else {
        toast.error("Server error. Silakan coba lagi nanti.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Koneksi error. Silakan coba lagi nanti.");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-indigo-50 via-white to-white">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={255}
              autoComplete="email"
              spellCheck="false"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {formData.email.length >= 250 && (
              <span className="text-xs text-orange-500">
                Mendekati batas maksimal karakter!
              </span>
            )}
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-500">Email tidak valid.</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-gray-600">
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              maxLength={255}
              autoComplete="current-password"
              spellCheck="false"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your password"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute text-gray-500 cursor-pointer right-3 top-10"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  togglePasswordVisibility();
                }
              }}
            >
              {passwordVisible ? (
                <Eye size="20" color="#000000" />
              ) : (
                <EyeSlash size="20" color="#000000" />
              )}
            </div>
            {formData.password.length >= 250 && (
              <span className="text-xs text-orange-500">
                Mendekati batas maksimal karakter!
              </span>
            )}
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-500">Password tidak valid.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700">
          <span>Belum punya akun?</span>{" "}
          <a
            href="/register"
            className="font-medium text-blue-700 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default LoginComp;
