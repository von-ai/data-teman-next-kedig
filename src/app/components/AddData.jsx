"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetchWithSessionRefresh } from "../utils/fetchWithSessionRefresh";
import xss from "xss";

const AddData = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    birthDate: "",
    photoLink: "",
  });

  const todayDate = new Date().toISOString().split("T")[0];

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitizeInput = (input) => {
    return xss(input.trim(), {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script"],
    });
  };

  const isValidURL = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};

    const sanitizedData = {
      name: sanitizeInput(formData.name),
      description: sanitizeInput(formData.description),
      address: sanitizeInput(formData.address),
      photoLink: formData.photoLink.trim(),
    };

    const hasXSSAttempt = (original, sanitized) => {
      return original.trim() !== sanitized;
    };

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi.";
    } else if (hasXSSAttempt(formData.name, sanitizedData.name)) {
      newErrors.name = "Nama tidak valid.";
    } else if (sanitizedData.name.length > 191) {
      newErrors.name = "Nama maksimal 191 karakter.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi.";
    } else if (hasXSSAttempt(formData.description, sanitizedData.description)) {
      newErrors.description = "Deskripsi tidak valid.";
    } else if (sanitizedData.description.length > 191) {
      newErrors.description = "Deskripsi maksimal 191 karakter.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat wajib diisi.";
    } else if (hasXSSAttempt(formData.address, sanitizedData.address)) {
      newErrors.address = "Alamat tidak valid.";
    } else if (sanitizedData.address.length > 191) {
      newErrors.address = "Alamat maksimal 191 karakter.";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Tanggal lahir wajib diisi.";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (birthDate > today) {
        newErrors.birthDate = "Tanggal lahir tidak boleh di masa depan.";
      } else if (age > 150) {
        newErrors.birthDate = "Tanggal lahir tidak valid.";
      }
    }

    if (!sanitizedData.photoLink) {
      newErrors.photoLink = "Link gambar wajib diisi.";
    } else if (!isValidURL(sanitizedData.photoLink)) {
      newErrors.photoLink = "Link gambar tidak valid. Harus berupa HTTPS URL.";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, sanitizedData };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 191 && name !== "birthDate") {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddNewData = async () => {
    if (isSubmitting) return;

    const { isValid, sanitizedData } = validate();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/data`;

      const dataToSend = {
        ...sanitizedData,
        birthDate: formData.birthDate,
      };

      const response = await fetchWithSessionRefresh(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("✨ Data berhasil ditambahkan!");
        setFormData({
          name: "",
          description: "",
          address: "",
          birthDate: "",
          photoLink: "",
        });
        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
      } else {
        const err = await response.json();
        toast.error(err.message || "Gagal menambahkan data.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-white">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl p-8 space-y-4 bg-white shadow-2xl rounded-3xl">
        <h2 className="mb-10 text-3xl font-bold tracking-wide text-center text-black">
          Tambah Data Teman
        </h2>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {[
            { label: "Nama", name: "name", type: "text", maxLength: 191 },
            {
              label: "Deskripsi",
              name: "description",
              type: "text",
              maxLength: 191,
            },
            { label: "Alamat", name: "address", type: "text", maxLength: 191 },
            {
              label: "Tanggal Lahir",
              name: "birthDate",
              type: "date",
              max: todayDate,
            },
            { label: "Gambar (link)", name: "photoLink", type: "url" },
          ].map(({ label, name, type, maxLength, max = undefined }) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                maxLength={maxLength}
                {...(max ? { max } : {})}
                autoComplete="off"
                spellCheck="false"
                className={`w-full px-4 py-2 text-gray-800 transition border rounded-xl focus:ring-2 focus:outline-none ${
                  errors[name]
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
                placeholder={`Masukkan ${label.toLowerCase()}`}
              />
              {maxLength && formData[name].length >= maxLength && (
                <span className="text-xs text-orange-500">
                  Telah melebihi maksimal karakter!
                </span>
              )}
              {errors[name] && (
                <span className="text-sm text-red-500">{errors[name]}</span>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddNewData}
            disabled={isSubmitting}
            className={`w-full py-3 text-lg font-semibold text-white transition shadow-md rounded-xl ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Menambahkan..." : "Tambah Sekarang"}
          </button>
        </form>

        <div className="text-center">
          <a href="/home">
            <button className="inline-block w-full px-6 py-2 font-semibold text-indigo-700 transition duration-200 border border-indigo-600 rounded-xl hover:bg-indigo-50 hover:shadow">
              Kembali
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AddData;
