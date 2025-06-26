"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeSlash } from "iconsax-react";
import xss from "xss";

const RegistComp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmationPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmationPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const OTP_RESEND_WAIT_SECONDS = 60;

  const [isInitializing, setIsInitializing] = useState(true);

  const sanitizeInput = (input) => {
    return xss(input.trim(), {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script"],
    });
  };

  const hasXSSAttempt = (original, sanitized) => {
    return original.trim() !== sanitized;
  };

  const validateInputSafety = (input, fieldName) => {
    const sanitized = sanitizeInput(input);
    if (hasXSSAttempt(input, sanitized)) {
      return `${fieldName} tidak valid`;
    }
    return null;
  };

  const validateFieldBasic = (name, value, formData) => {
    const sanitizedValue = name.includes("password")
      ? value
      : sanitizeInput(value);

    switch (name) {
      case "fullName":
        if (!sanitizedValue || sanitizedValue.trim() === "") {
          return "Nama lengkap harus diisi";
        }
        if (sanitizedValue.length > 191) {
          return "Nama lengkap terlalu panjang (maksimal 191 karakter)";
        }
        const namePattern = /^[A-Za-zÀ-ÿ]+(?:[' -][A-Za-zÀ-ÿ]+)*$/;
        if (!namePattern.test(sanitizedValue)) {
          return "Nama hanya boleh mengandung huruf, spasi, tanda kutip, dan tanda hubung";
        }
        return "";

      case "email":
        if (!sanitizedValue || sanitizedValue.trim() === "") {
          return "Email harus diisi";
        }
        if (sanitizedValue.length > 191) {
          return "Email terlalu panjang (maksimal 191 karakter)";
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(sanitizedValue)) {
          return "Format email tidak valid";
        }
        return "";

      case "password":
        if (!value) {
          return "Password harus diisi";
        }
        if (value.length < 8) {
          return "Password minimal 8 karakter";
        }
        if (value.length > 191) {
          return "Password terlalu panjang (maksimal 191 karakter)";
        }
        const passwordPattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordPattern.test(value)) {
          return "Password harus mengandung huruf kecil, huruf besar, angka, dan karakter khusus";
        }
        return "";

      case "confirmationPassword":
        if (!value) {
          return "Konfirmasi password harus diisi";
        }
        if (value !== formData.password) {
          return "Konfirmasi password tidak sama dengan password";
        }
        return "";

      default:
        return "";
    }
  };

  const validateFieldComplete = (name, value, formData) => {
    const xssError = validateInputSafety(value, name);
    if (xssError) {
      return xssError;
    }

    return validateFieldBasic(name, value, formData);
  };

  useEffect(() => {
    const savedOtpState = localStorage.getItem("otp_verification_state");
    if (savedOtpState) {
      try {
        const parsed = JSON.parse(savedOtpState);
        const { email, timestamp } = parsed;

        const sanitizedEmail = sanitizeInput(email);
        if (hasXSSAttempt(email, sanitizedEmail)) {
          localStorage.removeItem("otp_verification_state");
        } else {
          const now = Date.now();
          if (now - timestamp < 600000) {
            setIsOtpSent(true);
            setUserEmail(sanitizedEmail);

            const timeSinceOtp = Math.floor((now - timestamp) / 1000);
            if (timeSinceOtp < 3) {
              setResendTimer(3 - timeSinceOtp);
              setCanResend(false);
            }
          } else {
            localStorage.removeItem("otp_verification_state");
          }
        }
      } catch (error) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      const savedOtpState = localStorage.getItem("otp_verification_state");
      const EXPIRY_DURATION_MS = 2.5 * 60 * 1000;

      if (savedOtpState) {
        try {
          const { timestamp } = JSON.parse(savedOtpState);
          const now = Date.now();

          if (now - timestamp >= EXPIRY_DURATION_MS) {
            localStorage.removeItem("otp_verification_state");
            setIsOtpSent(false);
            setOtpCode("");
            setUserEmail("");
          }
        } catch (error) {
          localStorage.removeItem("otp_verification_state");
        }
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getErrorMessage = (error, context = "") => {
    if (typeof error === "string") {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (typeof error?.error === "string") {
      return error.error;
    }

    const defaultMessages = {
      register: "Gagal mendaftar. Silakan coba lagi.",
      verify: "Gagal memverifikasi OTP. Silakan coba lagi.",
      resend: "Gagal mengirim ulang OTP. Silakan coba lagi.",
      network: "Koneksi bermasalah. Periksa internet Anda.",
    };

    return defaultMessages[context] || "Terjadi kesalahan. Silakan coba lagi.";
  };

  const validateFormForSubmit = () => {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateFieldComplete(key, formData[key], formData);
      errors[key] = error;
      if (error) isValid = false;
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 255) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateFieldBasic(name, value, {
      ...formData,
      [name]: value,
    });
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((vis) => !vis);
  };

  const prepareSanitizedData = (formData) => {
    return {
      fullName: sanitizeInput(formData.fullName),
      email: sanitizeInput(formData.email),
      password: formData.password,
      confirmationPassword: formData.confirmationPassword,
    };
  };

  const handleAddNewUser = async (e) => {
    e.preventDefault();

    if (!validateFormForSubmit()) {
      toast.error("Periksa data yang Anda masukkan");
      return;
    }

    try {
      const sanitizedData = prepareSanitizedData(formData);

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Kode OTP telah dikirim ke email Anda!");
        const sanitizedEmail = sanitizeInput(formData.email);
        setUserEmail(sanitizedEmail);
        setIsOtpSent(true);

        localStorage.setItem(
          "otp_verification_state",
          JSON.stringify({
            email: sanitizedEmail,
            timestamp: Date.now(),
          })
        );

        setResendTimer(OTP_RESEND_WAIT_SECONDS);
        setCanResend(false);
      } else {
        if (response.status === 409) {
          toast.error("Email sudah terdaftar. Silakan gunakan email lain.");
        } else if (response.status === 400) {
          toast.error("Data yang Anda masukkan tidak valid. Periksa kembali.");
        } else if (response.status === 429) {
          toast.error("Terlalu banyak percobaan. Coba lagi nanti.");
        } else if (response.status === 500) {
          toast.error("Terjadi kesalahan server. Silakan coba lagi nanti.");
        } else {
          toast.error(getErrorMessage(data, "register"));
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Terjadi kesalahan jaringan. Silakan coba lagi.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.trim() === "") {
      toast.error("Masukkan kode OTP terlebih dahulu");
      return;
    }

    if (otpCode.length !== 6) {
      toast.error("Kode OTP harus 6 digit");
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      toast.error("Kode OTP hanya boleh berisi angka");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/verify`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          email: userEmail,
          otpCode: otpCode.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registrasi berhasil! Selamat datang!");
        localStorage.removeItem("otp_verification_state");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        const errorMsg = getErrorMessage(data, "verify");

        if (errorMsg.includes("OTP is invalid or has expired.")) {
          toast.error("Silahkan coba registrasi ulang");
          localStorage.removeItem("otp_verification_state");
          handleBackToRegister();
        } else if (response.status === 400) {
          toast.error("Kode OTP tidak valid atau sudah kedaluwarsa");
        } else if (response.status === 401) {
          toast.error("Kode OTP tidak valid");
        } else if (response.status === 404) {
          toast.error("Email tidak ditemukan. Silakan registrasi ulang.");
        } else if (response.status === 429) {
          toast.error("Terlalu banyak percobaan. Coba lagi nanti.");
        } else if (response.status === 500) {
          toast.error("Terjadi kesalahan server. Silakan coba lagi nanti.");
        } else {
          toast.error(getErrorMessage(data, "verify"));
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Server error. Silakan coba lagi nanti.");
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    if (!userEmail) {
      toast.error("Terjadi kesalahan. Silakan registrasi ulang.");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/resend-otp`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Kode OTP baru telah dikirim!");

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
        if (response.status === 429) {
          const errorMsg = getErrorMessage(data, "resend");
          const waitMatch =
            errorMsg.match(/wait (\d+) seconds/i) ||
            errorMsg.match(/(\d+) detik/i);

          if (waitMatch) {
            const remainingSeconds = parseInt(waitMatch[1]);
            setResendTimer(remainingSeconds);
            setCanResend(false);
            toast.error(`Tunggu beberapa saat lagi sebelum mengirim ulang`);
          } else {
            toast.error(
              "Terlalu banyak permintaan. Tunggu beberapa saat lagi!"
            );
          }
        } else if (response.status === 500) {
          toast.error("Terjadi kesalahan server. Silakan coba lagi nanti.");
        } else {
          toast.error("Server error. Silakan coba lagi nanti.");
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Server error. Silakan coba lagi nanti.");
    }
  };

  const handleBackToRegister = () => {
    setIsOtpSent(false);
    setOtpCode("");
    setResendTimer(0);
    setCanResend(true);
    localStorage.removeItem("otp_verification_state");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtpCode(value);
    }
  };

  return (
    <section>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
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
                      className="block mb-1 text-center text-gray-600"
                    >
                      Kode OTP:
                    </label>
                    <input
                      type="text"
                      id="otpCode"
                      name="otpCode"
                      value={otpCode}
                      onChange={handleOtpChange}
                      className="w-full px-4 py-3 text-lg tracking-widest text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000000"
                      maxLength="6"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      spellCheck="false"
                    />
                    <p className="mt-2 text-xs text-center text-gray-500">
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
                    className="w-full py-2 !mt-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-300"
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
                        className="text-sm font-medium text-blue-600 rounded hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                      maxLength={255}
                      autoComplete="name"
                      spellCheck="false"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.fullName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Fulan bin Fulan"
                    />
                    {formData.fullName.length >= 240 && (
                      <span className="text-xs text-orange-500">
                        Mendekati batas maksimal karakter!
                      </span>
                    )}
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.fullName}
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
                      maxLength={255}
                      autoComplete="email"
                      spellCheck="false"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="you@example.com"
                    />
                    {formData.email.length >= 240 && (
                      <span className="text-xs text-orange-500">
                        Mendekati batas maksimal karakter!
                      </span>
                    )}
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.email}
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
                      maxLength={255}
                      autoComplete="new-password"
                      spellCheck="false"
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
                    {formData.password.length >= 240 && (
                      <span className="text-xs text-orange-500">
                        Mendekati batas maksimal karakter!
                      </span>
                    )}
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.password}
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
                      maxLength={255}
                      autoComplete="new-password"
                      spellCheck="false"
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
                    {formData.confirmationPassword.length >= 240 && (
                      <span className="text-xs text-orange-500">
                        Mendekati batas maksimal karakter!
                      </span>
                    )}
                    {formErrors.confirmationPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.confirmationPassword}
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
                      className="font-medium text-blue-700 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
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
