"use client";
import { AddCircle } from "iconsax-react";
import DataComp from "./DataComp";
import { Header } from "./Header";
import { useState, useEffect } from "react";

const HomeComp = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          { credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && result?.data?.fullName) {
          setUserName(result.data.fullName);
        } else {
          setUserName("Teman ✨");
        }
      } catch (err) {
        console.error("Gagal ambil user:", err);
        setUserName("Teman ✨");
      }
    };

    fetchUser();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <Header />

      <div className="px-6 py-8 mx-auto max-w-7xl xl:max-w-[95dvw]">
        <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
          <h1 className="text-3xl font-extrabold text-indigo-900 md:text-4xl drop-shadow-sm">
            ✨ Welcome, {userName} ✨
          </h1>

          <a href="/tambahData">
            <div className="hidden md:block">
              <button className="px-6 py-2 font-semibold tracking-wide text-white transition bg-indigo-700 shadow-md hover:bg-indigo-800 rounded-xl">
                + Tambah Data
              </button>
            </div>
            <div className="block md:hidden">
              <AddCircle size="36" color="#4f46e5" />
            </div>
          </a>
        </div>

        <div className="p-4 bg-white border border-gray-100 shadow-xl rounded-xl">
          <DataComp />
        </div>
      </div>
    </section>
  );
};

export default HomeComp;
