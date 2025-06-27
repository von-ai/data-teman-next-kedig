"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { fetchWithSessionRefresh } from "@/app/utils/fetchWithSessionRefresh";
import SearchBarComp from "./SearchBar";

const DataComp = () => {
  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/data`;
        const res = await fetchWithSessionRefresh(url, {
          method: "GET",
        });

        const result = await res.json();
        if (Array.isArray(result.data)) {
          setApiData(result.data);
          setFilteredData(result.data);
        } else {
          toast.error("Format data tidak sesuai");
          setApiData([]);
          setFilteredData([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data dari server:", err);
        toast.error("Gagal mengambil data");
        setApiData([]);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (keyword) => {
    const result = apiData.filter((item) =>
      item.name?.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(result);
  };

  const handleDelete = async (item) => {
    try {
      const res = await fetchWithSessionRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${item.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Data tidak ditemukan");
        } else if (res.status === 500) {
          toast.error("Server error, coba lagi nanti");
        } else {
          toast.error(`Gagal hapus: ${res.status}`);
        }
        return;
      }

      toast.success("Data berhasil dihapus");

      setApiData((prev) => prev.filter((d) => d.id !== item.id));
      setFilteredData((prev) => prev.filter((d) => d.id !== item.id));
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Tidak dapat menghapus data. Periksa koneksi.");
    }
  };

  const formatDate = (dateString) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const date = new Date(dateString);
    if (isNaN(date)) return "Tanggal tidak valid";

    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${monthName} ${year}`;
  };

  return (
    <section className="min-h-screen px-4 py-10 bg-white">
      <Toaster position="top-right" />
      <div className="flex justify-end pb-8 mb-6">
        <SearchBarComp onSearch={handleSearch} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden bg-white shadow-md rounded-xl"
            >
              <img
                src={item.photoLink || "/noneImage.svg"}
                alt="Foto Temanmu"
                className="object-cover w-full h-48"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">Deskripsi: {item.description}</p>
                <p className="text-gray-600">Alamat: {item.address}</p>
                <p className="text-gray-600">
                  Tanggal Lahir: {formatDate(item.birthDate)}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-3 py-1 text-sm text-indigo-700 transition duration-200 border border-indigo-600 rounded-lg hover:bg-indigo-50 hover:shadow"
                  >
                    Delete
                  </button>
                  <Link href={`/editData/${item.id}`}>
                    <button className="px-3 py-1 text-sm text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Tidak ada data ditemukan.
          </p>
        )}
      </div>
    </section>
  );
};

export default DataComp;
