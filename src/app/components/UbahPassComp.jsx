"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { fetchWithSessionRefresh } from "../utils/fetchWithSessionRefresh";
import xss from "xss";
import { Eye, EyeSlash } from "iconsax-react";

const UbahPassComp = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

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

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmationPassword
    ) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    if (formData.newPassword !== formData.confirmationPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    const sanitizedOld = sanitizeInput(formData.oldPassword);
    const sanitizedNew = sanitizeInput(formData.newPassword);
    const sanitizedConfirm = sanitizeInput(formData.confirmationPassword);

    if (
      hasXSSAttempt(formData.oldPassword, sanitizedOld) ||
      hasXSSAttempt(formData.newPassword, sanitizedNew) ||
      hasXSSAttempt(formData.confirmationPassword, sanitizedConfirm)
    ) {
      toast.error("Input mengandung karakter tidak valid!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetchWithSessionRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal mengganti password");
      }

      toast.success("Password berhasil diubah!");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat mengganti password");
    } finally {
      setLoading(false);
    }
  };

  const getInputType = (fieldName) => {
    if (fieldName === "oldPassword") {
      return showOldPassword ? "text" : "password";
    }
    if (fieldName === "newPassword" || fieldName === "confirmationPassword") {
      return showNewPassword ? "text" : "password";
    }
    return "password";
  };

  const shouldShowEyeIcon = (fieldName) => {
    return (
      fieldName === "oldPassword" ||
      fieldName === "newPassword" ||
      fieldName === "confirmationPassword"
    );
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-indigo-50 via-white to-white">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-3xl">
        <h2 className="text-2xl font-bold text-center text-indigo-800">
          Ubah Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Password Lama", name: "oldPassword", type: "password" },
            { label: "Password Baru", name: "newPassword", type: "password" },
            {
              label: "Konfirmasi Password Baru",
              name: "confirmationPassword",
              type: "password",
            },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="font-medium text-gray-700">
                {label}
              </label>
              <div className="relative">
                <input
                  type={getInputType(name)}
                  name={name}
                  id={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder={`Masukkan ${label.toLowerCase()}`}
                />
                {shouldShowEyeIcon(name) && (
                  <button
                    type="button"
                    onClick={
                      name === "oldPassword"
                        ? toggleOldPasswordVisibility
                        : togglePasswordVisibility
                    }
                    className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
                  >
                    {name === "oldPassword" ? (
                      showOldPassword ? (
                        <Eye size="20" color="#000000" />
                      ) : (
                        <EyeSlash size="20" color="#000000" />
                      )
                    ) : showNewPassword ? (
                      <Eye size="20" color="#000000" />
                    ) : (
                      <EyeSlash size="20" color="#000000" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            {loading ? "Memproses..." : "Ubah Password"}
          </button>
        </form>

        <div className="text-center ">
          <button
            onClick={() => router.push("/profile")}
            className="inline-block w-full px-5 py-2 font-semibold text-indigo-700 transition border border-indigo-600 rounded-xl hover:bg-indigo-50"
          >
            Kembali ke Profil
          </button>
        </div>
      </div>
    </section>
  );
};

export default UbahPassComp;
