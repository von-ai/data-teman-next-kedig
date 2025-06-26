"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeSlash } from "iconsax-react";

const RegistComp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmationPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmationPassword: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const OTP_RESEND_WAIT_SECONDS = 60;

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedOtpState = localStorage.getItem("otp_verification_state");
    if (savedOtpState) {
      const { email, timestamp } = JSON.parse(savedOtpState);
      const now = Date.now();
      if (now - timestamp < 600000) {
        setIsOtpSent(true);
        setUserEmail(email);

        const timeSinceOtp = Math.floor((now - timestamp) / 1000);
        if (timeSinceOtp < 3) {
          setResendTimer(3 - timeSinceOtp);
          setCanResend(false);
        }
      } else {
        localStorage.removeItem("otp_verification_state");
      }
    }

    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const getErrorMessage = (err) => {
    if (!err) return "Terjadi kesalahan";
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      if (err.message) return err.message;
      if (err.error) {
        if (typeof err.error === "string") return err.error;
        if (err.error.message) return err.error.message;
        return JSON.stringify(err.error);
      }
      try {
        return JSON.stringify(err);
      } catch {
        return "Unknown error";
      }
    }
    return "Terjadi kesalahan";
  };

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

    const isValid = Object.values(formData).every((val) => val.trim() !== "");
    if (!isValid) {
      setFormErrors({
        fullName: formData.fullName.trim() === "",
        email: formData.email.trim() === "",
        password: formData.password === "",
        confirmationPassword: formData.confirmationPassword === "",
      });
      return;
    }

    if (formData.password !== formData.confirmationPassword) {
      toast.error("Password dan konfirmasi password tidak sesuai.");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP dikirim ke email Anda");
        setUserEmail(formData.email);
        setIsOtpSent(true);

        localStorage.setItem(
          "otp_verification_state",
          JSON.stringify({
            email: formData.email,
            timestamp: Date.now(),
          })
        );

        setResendTimer(OTP_RESEND_WAIT_SECONDS);
        setCanResend(false);
      } else {
        toast.error(getErrorMessage(data));
      }
    } catch (err) {
      console.log("Fetch error:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error("Kode OTP wajib diisi");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/verify`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otpCode }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Registrasi berhasil. Silakan login.");
        // Hapus state OTP dari localStorage setelah berhasil
        localStorage.removeItem("otp_verification_state");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error(getErrorMessage(data));
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    console.log("Resending OTP for email:", userEmail);
    if (!userEmail) {
      toast.error("Email tidak ditemukan. Silakan registrasi ulang.");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/resend-otp`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP dikirim ulang ke email");

        localStorage.setItem(
          "otp_verification_state",
          JSON.stringify({
            email: userEmail,
            timestamp: Date.now(),
          })
        );

        setResendTimer(OTP_RESEND_WAIT_SECONDS);
        setCanResend(false);
      } else {
        const errorMsg = getErrorMessage(data);
        const waitMatch = errorMsg.match(/wait (\d+) seconds/);
        if (waitMatch) {
          const remainingSeconds = parseInt(waitMatch[1]);
          setResendTimer(remainingSeconds);
          setCanResend(false);
        }
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleBackToRegister = () => {
    setIsOtpSent(false);
    setOtpCode("");
    setResendTimer(0);
    setCanResend(true);
    localStorage.removeItem("otp_verification_state");
  };

  return (
    <section>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
          {isInitializing ? (
            <div className="text-center ">
              <div className="w-8 h-8 mx-auto mb-4 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                  {isOtpSent ? "Verifikasi OTP" : "Register"}
                </h2>
                {isOtpSent && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      Kode OTP telah dikirim ke:{" "}
                      <span className="font-medium">{userEmail}</span>
                    </p>
                  </div>
                )}
              </div>

              {isOtpSent ? (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="otpCode"
                      className="block mb-1 text-gray-600"
                    >
                      Kode OTP:
                    </label>
                    <input
                      type="text"
                      id="otpCode"
                      name="otpCode"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan kode OTP"
                      maxLength="6"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Periksa folder spam jika tidak ditemukan di inbox
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 !mt-3 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Verifikasi OTP
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToRegister}
                    className="w-full py-2 !mt-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Kembali ke Registrasi
                  </button>

                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Tidak menerima kode?{" "}
                    </span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Kirim ulang OTP
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Tunggu {resendTimer} detik
                      </span>
                    )}
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddNewUser} className="space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block mb-1 text-gray-600"
                    >
                      Nama Lengkap:
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.fullName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Fulan bin Fulan"
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-500">
                        Nama lengkap harus diisi
                      </p>
                    )}
                  </div>

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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="you@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        Email harus diisi dengan benar
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block mb-1 text-gray-600"
                    >
                      Password:
                    </label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Password"
                    />
                    <div
                      className="absolute text-gray-500 cursor-pointer right-3 top-10"
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
                      htmlFor="confirmationPassword"
                      className="block mb-1 text-gray-600"
                    >
                      Konfirmasi Password:
                    </label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="confirmationPassword"
                      id="confirmationPassword"
                      value={formData.confirmationPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.confirmationPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Konfirmasi Password"
                    />
                    <div
                      className="absolute text-gray-500 cursor-pointer right-3 top-10"
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
                        Konfirmasi password wajib diisi
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Register
                  </button>

                  <p className="mt-6 text-center text-gray-700">
                    <span>Sudah punya akun?</span>{" "}
                    <a
                      href="/login"
                      className="font-medium text-blue-700 hover:underline"
                    >
                      Login
                    </a>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegistComp;
