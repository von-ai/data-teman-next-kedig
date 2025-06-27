"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { fetchWithSessionRefresh } from "@/app/utils/fetchWithSessionRefresh";
import xss from "xss";

const EditDataComp = () => {
  const router = useRouter();
  const { id } = useParams();

  const [data, setData] = useState({
    name: "",
    description: "",
    address: "",
    birthDate: "",
    photoLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

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
      name: sanitizeInput(data.name),
      description: sanitizeInput(data.description),
      address: sanitizeInput(data.address),
      photoLink: data.photoLink.trim(),
    };

    const hasXSSAttempt = (original, sanitized) => {
      return original.trim() !== sanitized;
    };

    if (!data.name.trim()) {
      newErrors.name = "Nama wajib diisi.";
    } else if (hasXSSAttempt(data.name, sanitizedData.name)) {
      newErrors.name = "Nama tidak valid.";
    } else if (sanitizedData.name.length > 191) {
      newErrors.name = "Nama maksimal 191 karakter.";
    }

    if (!data.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi.";
    } else if (hasXSSAttempt(data.description, sanitizedData.description)) {
      newErrors.description = "Deskripsi tidak valid.";
    } else if (sanitizedData.description.length > 191) {
      newErrors.description = "Deskripsi maksimal 191 karakter.";
    }

    if (!data.address.trim()) {
      newErrors.address = "Alamat wajib diisi.";
    } else if (hasXSSAttempt(data.address, sanitizedData.address)) {
      newErrors.address = "Alamat tidak valid.";
    } else if (sanitizedData.address.length > 191) {
      newErrors.address = "Alamat maksimal 191 karakter.";
    }

    if (!data.birthDate) {
      newErrors.birthDate = "Tanggal lahir wajib diisi.";
    } else {
      const birthDate = new Date(data.birthDate);
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

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetchWithSessionRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${id}`,
          { method: "GET" }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal mengambil data");

        const result = json.data || json;

        setData({
          name: result.name || "",
          description: result.description || "",
          address: result.address || "",
          birthDate: result.birthDate ? result.birthDate.slice(0, 10) : "",
          photoLink: result.photoLink || "",
        });
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error(err.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 191 && name !== "birthDate") {
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const { isValid, sanitizedData } = validate();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...sanitizedData,
        birthDate: data.birthDate,
      };

      const res = await fetchWithSessionRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Update gagal");
      }

      toast.success("✨ Data berhasil diupdate!");
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (err) {
      console.error("Error updating:", err);
      toast.error(err.message || "Error saat update");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="py-4 text-center">Loading…</p>;

  return (
    <section className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-indigo-50 via-white to-white">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl p-8 space-y-6 bg-white shadow-2xl rounded-3xl">
        <h2 className="text-3xl font-bold tracking-wide text-center text-indigo-800">
          Edit Data Teman
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={data[name]}
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
              {maxLength && data[name].length >= maxLength && (
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
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-lg font-semibold text-white transition shadow-md rounded-xl ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/home")}
            className="w-full py-2 mt-2 font-semibold text-indigo-700 transition border border-indigo-600 hover:bg-indigo-50 rounded-xl"
          >
            Kembali
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditDataComp;
